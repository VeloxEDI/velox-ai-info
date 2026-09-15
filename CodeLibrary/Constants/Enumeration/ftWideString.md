---
title: ftWideString
description: Identifies variable Unicode character data whose declared Size and database encoding remain provider-level metadata.
sidebar_position: 139
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, string, unicode, size]
---

```Delphi
ftWideString = 24
```

### Example

```Delphi
function IsUnicodeString(Field: TField): Boolean;
begin
  Result := Field.DataType = ftWideString;
end;
```

### Usage

`ftWideString` identifies variable Unicode character data whose declared Size and database encoding remain provider-level metadata.

### Additional Technical Info
`ftWideString` is declaration ordinal 24 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies a bounded, variable-length Unicode character field.

The installed RTL maps it to `TWideStringField`, which descends from `TStringField` but uses Delphi Unicode strings and wide-character buffers. A new base string field begins with `Size = 20`; live field definitions override that metadata. `Size` is not a portable byte limit: database characters, Unicode scalar values, UTF-16 code units and encoded storage bytes can differ.

Use this family when the provider exposes Unicode-capable text. Converting it to ANSI can lose characters. Conversely, the enum does not guarantee that the destination database accepts every Unicode value or preserves normalization, supplementary characters or trailing spaces. Those properties depend on the driver, database character set and collation.

Null remains distinct from `''`. Validate length using the destination's definition rather than Delphi's string length alone, and do not assume that local case/ordering rules reproduce database comparisons. Use [`ftFixedWideChar`](ftFixedWideChar.md) for fixed-width metadata and [`ftWideMemo`](ftWideMemo.md) for large Unicode text.

The example only inspects metadata and was source-reviewed; no Unicode, collation, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TWideStringField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TWideStringField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TWideStringField`](https://www.freepascal.org/docs-html/fcl/db/twidestringfield.html) compatibility references.

<small>Created 2026-07-15</small>
