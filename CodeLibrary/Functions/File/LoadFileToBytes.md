---
title: "LoadFileToBytes"
description: "Reads an entire file into a new byte array without text decoding."
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - bytes
  - binary
---

```Delphi
Function LoadFileToBytes( const aFileName : string) : TBytes;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Data: TBytes;
begin
  Data := LoadFileToBytes('C:\Fictional\Inbound\order.bin');
  Value := Length(Data);
end;
```

### Usage

`LoadFileToBytes` reads an entire file into a new byte array without text decoding.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string`, `const` | Path of the file to open. A relative path is resolved against the Velox process current directory. |

**Returns**

A new zero-based byte array whose allocated length is the file size observed before the read. A stable empty file returns an empty array.

**Behaviour**

- Binary content, embedded zero bytes and any BOM are returned unchanged.
- The returned managed array is independent of the file and is owned by the caller.
- The file is opened read-only, but `fmShareDenyNone` permits other processes to read or write it while this call is active.

**Errors**

Missing files, directories passed as files, invalid paths, access restrictions, sharing conflicts, allocation failure and incomplete reads raise exceptions. No partial array is returned to the script.

**Usage notes**

Use this entry for binary payloads or when the encoding is not yet known. Validate size and provenance before loading an untrusted file into memory.

### Additional Technical Info
`LoadFileToBytes` synchronously reads a complete file into a newly allocated `TBytes` array. It preserves the bytes exactly and performs no text decoding, BOM handling, decompression or content validation.

The example reads a fictional file and returns its byte count. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The script import binds directly to `vxFiles.LoadFileToBytes`. The function creates a `TFileStream` with `fmOpenRead or fmShareDenyNone`, sizes the result from `lFile.Size`, then calls Delphi `TStream.ReadBuffer(TBytes)` with a second live `Size` value. `ReadBuffer` requires that requested count to be read and raises `EReadError` when it cannot complete it. A `finally` block always closes the file stream.

**Edge cases and quirks**

- The two file-size queries are separate. If the file becomes shorter between them, the result keeps the earlier, larger allocation and its unread tail remains zero-filled. If it becomes larger, the fixed result buffer limits the first read and `ReadBuffer` then raises when it cannot satisfy the larger requested count.
- Truncation after the second size query can also produce `EReadError`; growth after that query is simply outside the captured read.
- There is no maximum-size guard. Dynamic-array/platform limits or insufficient memory can fail before any result is returned.
- No extension, expected length, checksum, root-directory or file-type check is performed.

**Side effects**

Opens and reads the named file. It does not deliberately alter the file.

**Performance and concurrency**

Time and additional memory are linear in file size. The entire file is held in memory. The shared-open mode means this is not an atomic snapshot; coordinate writers or use a stable input file when byte consistency matters.

**Related entries**

- [`LoadFileToStream`](LoadFileToStream.md) replaces a caller-owned memory stream with the file bytes.
- [`LoadFileToStringUTF8`](LoadFileToStringUTF8.md) reads a file under an explicit UTF-8 contract.
- [`SaveBytesToFile`](SaveBytesToFile.md) writes a byte array to a file.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create) and [`TStream.ReadBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.ReadBuffer) - the exact Delphi open and fixed-count read APIs reached by Velox.
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html) and [`TStream.ReadBuffer`](https://www.freepascal.org/docs-html/rtl/classes/tstream.readbuffer.html) - compatible stream context; current buffer and race behaviour follows installed Delphi source.

<small>Created 2026-07-15</small>
