---
title: ftDataSet
description: Identifies a nested dataset field whose rows and child fields are owned and exposed by the parent provider.
sidebar_position: 96
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, nested, structured, ownership]
---

```Delphi
ftDataSet = 29
```

### Example

```Delphi
function IsNestedDataSet(Field: TField): Boolean;
begin
  Result := Field.DataType = ftDataSet;
end;
```

### Usage

`ftDataSet` identifies a nested dataset field whose rows and child fields are owned and exposed by the parent provider.

### Additional Technical Info
`ftDataSet` is ordinal 29 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TDataSetField`, which exposes a `NestedDataSet` and child `Fields` under a structured parent value.

This is a nested rowset, not a connection or an independent top-level dataset. Its lifecycle, current row, editability and update propagation remain tied to the parent field/dataset. Do not free the nested dataset or retain it after the parent closes, scrolls or destroys its fields.

When mapping, define whether a Null parent, empty nested dataset and one row of Null children are distinct. Preserve row order only when the provider/schema defines it. Repeated navigation can trigger provider work; process each nested dataset in a bounded pass.

The example only inspects metadata and was source-reviewed; no nested dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TDataSetField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TDataSetField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; nested-dataset parity is not implied.

<small>Created 2026-07-15</small>
