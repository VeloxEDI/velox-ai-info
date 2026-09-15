---
title: AppendRecord
description: Appends and internally posts one record from an array of values mapped by current field order.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, appendrecord, field-order, immediate-post]
---

```Delphi
procedure AppendRecord(const Values: array of const);
```

### Example

```Delphi
procedure AddSimpleRecord(const Data: TvxClientDataSet);
begin
  Data.AppendRecord(['A100', 'Ready', 3]);
end;
```

### Usage

`AppendRecord` appends a record from an array of values mapped by current field order and posts it before returning.

- Use only when field order is stable and explicitly known; schema changes can silently remap business values.
- Do not call `Post` afterward—the record has already been posted.
- The method is not a server transaction. On `TvxClientDataSet`, it normally changes the in-memory client dataset; persistence depends on separate edit/apply workflow.

### Additional Technical Info
`AppendRecord` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). Unlike [`Append`](Append.md), it returns in browse state and does not require a later Post.

#### Source-backed behaviour

The base `AddRecord(..., True)` path performs insert checks/events, disables controls, initializes a buffer, enters temporary insert state, runs new-record and after-insert callbacks, assigns each supplied value to `Fields[I]`, calls before-post, and invokes descendant `InternalAddRecord` with append semantics. It frees field buffers, restores browse state, resynchronizes and invokes after-post before re-enabling controls.

Values are positional, not named. Fewer values leave remaining fields at defaults/null; more values than available fields raise. The operation may convert Variants through individual field types.

#### Related members

[`InsertRecord`](InsertRecord.md) uses non-append placement. [`Fields`](../Properties/Fields.md) exposes the positional order.

#### Official RTL references

- [Embarcadero: TDataSet.AppendRecord](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.AppendRecord)
- [Free Pascal: TDataSet.AppendRecord](https://www.freepascal.org/docs-html/fcl/db/tdataset.appendrecord.html)

<small>Created 2026-07-15</small>
