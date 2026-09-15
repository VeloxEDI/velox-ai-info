---
title: "LoadFileToStringASCII"
description: "Reads an entire file as text using Delphi's seven-bit ASCII encoding."
sidebar_position: 29
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - text
  - ascii
---

```Delphi
Function LoadFileToStringASCII( const aFileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LoadFileToStringASCII('C:\Fictional\Inbound\edi-control.txt');
end;
```

### Usage

`LoadFileToStringASCII` reads an entire file as text using Velox's seven-bit ASCII encoding.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string`, `const` | Path of the file whose bytes are contractually ASCII. |

**Returns**

The decoded string, or an empty string for a stable empty file.

**Errors**

File-open, seek, allocation, read and conversion errors propagate. No partial string is returned.

**Usage notes**

ASCII is appropriate for deliberately restricted protocol elements and control files. Choose [`LoadFileToStringUTF8`](LoadFileToStringUTF8.md) when general Unicode text is allowed.

### Additional Technical Info
`LoadFileToStringASCII` reads a complete file through Delphi's seven-bit ASCII decoder. Use it only when the file contract restricts content to ASCII bytes; it is not a generic single-byte or UTF-8 loader.

The example reads a fictional ASCII control file. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The script registration binds directly to `vxFiles.LoadFileToStringASCII`, which calls the shared overload with `TEncoding.ASCII`. A `TFileStream` opens the file read-only with `fmShareDenyNone`; `vxStream.FileStreamToString` rewinds, reads the captured byte count and invokes the installed encoding's `GetString`. Explicit encoding bypasses BOM detection.

On Windows, Delphi requests code page 20127 for ASCII. The installed RTL falls back to OEM US code page 437 only if that code page is unavailable.

**Edge cases and quirks**

- Bytes `0`-`127` have portable ASCII meanings. High bytes are outside the declared contract and follow the current OS/RTL conversion or failure path.
- UTF-8 and UTF-16 BOMs are decoded as ordinary non-ASCII input rather than removed.
- Embedded zero bytes become U+0000 characters in the result.
- The helper narrows file size to signed `LongInt`, ignores a short single-read count and allows concurrent writing to the open file.
- The no-suffix [`LoadFileToString`](LoadFileToString.md) currently uses this same ASCII encoding only when no supported BOM is found; this explicit entry never performs the initial BOM check.

**Side effects**

Opens and reads the file without deliberately altering it.

**Performance and concurrency**

Linear time and memory in file size; the bytes and result string coexist. Concurrent writers can cause inconsistent or zero-padded decoded input, so use a stable source file.

**Related entries**

- [`SaveStringToFileASCII`](SaveStringToFileASCII.md) performs the corresponding ASCII encoding.
- [`LoadFileToStringUTF8`](LoadFileToStringUTF8.md) decodes UTF-8.
- [`LoadFileToBytes`](LoadFileToBytes.md) returns uninterpreted bytes.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create), [`TEncoding.ASCII`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TEncoding.ASCII) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the selected Delphi open and ASCII decode path.
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html) and [`TEncoding.ASCII`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.ascii.html) - compatible encoding context; Velox executes installed Delphi RTL behaviour.

<small>Created 2026-07-15</small>
