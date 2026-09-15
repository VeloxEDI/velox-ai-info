---
title: ftVariant
description: Identifies a Variant-valued field whose runtime subtype, Null, Empty and conversion behavior remain part of each value.
sidebar_position: 137
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, variant, 'null', empty, subtype]
---

```Delphi
ftVariant = 32
```

### Example

```Delphi
function IsVariantField(Field: TField): Boolean;
begin
  Result := Field.DataType = ftVariant;
end;
```

### Usage

`ftVariant` identifies a Variant-valued field whose runtime subtype, Null, Empty and conversion behaviour remain part of each value.

### Additional Technical Info
`ftVariant` is ordinal 32 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TVariantField`, which stores/converts a complete Variant rather than one fixed scalar family.

Inspect the runtime Variant subtype before converting. Null, Empty, Unassigned, numeric widths, dates, strings, arrays, interfaces and custom Variants have different semantics. Stringifying first can lose type, precision, locale, array bounds and Null/Empty distinctions; direct numeric/date conversions can raise.

Do not assume every provider preserves every Variant subtype or by-reference flag. Normalize to an explicit destination schema and define unsupported-subtype handling. Avoid retaining live interface/object Variants beyond their owner.

The example only inspects metadata and was source-reviewed; no Variant conversion, interface, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType), [`TVariantField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TVariantField) and [`Variant`](https://docwiki.embarcadero.com/Libraries/en/System.Variant).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference.

<small>Created 2026-07-15</small>
