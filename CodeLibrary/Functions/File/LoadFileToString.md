---
title: "LoadFileToString"
description: "Reads an entire file as text using BOM detection with ASCII fallback."
sidebar_position: 27
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - text
  - encoding
  - byte order mark
---

```Delphi
Function LoadFileToString( const aFileName : string) : string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LoadFileToString('C:\Fictional\Inbound\message.txt');
end;
```

### Usage

`LoadFileToString` reads an entire file as text using BOM detection with ASCII fallback.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string`, `const` | Path of the text file. Relative paths are resolved against the Velox process current directory. |

**Returns**

The decoded Velox string. A stable empty file returns an empty string.

**Behaviour**

- BOM detection tries UTF-8, UTF-16LE and UTF-16BE preambles; it is not statistical encoding detection.
- BOM-free bytes are decoded as ASCII. BOM-free UTF-8 is safe only while every byte is in the ASCII range.
- UTF-32 and other encodings are not detected.
- The complete file is decoded as one string; line endings and embedded U+0000 characters are not removed.

**Errors**

File-open, seek, allocation, read and encoding failures propagate. A recognised malformed UTF-8 payload can raise `EEncodingError`. No partial string is returned.

**Usage notes**

Use this routine only when the input contract permits BOM selection and ASCII fallback. Prefer an explicit encoding-specific loader for deterministic integration formats.

### Additional Technical Info
`LoadFileToString` reads the complete file, recognises a leading UTF-8, UTF-16LE or UTF-16BE byte-order mark (BOM), removes that preamble and decodes the remaining bytes. When none of those BOMs is present, the current implementation uses Delphi's seven-bit ASCII encoding—not ANSI and not UTF-8.

The example reads a fictional text file. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The script runtime deliberately registers adapter `LoadFileToString_P` to select the public one-argument overload. That overload calls `vxFiles.LoadFileToString(aFileName, nil)`, which opens a `TFileStream` using `fmOpenRead or fmShareDenyNone` and delegates to `vxStream.FileStreamToString`.

The helper rewinds the stream, narrows `Size` to `LongInt`, allocates and reads one byte array, then calls installed Studio 37.0 `TEncoding.GetBufferEncoding` with `TEncoding.ASCII` as its explicit fallback. It passes the returned BOM length to `GetString`, so a recognised preamble is excluded from the result.

**Edge cases and quirks**

- This fallback differs from [`StreamToString`](../Conversion/StreamToString.md), whose related stream helper passes ANSI. The two similarly named entries can therefore decode the same BOM-free high bytes differently.
- The fallback also differs from default [`SaveStringToFile`](SaveStringToFile.md), which writes with `TEncoding.Default` when no encoding is supplied. A non-ASCII default-encoded file is not a reliable round trip through this loader unless it includes a supported BOM or an explicit loader is used.
- The helper stores file size in signed `LongInt`; files outside that range are unsupported and may fail during narrowing or allocation.
- A single `Read` return count is ignored. Concurrent truncation can leave zero-filled bytes in the decode buffer, while growth beyond the captured size is ignored.
- `fmShareDenyNone` permits concurrent writing, so the returned text is not guaranteed to represent one atomic file version.

**Side effects**

Opens and reads the file. It does not deliberately modify it.

**Performance and concurrency**

The complete byte array and decoded string coexist in memory. Time and peak memory are linear in file size. Coordinate writers and impose an input-size limit where files are not already governed.

**Related entries**

- [`LoadFileToStringUTF8`](LoadFileToStringUTF8.md), [`LoadFileToStringUTF16`](LoadFileToStringUTF16.md) and [`LoadFileToStringUTF16BE`](LoadFileToStringUTF16BE.md) select fixed Unicode encodings.
- [`LoadFileToBytes`](LoadFileToBytes.md) avoids text interpretation.
- [`StreamToString`](../Conversion/StreamToString.md) has similar BOM handling but a different no-BOM fallback.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create), [`TEncoding.GetBufferEncoding`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBufferEncoding) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the exact Delphi open, BOM-selection and decode APIs reached by Velox.
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html), [`TEncoding.GetBufferEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.getbufferencoding.html) and [`TEncoding.GetString`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.getstring.html) - compatible API context; Velox's ASCII fallback and edge behaviour follow its own helper and installed Delphi source.

<small>Created 2026-07-15</small>
