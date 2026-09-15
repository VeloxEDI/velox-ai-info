---
title: "SaveStringToFileUTF8"
description: "Creates or replaces a file with BOM-free UTF-8 text."
sidebar_position: 49
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - text
  - utf-8
  - destructive
---

```Delphi
Procedure SaveStringToFileUTF8( const aContents, aFileName : string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  SaveStringToFileUTF8('Fictional payload',
    'C:\Fictional\Outbound\message-utf8.txt');
end;
```

### Usage

`SaveStringToFileUTF8` creates or replaces a file with BOM-free UTF-8 text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aContents` | `string`, `const` | Velox Unicode text to encode as UTF-8. |
| `aFileName` | `string`, `const` | Destination path; the parent directory must already exist. |

**Returns**

This procedure has no return value. Normal return does not verify that every encoded byte was written.

**Errors**

File-construction, allocation and encoding exceptions propagate. Velox write failure may be silent. Verify important output independently before treating it as delivered.

### Additional Technical Info
`SaveStringToFileUTF8` creates or replaces a file with BOM-free UTF-8 bytes. It is the normal portable choice for new Unicode text files, but the current helper directly truncates the destination and ignores the terminal `Write` count.

The example targets fictional text/path and would replace that file. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The direct registration calls the shared native writer with `TEncoding.UTF8`. It creates/truncates an exclusive `TFileStream`, obtains a complete byte array through installed `TUTF8Encoding.GetBytes`, calls `TStream.Write` once and ignores the returned count, rewinds, then closes the handle in `finally`.

`GetBytes` returns content bytes only; `GetPreamble` is never requested.

**Edge cases and quirks**

- No UTF-8 BOM (`EF BB BF`) is emitted. A consumer that requires one must be handled separately.
- The installed UTF-8 encoder uses permissive Unicode-to-byte conversion flags. Malformed UTF-16 surrogate input can be replaced rather than rejected; the procedure is not a string-validity test.
- Empty text creates/truncates a zero-byte file.
- Embedded U+0000 is encoded as byte `00`; line endings and Unicode normalisation are unchanged.
- Destination truncation occurs before encoding. A later allocation/conversion exception leaves the previous file lost.
- A zero/short low-level write can return normally because its count is ignored.
- On Windows, a symbolic-link destination is followed and its target truncated by the underlying `CREATE_ALWAYS` call.

**Side effects**

Creates or irreversibly replaces the destination file.

**Performance and concurrency**

The complete UTF-8 array coexists with the source string and is written synchronously. The exclusive handle is temporary; direct replacement is not atomic and has no rollback or post-write verification.

**Remarks**

UTF-8 avoids host code-page dependency. It does not remove the need for safe path handling, size limits and verified/atomic file publication where required.

**Related entries**

- [`LoadFileToStringUTF8`](LoadFileToStringUTF8.md) decodes UTF-8 but preserves a leading BOM as U+FEFF.
- [`SaveStringToFileANSI`](SaveStringToFileANSI.md) uses a host-dependent legacy encoding.
- [`SaveBytesToFile`](SaveBytesToFile.md) writes already encoded bytes.

**External references**

- [Embarcadero `TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TEncoding.UTF8), [`TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TStream.Write`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Write) - the selected Delphi encoding and unchecked-write path.
- [Free Pascal `TUTF8Encoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tutf8encoding.html) and [`TStream.Write`](https://www.freepascal.org/docs-html/rtl/classes/tstream.write.html) - compatible UTF-8/stream context; current malformed-surrogate behaviour follows installed Delphi.
- [Microsoft `CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) - the direct Windows create/truncate and link-following terminal.

<small>Created 2026-07-15</small>
