---
title: Fields
description: Returns the live TFields collection whose entries expose schema metadata and values for the current record.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, fields, current-record, collection]
---

```Delphi
property Fields: TFields read;
```

### Example

```Delphi
procedure ReadFirstField(const Data: TvxClientDataSet; var Value: Variant);
begin
  if Data.FieldCount > 0 then
    Value := Data.Fields[0].Value;
end;
```

### Usage

Returns the live TFields collection whose entries expose schema metadata and values for the current record.

- Prefer [`FieldByName`](../Methods/FieldByName.md) for stable semantic access; use indexes only under governed schema order.
- Do not free the collection or its dataset-owned fields.
- Check Active/current-row state before reading and enter edit state before writing.

### Additional Technical Info
`Fields` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). The collection is dataset-owned; callers must not free it or retain it beyond dataset/field lifecycle changes.

#### Source-backed behaviour

The property helper returns `FFields` directly. Its zero-based entries are `TField` components, and each field's Value/As... access reads or writes the current record buffer. Writes require edit/insert state and pass through field conversions/events.

Field order drives the positional `AppendRecord` and `InsertRecord` APIs. Closing/reopening or changing field definitions can recreate dynamic field objects, making cached references stale.

#### Related members

[`FieldCount`](FieldCount.md) supplies the valid index range. Visible [`TFields`](../../../Data/TFields.md) documents its own methods/properties.

#### Official RTL references

- [Embarcadero: TDataSet.Fields](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Fields)
- [Free Pascal: TDataSet.Fields](https://www.freepascal.org/docs-html/fcl/db/tdataset.fields.html)

<small>Created 2026-07-15</small>
