---
title: ftADT
description: Identifies a provider-defined abstract data type represented as a structured object field with named child fields.
sidebar_position: 85
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, adt, structured, fields]
---

```Delphi
ftADT = 26
```

### Example

```Delphi
function IsAbstractDataType(Field: TField): Boolean;
begin
  Result := Field.DataType = ftADT;
end;
```

### Usage

`ftADT` identifies a provider-defined abstract data type represented as a structured object field with named child fields.

### Additional Technical Info
`ftADT` is ordinal 26 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TADTField`, a `TObjectField` containing child `Fields`, indexed `FieldValues` and provider-supplied `ObjectType` metadata.

This is database structured data, not a PascalScript record declaration. Child names, order, nesting, Null behavior, update support and serialization come from the live field definition/provider. Inspect the child fields instead of converting the parent to an undocumented flat string or Variant array. Assignments can update multiple child values and therefore require an editable dataset and provider support.

Do not cache child field objects beyond their dataset/parent lifetime. Validate required children and preserve nested Nulls separately from a Null parent.

The example only inspects metadata and was source-reviewed; no structured-field, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TADTField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TADTField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; ADT provider parity is not implied.

<small>Created 2026-07-15</small>
