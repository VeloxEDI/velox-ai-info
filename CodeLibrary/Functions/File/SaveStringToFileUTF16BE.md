---
title: "SaveStringToFileUTF16BE"
description: "Creates or replaces a file with BOM-free big-endian UTF-16 text."
sidebar_position: 48
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
  - destructive
---

```Delphi
Procedure SaveStringToFileUTF16BE( const aContents, aFileName : string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  SaveStringToFileUTF16BE('Fictional payload',
    'C:\Fictional\Outbound\message-utf16be.txt');
end;
```

### Usage

`SaveStringToFileUTF16BE` creates or replaces a file with BOM-free big-endian UTF-16 text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aContents` | `string`, `const` | Velox UTF-16 code units to byte-swap into big-endian order. |
| `aFileName` | `string`, `const` | Destination file path. |

**Returns**

This procedure has no return value and does not verify the stored byte count.

**Behaviour**

- Output is normally two bytes per Velox code unit.
- No BOM, terminator, length prefix or line-ending transformation is added.
- Empty text produces a zero-byte replacement.

**Errors**

Open, allocation and encoding exceptions propagate. Low-level write failure may instead be silent. Verify size/content for critical output.

### Additional Technical Info
`SaveStringToFileUTF16BE` creates or replaces a file with the Delphi string's UTF-16 code units in big-endian byte order. It emits no `FE FF` BOM, performs no surrogate validation and does not check how many bytes the terminal write accepted.

The example targets fictional text/path and would replace that destination. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The direct runtime pointer selects `TEncoding.BigEndianUnicode`. After exclusive create/truncate, installed `TBigEndianUnicodeEncoding.GetBytes` emits the high byte then low byte of each Delphi `Char`. The shared helper calls `Write` once, ignores its return and rewinds before the outer `finally` closes the file.

**Edge cases and quirks**

- Many Windows tools assume UTF-16LE or require a BOM; this BOM-free big-endian file may need an explicit receiving contract.
- Surrogate structure is not validated. Unpaired surrogates are emitted as raw byte-swapped code units.
- A little-endian consumer will decode different characters rather than infer byte order.
- The destination is truncated before conversion and replacement has no rollback.
- Zero/short `TStream.Write` results are ignored and can look like success.
- A Windows symbolic-link destination is followed, so `CREATE_ALWAYS` truncates its target rather than the link object.

**Side effects**

Creates or irreversibly replaces the destination file.

**Performance and concurrency**

Linear conversion/write with a full encoded array in memory. The file is exclusive during the call, but direct publication is synchronous, non-atomic and unverified.

**Remarks**

Select this entry only when the receiver explicitly requires BOM-free UTF-16BE.

**Related entries**

- [`LoadFileToStringUTF16BE`](LoadFileToStringUTF16BE.md) decodes explicit UTF-16BE.
- [`SaveStringToFileUTF16`](SaveStringToFileUTF16.md) writes little-endian code units.
- [`SaveStringToFileUTF8`](SaveStringToFileUTF8.md) is generally more interoperable.

**External references**

- [Embarcadero `TEncoding.BigEndianUnicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.BigEndianUnicode), [`TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TStream.Write`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Write) - the exact Delphi byte-swap and unchecked-write path.
- [Free Pascal `TBigEndianUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tbigendianunicodeencoding.html) and [`TStream.Write`](https://www.freepascal.org/docs-html/rtl/classes/tstream.write.html) - compatible byte-order/stream context; current behaviour follows installed Delphi.
- [Microsoft `CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) - the Windows create/truncate and symbolic-link terminal.

<small>Created 2026-07-15</small>
