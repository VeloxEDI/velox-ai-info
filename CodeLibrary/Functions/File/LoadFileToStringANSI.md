---
title: "LoadFileToStringANSI"
description: "Reads an entire file as text using Delphi's system ANSI encoding."
sidebar_position: 28
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - text
  - ansi
  - code page
---

```Delphi
Function LoadFileToStringANSI( const aFileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LoadFileToStringANSI('C:\Fictional\Inbound\legacy-message.txt');
end;
```

### Usage

`LoadFileToStringANSI` reads an entire file as text using Velox's system ANSI encoding.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string`, `const` | Path of a file known to use the Velox host's system ANSI code page. |

**Returns**

The ANSI-decoded Velox string, or an empty string for a stable empty file.

**Errors**

Path, open, seek, allocation, read and conversion failures propagate. No partial text is returned.

**Usage notes**

Use this entry only for a governed legacy contract whose code page matches the Velox host. Prefer UTF-8 for new interchange formats.

### Additional Technical Info
`LoadFileToStringANSI` reads a complete file and decodes every byte with Delphi `TEncoding.ANSI`. On Windows this is the host system ANSI code page captured by a process-wide encoding singleton; it is not UTF-8 and the file does not identify its own code page.

The example reads a fictional legacy text file. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The registered wrapper calls the overloaded `vxFiles.LoadFileToString` with `TEncoding.ANSI`. That function opens a read-only, share-deny-none `TFileStream` and calls `vxStream.FileStreamToString`. The helper reads the complete captured file size and calls `GetString` on the entire byte array. Because an encoding was explicitly supplied, `GetBufferEncoding` is bypassed.

**Edge cases and quirks**

- UTF-8 or UTF-16 BOM bytes are treated as ordinary ANSI bytes; no preamble is detected or removed.
- Bytes above ASCII can produce different text on Velox hosts with different system ANSI code pages. The process-wide singleton captures Windows `GetACP` when first created and remains stable thereafter.
- Current Delphi MBCS conversion is permissive. Invalid or unmappable byte sequences follow the selected Windows code page's conversion/failure behaviour and must not be treated as input validation.
- File size is narrowed to signed `LongInt`; the helper ignores a short `Read` count and permits concurrent writers through `fmShareDenyNone`.
- Embedded zero bytes become U+0000 characters inside the managed string rather than ending the read.

**Side effects**

Opens and reads the file without deliberately modifying it.

**Performance and concurrency**

The full byte buffer and Unicode result coexist in memory. The call is synchronous and is not an atomic snapshot when another process writes the shared file.

**Related entries**

- [`LoadFileToString`](LoadFileToString.md) detects supported BOMs and otherwise falls back to ASCII.
- [`LoadFileToStringUTF8`](LoadFileToStringUTF8.md) provides a portable Unicode byte contract.
- [`SaveStringToFileANSI`](SaveStringToFileANSI.md) performs the corresponding ANSI encoding.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create), [`TEncoding.ANSI`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ANSI) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the exact Delphi file and decoder path used by Velox.
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html) and [`TEncoding.ANSI`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.ansi.html) - compatible code-page context; current Windows conversion behaviour is Delphi-specific.

<small>Created 2026-07-15</small>
