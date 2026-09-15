---
title: "SaveStringToFileASCII"
description: "Creates or replaces a file with BOM-free text encoded using Delphi's seven-bit ASCII encoding."
sidebar_position: 46
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - text
  - ascii
  - destructive
---

```Delphi
Procedure SaveStringToFileASCII( const aContents, aFileName : string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  SaveStringToFileASCII('EDI-CONTROL-1001',
    'C:\Fictional\Outbound\edi-control.txt');
end;
```

### Usage

`SaveStringToFileASCII` creates or replaces a file with BOM-free text encoded using Velox's seven-bit ASCII encoding.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aContents` | `string`, `const` | Text intended to contain only ASCII characters. |
| `aFileName` | `string`, `const` | Destination path; parent directories are not created. |

**Returns**

This procedure has no return value. Normal return does not verify the number of bytes stored.

**Errors**

Open and conversion/allocation exceptions propagate. Velox write failure can be silent because its returned count is ignored. Verify output length/content when correctness matters.

**Usage notes**

Use ASCII for deliberately constrained protocols or identifiers. Use UTF-8 when general Unicode text is allowed.

### Additional Technical Info
`SaveStringToFileASCII` creates or replaces a file with Delphi seven-bit ASCII bytes. Use it only when the text contract is ASCII; characters outside that repertoire are not preserved. No BOM or length prefix is emitted, and the current helper does not check the terminal write count.

The example uses fictional ASCII text/path and would replace the destination. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The exact runtime pointer selects `TEncoding.ASCII` and delegates to the shared string-file writer. An exclusive `TFileStream` creates/truncates the destination before conversion. `GetBytes` produces the byte array; `StringToFileStream` calls `Write` once, ignores its count and rewinds the destination before the outer `finally` closes it.

On Windows, Delphi requests code page 20127 and falls back to OEM US code page 437 only when 20127 is unavailable.

**Edge cases and quirks**

- ASCII characters `0`-`127` have the expected one-byte representation. General Unicode and high characters are outside the contract and follow the installed conversion's substitution/failure path.
- No preamble is emitted. This is suitable for ASCII, but not evidence that arbitrary output is UTF-8.
- Empty text truncates/creates a zero-byte file.
- Embedded U+0000 encodes as a zero byte; line endings are not changed.
- Creation/truncation occurs before encoding, and direct replacement has no rollback.
- Installed `THandleStream.Write` can return zero/short on failure; the helper ignores the result and may return normally with incomplete output.
- A Windows symbolic-link destination is followed and its target truncated by the underlying `CREATE_ALWAYS` open.

**Side effects**

Creates or irreversibly replaces the destination and may lose non-ASCII characters during conversion.

**Performance and concurrency**

Linear conversion and write with the full encoded array in memory. The file is held exclusively while open, but replacement is synchronous, non-atomic and unverified.

**Related entries**

- [`LoadFileToStringASCII`](LoadFileToStringASCII.md) performs the corresponding decode.
- [`SaveStringToFileUTF8`](SaveStringToFileUTF8.md) writes general Unicode as UTF-8.
- [`SaveBytesToFile`](SaveBytesToFile.md) writes caller-supplied bytes without encoding.

**External references**

- [Embarcadero `TEncoding.ASCII`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TEncoding.ASCII), [`TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TStream.Write`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Write) - the selected Delphi encode/write path.
- [Free Pascal `TEncoding.ASCII`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.ascii.html) and [`TStream.Write`](https://www.freepascal.org/docs-html/rtl/classes/tstream.write.html) - compatible context; Velox follows installed Delphi conversion and its own unchecked write.
- [Microsoft `CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) - the Windows create/truncate and symbolic-link behaviour below the common writer.

<small>Created 2026-07-15</small>
