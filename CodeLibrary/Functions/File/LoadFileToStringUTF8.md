---
title: "LoadFileToStringUTF8"
description: "Reads an entire file as UTF-8 text without removing a leading BOM."
sidebar_position: 32
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - text
  - utf-8
---

```Delphi
Function LoadFileToStringUTF8( const aFileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LoadFileToStringUTF8('C:\Fictional\Inbound\message-utf8.txt');
end;
```

### Usage

`LoadFileToStringUTF8` reads an entire file as UTF-8 text without removing a leading BOM.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string`, `const` | Path of a file whose bytes are contractually UTF-8. |

**Returns**

The decoded Velox Unicode string. A stable empty file returns an empty string.

**Errors**

Path, open, seek, allocation, read and UTF-8 decoding errors propagate. No partial string is returned.

### Additional Technical Info
`LoadFileToStringUTF8` reads the complete file and decodes it explicitly as UTF-8. It is suitable for BOM-free UTF-8 and for contracts where any leading UTF-8 BOM should remain visible as a character.

The example reads a fictional UTF-8 file. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The registered wrapper calls `vxFiles.LoadFileToString(aFileName, TEncoding.UTF8)`. A read-only `TFileStream` with `fmShareDenyNone` is passed to `vxStream.FileStreamToString`, which captures the file size, reads the complete buffer and invokes installed `TUTF8Encoding.GetString`. Explicit selection bypasses `GetBufferEncoding`.

The current Windows decoder uses code page UTF-8 with invalid-character checking enabled.

**Edge cases and quirks**

- A leading UTF-8 BOM (`EF BB BF`) is decoded as U+FEFF and is not stripped.
- Malformed, overlong, truncated or otherwise invalid UTF-8 raises `EEncodingError` in the current decoder rather than falling back to ANSI or ASCII.
- Embedded U+0000 is preserved in the managed string.
- No Unicode normalisation is performed; canonically equivalent text can remain code-point-distinct.
- The shared helper narrows size to signed `LongInt`, ignores a short read and permits concurrent file writes. Truncation can introduce zero-filled bytes into the decode input; later growth is ignored beyond the captured size.

**Side effects**

Opens and reads the file without deliberately modifying it.

**Performance and concurrency**

The entire byte array and decoded string coexist in memory. Reading is synchronous and is not an atomic snapshot while external writing is permitted.

**Remarks**

If the contract permits an optional UTF-8 BOM and requires it to be consumed, [`LoadFileToString`](LoadFileToString.md) does that—but also falls back to ASCII when no BOM is present. Otherwise remove a permitted BOM through controlled byte processing before explicit decoding.

**Related entries**

- [`SaveStringToFileUTF8`](SaveStringToFileUTF8.md) writes BOM-free UTF-8.
- [`LoadFileToString`](LoadFileToString.md) detects and removes a leading UTF-8 BOM.
- [`LoadFileToBytes`](LoadFileToBytes.md) returns the original encoded bytes.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create), [`TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TEncoding.UTF8) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the exact Delphi file and UTF-8 decode path.
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html), [`TEncoding.UTF8`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.utf8.html) and [`TUTF8Encoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tutf8encoding.html) - compatible UTF-8 context; current strict failure behaviour is Delphi-specific.

<small>Created 2026-07-15</small>
