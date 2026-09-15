---
title: ClearFields
description: Reinitializes every field in the current pending edit or insert record and recalculates calculated fields.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, clearfields, 'null', edit-buffer]
---

```Delphi
procedure ClearFields;
```

### Example

```Delphi
procedure ResetPendingRecord(const Data: TvxClientDataSet);
begin
  Data.ClearFields;
  Data.FieldByName('Code').AsString := 'A100';
end;
```

### Usage

`ClearFields` reinitializes every field in the current pending edit or insert record and recalculates calculated fields.

- Enter [`Edit`](Edit.md), [`Append`](Append.md) or [`Insert`](Insert.md) first.
- Reassign all business-required fields after clearing and validate before Post.
- The operation affects only the pending buffer and is not persisted until Post.

### Additional Technical Info
`ClearFields` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It clears the current record buffer, not the dataset schema or all records.

#### Source-backed behaviour

The method requires an edit-mode state; otherwise it raises `EDatabaseError` (`Dataset not in edit or insert mode`). It sends a browse-mode data event, frees field buffers, calls descendant `InternalInitRecord` on the active buffer, recalculates fields except in set-key state, and sends a record-change event.

The result can include descendant defaults/internal values rather than every field being literal `Null`. The new-record event is not rerun by this method.

#### Related members

[`Fields`](../Properties/Fields.md) exposes the reinitialized values. [`Cancel`](Cancel.md) restores/abandons the complete edit instead.

#### Official RTL references

- [Embarcadero: TDataSet.ClearFields](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.ClearFields)
- [Free Pascal: TDataSet.ClearFields](https://www.freepascal.org/docs-html/fcl/db/tdataset.clearfields.html)

<small>Created 2026-07-15</small>
