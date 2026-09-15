---
title: FieldCount
description: Returns the number of currently instantiated field components in the dataset's Fields collection.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, fieldcount, schema, index]
---

```Delphi
property FieldCount: Integer read;
```

### Example

```Delphi
procedure CountFields(const Data: TvxClientDataSet; var Count: Integer);
begin
  Count := Data.FieldCount;
end;
```

### Usage

`FieldCount` returns the number of currently instantiated field components in the dataset's Fields collection.

- Re-read after open/schema changes.
- Guard zero before calculating `FieldCount - 1`.
- Do not compare with RecordCount.

#### Usage guidance

- Re-read after open/schema changes.
- Guard zero before calculating `FieldCount - 1`.
- Do not compare with RecordCount.
- Field order can be significant to AppendRecord/InsertRecord and must be governed before positional writes.

### Additional Technical Info
`FieldCount` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It counts fields, not records, field definitions or non-null values.

#### Source-backed behaviour

The compiled getter returns `FFields.Count`. Dynamic fields are normally created/opened with the dataset and can be destroyed/recreated on lifecycle/schema changes; persistent fields can have a different lifecycle. Valid [`Fields`](Fields.md) collection indexes are `0..FieldCount-1`.

Aggregate fields live in a separate collection even though `FindField` can search them, so this count is not a guarantee that every name resolvable by FindField appears here.

#### Related members

[`Fields`](Fields.md) returns the collection. [`GetFieldNames`](../Methods/GetFieldNames.md) exports names and [`RecordCount`](RecordCount.md) counts rows.

#### Official RTL references

- [Embarcadero: TDataSet.FieldCount](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.FieldCount)
- [Free Pascal: TDataSet.FieldCount](https://www.freepascal.org/docs-html/fcl/db/tdataset.fieldcount.html)

<small>Created 2026-07-15</small>
