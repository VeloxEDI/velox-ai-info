---
title: "SaveStringToFileUTF16"
description: "Creates or replaces a file with BOM-free little-endian UTF-16 text."
sidebar_position: 47
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - text
  - utf-16
  - little endian
  - destructive
---

```Delphi
Procedure SaveStringToFileUTF16( const aContents, aFileName : string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  SaveStringToFileUTF16('Fictional payload',
    'C:\Fictional\Outbound\message-utf16le.txt');
end;
```

### Usage

`SaveStringToFileUTF16` creates or replaces a file with BOM-free little-endian UTF-16 text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aContents` | `string`, `const` | Velox UTF-16 text/code units to write. |
| `aFileName` | `string`, `const` | Destination file path. |

**Returns**

This procedure has no return value. Normal return is not a byte-count verification.

**Behaviour**

- Output length is normally twice `Length(aContents)`.
- No BOM, terminator, length prefix or line-ending conversion is added.
- Empty text creates/truncates a zero-byte file.

**Errors**

Open, allocation and encoding exceptions propagate. Velox write failure can be silent because the returned count is ignored. Verify critical output independently.

**Usage notes**

Use only when the receiving contract explicitly says BOM-free UTF-16LE. UTF-8 is usually more interoperable for new text formats.

### Additional Technical Info
`SaveStringToFileUTF16` creates or replaces a file with the Delphi string's UTF-16 code units in little-endian byte order. It does not emit the `FF FE` BOM, validate surrogate structure or verify the terminal write count.

The example targets fictional content/path and would replace that destination. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The direct registration calls the shared native overload with `TEncoding.Unicode`. The destination is created/truncated exclusively, then installed `TUnicodeEncoding.GetBytes` copies each 16-bit Delphi `Char` into two little-endian bytes. `StringToFileStream` calls `Write` once and ignores its result; the file closes in a `finally` block.

**Edge cases and quirks**

- A consumer that requires a UTF-16 BOM may not recognise this BOM-free file automatically.
- The encoder copies code units without validating surrogate pairing. Unpaired surrogates are preserved as raw UTF-16 units rather than rejected.
- Destination creation/truncation precedes encoding and is non-atomic with no rollback.
- The helper ignores the count from `TStream.Write`. A zero/short operating-system write can therefore return normally with partial output.
- Parent directories, allowed roots, file size, round-trip decoding and final storage durability are not checked.
- An existing Windows symbolic-link path is followed and its target truncated; the link object itself is not opened.

**Side effects**

Creates or irreversibly replaces the destination file.

**Performance and concurrency**

The complete two-byte-per-code-unit array coexists with the source string. The exclusive file handle prevents concurrent opens only during the direct synchronous write; publication is not atomic.

**Related entries**

- [`LoadFileToStringUTF16`](LoadFileToStringUTF16.md) decodes explicit UTF-16LE and will not remove a BOM.
- [`SaveStringToFileUTF16BE`](SaveStringToFileUTF16BE.md) writes the opposite byte order.
- [`SaveStringToFileUTF8`](SaveStringToFileUTF8.md) writes BOM-free UTF-8.

**External references**

- [Embarcadero `TEncoding.Unicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.Unicode), [`TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TStream.Write`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Write) - the exact UTF-16LE and unchecked-write APIs.
- [Free Pascal `TUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tunicodeencoding.html) and [`TStream.Write`](https://www.freepascal.org/docs-html/rtl/classes/tstream.write.html) - compatible UTF-16/stream context; installed Delphi defines the current code-unit copy.
- [Microsoft `CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) - the direct Windows create/truncate and link-following terminal.

<small>Created 2026-07-15</small>
