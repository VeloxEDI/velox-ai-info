---
title: "LoadFileToStringUTF16BE"
description: "Reads an entire file as big-endian UTF-16 text without BOM detection."
sidebar_position: 31
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - text
  - utf-16be
  - big endian
---

```Delphi
Function LoadFileToStringUTF16BE( const aFileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LoadFileToStringUTF16BE('C:\Fictional\Inbound\message-utf16be.txt');
end;
```

### Usage

`LoadFileToStringUTF16BE` reads an entire file as big-endian UTF-16 text without BOM detection.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string`, `const` | Path of a file whose byte contract is UTF-16 big-endian. |

**Returns**

The decoded Velox string, or an empty string for a stable empty file.

**Errors**

File-open, seek, allocation and read failures propagate. Odd length and malformed surrogate structure are not rejected by the current decoder.

**Usage notes**

Confirm the byte order from the integration contract. Do not choose this function solely because a file appears to contain a BOM.

### Additional Technical Info
`LoadFileToStringUTF16BE` reads the complete file as big-endian UTF-16 code units. It does not negotiate byte order or remove a preamble.

The example reads a fictional UTF-16BE file. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The registered function calls the shared loader with `TEncoding.BigEndianUnicode`. After `TFileStream` opens the file read-only with `fmShareDenyNone`, `vxStream.FileStreamToString` reads the captured bytes. Installed `TBigEndianUnicodeEncoding` uses the inherited UTF-16 character count and combines each byte pair in big-endian order into a Delphi `WideChar` code unit.

**Edge cases and quirks**

- A leading `FE FF` UTF-16BE BOM becomes U+FEFF in the result; explicit decoding does not remove it.
- An odd trailing byte is silently ignored because the character count is `ByteCount div 2`.
- Surrogate pairs are not validated. Unpaired surrogate code units can remain in the result.
- Little-endian input is byte-swapped into different characters rather than auto-detected.
- The helper has a signed-`LongInt` size boundary, ignores a short read and allows concurrent writers through the file share mode.

**Side effects**

Opens and reads the file without deliberately altering it.

**Performance and concurrency**

Linear time and memory in file size; input bytes and output text coexist. The shared file can change while being read, so the result is not an atomic snapshot.

**Related entries**

- [`LoadFileToStringUTF16`](LoadFileToStringUTF16.md) selects little-endian UTF-16.
- [`SaveStringToFileUTF16BE`](SaveStringToFileUTF16BE.md) writes BOM-free UTF-16BE.
- [`LoadFileToString`](LoadFileToString.md) detects and consumes supported BOMs.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create), [`TEncoding.BigEndianUnicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.BigEndianUnicode) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the selected Delphi file and UTF-16BE decode path.
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html), [`TEncoding.BigEndianUnicode`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.bigendianunicode.html) and [`TBigEndianUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tbigendianunicodeencoding.html) - compatible byte-order context; installed Delphi defines current edge behaviour.

<small>Created 2026-07-15</small>
