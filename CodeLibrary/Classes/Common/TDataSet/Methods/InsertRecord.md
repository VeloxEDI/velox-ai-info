---
title: InsertRecord
description: Inserts and internally posts one record from positional values near the current dataset position.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, insertrecord, field-order, immediate-post]
---

```Delphi
procedure InsertRecord(const Values: array of const);
```

### Example

```Delphi
procedure InsertSimpleRecord(const Data: TvxClientDataSet);
begin
  Data.InsertRecord(['A100', 'Ready', 3]);
end;
```

### Usage

`InsertRecord` inserts a record from positional values near the current dataset position and posts it before returning.

- Use only with a governed, stable field order.
- Do not call Post afterward.
- Treat it as an in-memory/client-dataset record operation unless a separate persistence contract proves otherwise.

### Additional Technical Info
`InsertRecord` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It completes through descendant `InternalAddRecord`; it does not leave a pending insert for a later Post.

#### Source-backed behaviour

The shared `AddRecord(..., False)` path resolves browse/modify state and events, updates cursor position, disables controls, initializes a record, temporarily enters insert state, runs new-record/after-insert, assigns `Values[I]` to fields in current order, invokes before-post and descendant `InternalAddRecord`, returns to browse, resynchronizes and runs after-post.

Fewer values leave remaining defaults/null; excess values index beyond Fields and raise. The concrete dataset/index determines final ordering.

#### Related members

[`AppendRecord`](AppendRecord.md) requests append semantics. [`Fields`](../Properties/Fields.md) exposes the positional order.

#### Official RTL references

- [Embarcadero: TDataSet.InsertRecord](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.InsertRecord)
- [Free Pascal: TDataSet.InsertRecord](https://www.freepascal.org/docs-html/fcl/db/tdataset.insertrecord.html)

<small>Created 2026-07-15</small>
