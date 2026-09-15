---
title: ftArray
description: Identifies a provider-defined database array represented by a structured object field and repeated child metadata.
sidebar_position: 86
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, array, structured, fields]
---

```Delphi
ftArray = 27
```

### Example

```Delphi
function IsDatabaseArray(Field: TField): Boolean;
begin
  Result := Field.DataType = ftArray;
end;
```

### Usage

`ftArray` identifies a provider-defined database array represented by a structured object field and repeated child metadata.

### Additional Technical Info
`ftArray` is ordinal 27 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TArrayField`, a structured `TObjectField`; its default `Size` is 10 but live metadata defines the actual array shape/capacity.

It is not a PascalScript dynamic array and does not imply zero-based indexing, contiguous memory or a particular Variant representation. Element type, bounds, dimensions, Null elements, update behavior and ordering are provider contracts. Use the field's child metadata and preserve the declared order/bounds when mapping.

Do not infer a JSON array or flatten nested values without an explicit schema. Large arrays can create many child fields and values, so avoid repeated full traversal when a single pass suffices.

The example only inspects metadata and was source-reviewed; no array, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TArrayField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TArrayField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; database-array parity is not implied.

<small>Created 2026-07-15</small>
