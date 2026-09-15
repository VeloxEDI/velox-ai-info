---
title: ftFixedWideChar
description: Identifies fixed-width Unicode character data whose declared character length and padding rules are supplied by the provider.
sidebar_position: 102
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, unicode, fixed-width, padding]
---

```Delphi
ftFixedWideChar = 38
```

### Example

```Delphi
function IsFixedUnicodeText(Field: TField): Boolean;
begin
  Result := Field.DataType = ftFixedWideChar;
end;
```

### Usage

`ftFixedWideChar` identifies fixed-width Unicode character data whose declared character length and padding rules are supplied by the provider.

### Additional Technical Info
`ftFixedWideChar` is declaration ordinal 38 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It is the fixed-width member of Delphi's wide-string field family, commonly corresponding to a fixed Unicode database character column.

The installed RTL maps it to `TWideStringField` and treats it as base `ftWideString` for compatibility. The field stores Delphi Unicode strings; conversions to ANSI remain potentially lossy. `Size` normally describes provider-level character capacity rather than a portable byte count. Supplementary Unicode characters, database collation and driver encoding can make code-unit, character and storage-byte counts differ.

Fixed-width providers can return or suppress trailing padding, and comparison behavior can be controlled by the database collation rather than Delphi. Do not trim, normalise Unicode, compare case-insensitively or calculate wire lengths solely from this enum. Apply the explicit source and destination contracts.

Use [`ftFixedChar`](ftFixedChar.md) only for a genuinely narrow encoded field, [`ftWideString`](ftWideString.md) for variable Unicode text, and [`ftWideMemo`](ftWideMemo.md) for large Unicode text. Null is independent of an empty or space-filled string.

The example only inspects metadata and was source-reviewed; no Unicode, collation, padding, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TWideStringField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TWideStringField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TWideStringField`](https://www.freepascal.org/docs-html/fcl/db/twidestringfield.html) compatibility references.

<small>Created 2026-07-15</small>
