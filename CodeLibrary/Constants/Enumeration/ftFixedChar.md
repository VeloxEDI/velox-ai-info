---
title: ftFixedChar
description: Identifies fixed-width narrow character data whose Size, padding and ANSI code-page conversion remain provider-sensitive.
sidebar_position: 101
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, string, fixed-width, ansi, padding]
---

```Delphi
ftFixedChar = 23
```

### Example

```Delphi
function IsFixedNarrowText(Field: TField): Boolean;
begin
  Result := Field.DataType = ftFixedChar;
end;
```

### Usage

`ftFixedChar` identifies fixed-width narrow character data whose Size, padding and ANSI code-page conversion remain provider-sensitive.

### Additional Technical Info
`ftFixedChar` is declaration ordinal 23 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies fixed-width character data in the narrow/ANSI string family, commonly corresponding to a database `CHAR` column.

The installed RTL uses `TStringField`, sets its `FixedChar` property from either this data type or the field-definition fixed attribute, and treats it as base `ftString` during compatibility checks. `Size` is field metadata; it is not reliably a UTF-16 byte count. Encoding and representability depend on the dataset/provider and host code page.

Fixed-width sources may right-pad values, normally with spaces. Providers differ on whether padding is returned, trimmed, preserved during assignment or significant in comparisons. Do not use the enum alone to decide business equality, identifier normalization or message length. Inspect the actual value and destination rules, and trim only when the data contract permits it.

Assigning Unicode characters through a narrow field can replace or lose characters that are not representable in the active encoding. Prefer [`ftFixedWideChar`](ftFixedWideChar.md) for fixed-width Unicode metadata and [`ftString`](ftString.md) when length is variable.

The example only inspects metadata and was source-reviewed; no encoding, padding, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TStringField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TStringField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TStringField`](https://www.freepascal.org/docs-html/fcl/db/tstringfield.html) compatibility references.

<small>Created 2026-07-15</small>
