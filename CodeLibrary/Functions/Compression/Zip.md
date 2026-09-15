---
title: "Zip"
description: "Creates or replaces a ZIP archive from readable files, normally storing each successful source under its backslash-delimited base filename."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compression
  - zip
  - files
---

```Delphi
Function Zip( zip : string; const files : TStringArray) : boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Files: TStringArray;
begin
  SetLength(Files, 2);
  Files[0] := 'C:\Example\input\orders.csv';
  Files[1] := 'C:\Example\input\readme.txt';
  Value := Zip('C:\Example\output\package.zip', Files);
end;
```

### Usage

Creates or replaces a ZIP archive from readable files, normally storing each successful source under its backslash-delimited base filename.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `zip` | `String` | Destination archive path. The file is opened with `CREATE_ALWAYS`, so an existing writable file is truncated before sources are processed. |
| `files` | `TStringArray`, `const` | Ordered source paths. Unreadable or otherwise unprocessable entries can be skipped without an exception or per-file result. |

**Returns**

`True` only when the destination opened, at least one source reached the entry-write path, and all required local, central-directory and end-of-directory writes reported their full byte counts. It is a write-path result, not validation that every source was included or that every compressed entry can be expanded. Returns `False` otherwise.

**Behaviour**

Missing, locked, allocation-failed or short-read sources are silently omitted while processing continues. `True` means the archive was structurally written and contains at least one accepted entry; it does not mean every requested file was included. The archive can contain two entries with the same base name when sources from different directories collide.

**Usage notes**

Pre-validate every source, ensure base filenames are unique, write to a dedicated temporary destination and move it into place only after `True` if the surrounding flow needs stronger atomicity. Because the function does not report omissions, compare the archive against the requested manifest outside this call when completeness is mandatory.

### Additional Technical Info
`Zip` creates a new ZIP archive, or truncates and replaces an existing writable archive, from the readable source paths in `files`. Each included source is normally stored under the part after its final Windows backslash and compressed with deflate method 8. The function returns a Boolean rather than raising for ordinary per-source skips or low-level write failure.

The example uses fictional paths and would replace `package.zip` if it existed. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The PascalScript import points to `vxCompression.Zip`, which calls `vxZip.Zip(zip, files, nil)`. Because `zipAs` is `nil`, the terminal Windows-only writer strips every source path through its final backslash and uses the remaining base filename.

The writer:

1. opens the destination with `CreateFileW`/`CreateFileA`, exclusive write access and `CREATE_ALWAYS`;
2. opens each source with read access while permitting other readers and writers;
3. gets its 32-bit size, allocates one source buffer and a second buffer sized to roughly 110% plus 12 bytes, and reads the complete file;
4. calculates CRC-32, raw-deflates the data and writes a local header, UTF-8 name and compressed payload;
5. records DOS local modification time and Windows attributes in a central-directory record; and
6. writes all accumulated central-directory records and a single end-of-central-directory record.

It sets general-purpose bit 11 (`$0800`) for UTF-8 names, method 8 for deflate and required version 2.0. It adds no archive comment, per-entry extra field or encryption data.

**Edge cases and quirks**

- The destination is created or truncated before the source list is examined. An empty list, or a list with no successful source, returns `False` and the implementation then deletes the destination path. This can destroy a previous archive.
- On any reported archive write failure, the output handle is closed and the destination path is deleted. A deletion failure is ignored.
- Per-source open, allocation and read failures are skips, not exceptions and not a `False` result if some other file succeeds.
- The return value from the custom raw-deflate compressor is stored as the compressed size but is not checked for zero. If that compressor internally catches a failure and returns zero, `Zip` can write a zero-length payload and still return `True`; validate important archives with an independent reader.
- Source sharing permits concurrent writers. The code requires the read byte count to equal the earlier 32-bit size, but equal length does not guarantee stable content.
- All file sizes, compressed sizes, offsets, entry counts and relevant header fields use classic 16- or 32-bit ZIP fields. There is no Zip64 support. Avoid archives approaching 4 GiB, entries approaching 4 GiB or more than 65,535 entries; practical signed/integer and allocation limits are lower.
- The complete source and its compressed form are simultaneously allocated. Zero-length sources depend on the legacy zero-byte allocation path and are not a reliable way to create an empty ZIP entry.
- Name stripping recognises only a backslash (`\`). A source written with forward slashes can retain directory or drive text in the archive name even if Windows accepts that path. Normal backslash-delimited names use only the base filename. Names are UTF-8 and can be empty or duplicated; consumers still need an explicit name/duplicate policy.
- No password, encryption, digital signature, data descriptor, spanning or multi-disk support is added.
- Results from `GetFileTime`, file-time conversion, `GetFileAttributes` and the current-position query are not consistently checked. A metadata/seek failure can therefore leave invalid timestamps, attributes or offsets rather than producing a clear per-entry error.
- The implementation uses legacy Windows version detection and an ANSI fallback for old Windows; current supported Windows systems take the Unicode path.

**Side effects**

Creates, truncates, writes and sometimes deletes `zip`. Opens and reads every source that it can access. The call can therefore overwrite data and must be treated as a controlled filesystem mutation.

**Errors**

Many Win32 failures are collapsed into `False` or a silent per-file skip; `GetLastError` is not exposed. Internal compression failure can also be collapsed to a zero compressed size without forcing `False`. Exceptional conditions such as range, integer-overflow, memory-manager or conversion failures can still propagate. There is no rollback beyond deleting the output path, and no list of omitted files.

**Performance and concurrency**

Files are processed sequentially and each is compressed synchronously in memory. Peak memory is at least the current source size plus its approximately 110% destination allocation and archive bookkeeping. The destination is opened with no sharing, but sources allow concurrent reads and writes. Do not run competing calls against the same destination.

**Related entries**

- [`GZipCompressFile`](GZipCompressFile.md) returns one file's bytes as a gzip member without creating an archive file.
- [`ZLibCompressFile`](ZLibCompressFile.md) returns zlib-wrapped bytes and does not preserve a filename.
- [`File`](../File.md) contains related filesystem operations.

**External references**

- [Library of Congress: ZIP File Format (PKWARE)](https://www.loc.gov/preservation/digital/formats/fdd/fdd000354.shtml)
- [Microsoft `CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) - documents the `CREATE_ALWAYS` truncation semantics used for the destination.

<small>Created 2026-07-15</small>
