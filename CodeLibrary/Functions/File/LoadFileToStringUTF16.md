---
title: "LoadFileToStringUTF16"
description: "Reads an entire file as little-endian UTF-16 text without BOM detection."
sidebar_position: 30
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
---

```Delphi
Function LoadFileToStringUTF16( const aFileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LoadFileToStringUTF16('C:\Fictional\Inbound\message-utf16le.txt');
end;
```

### Usage

`LoadFileToStringUTF16` reads an entire file as little-endian UTF-16 text without BOM detection.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string`, `const` | Path of a file whose byte contract is UTF-16 little-endian. |

**Returns**

The decoded Velox UTF-16 string. A stable empty file returns an empty string.

**Errors**

Path, open, seek, allocation and read failures propagate. Odd byte length and malformed surrogate structure do not themselves raise in the current decoder.

**Usage notes**

Use this entry only for an explicitly little-endian UTF-16 contract. Use [`LoadFileToString`](LoadFileToString.md) when a supported BOM should select the encoding and be consumed.

### Additional Technical Info
`LoadFileToStringUTF16` reads the complete file as little-endian UTF-16 code units. It selects the byte order explicitly and does not inspect or remove a byte-order mark.

The example reads a fictional UTF-16LE file. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The registered function calls `vxFiles.LoadFileToString(aFileName, TEncoding.Unicode)`. That overload opens a read-only, share-deny-none `TFileStream` and passes it to `vxStream.FileStreamToString`. The helper reads the captured file bytes and calls installed `TUnicodeEncoding.GetString`. The decoder calculates `ByteCount div 2` characters and copies little-endian 16-bit code units into the result.

**Edge cases and quirks**

- A leading `FF FE` UTF-16LE BOM becomes U+FEFF in the returned string because explicit decoding does not skip a preamble.
- An odd final byte is silently ignored by the installed `ByteCount div 2` implementation.
- UTF-16 code units are copied without validating surrogate pairing. Unpaired surrogates can remain in the Delphi string.
- Big-endian input is byte-swapped into different characters rather than detected or rejected.
- File size is narrowed to signed `LongInt`; the helper ignores a short read and `fmShareDenyNone` permits a writer to mutate the file during decoding.

**Side effects**

Opens and reads the file without deliberately modifying it.

**Performance and concurrency**

The complete byte buffer and UTF-16 result coexist in memory. The call is synchronous and non-atomic with respect to permitted external writers.

**Related entries**

- [`LoadFileToStringUTF16BE`](LoadFileToStringUTF16BE.md) selects big-endian UTF-16.
- [`SaveStringToFileUTF16`](SaveStringToFileUTF16.md) writes BOM-free UTF-16LE.
- [`LoadFileToBytes`](LoadFileToBytes.md) avoids encoding assumptions.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create), [`TEncoding.Unicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.Unicode) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the exact Delphi file and UTF-16LE decoder path.
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html), [`TEncoding.Unicode`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.unicode.html) and [`TUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tunicodeencoding.html) - compatible UTF-16 context; current odd-byte and surrogate behaviour follows Delphi source.

<small>Created 2026-07-15</small>
