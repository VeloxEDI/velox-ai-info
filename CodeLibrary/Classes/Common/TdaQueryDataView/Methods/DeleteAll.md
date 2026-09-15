---
title: DeleteAll
description: Empties every record from the concrete view's client dataset with controls suppressed; it does not execute SQL DELETE against a source table.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, deleteall, emptydataset]
---

```Delphi
procedure DeleteAll;
```

### Example

```Delphi
procedure ResetGeneratedRows(const View: TdaCDSQueryDataView);
begin
  View.DeleteAll;
end;
```

### Usage

`DeleteAll` empties every record from the view's client dataset with controls suppressed; it does not execute SQL DELETE against a source table.

- Use only when the owning flow intends to rebuild the entire in-memory view.
- Never present it as a database purge or rely on it for source-system deletion.
- Re-establish cursor assumptions and dependent detail data after the call.

### Additional Technical Info
`DeleteAll` destructively clears the current in-memory record set of a query/file DataView.

#### Source-backed behaviour

The base implementation is a no-op stub. Both shipped descendants call `FQuery.DeleteAll`; `TvxClientDataSet.DeleteAll` disables controls, calls `EmptyDataSet`, then re-enables controls in `finally`. `EmptyDataSet` clears the client dataset efficiently rather than iterating the public `Delete` method.

This operation is not a SQL command and does not delete rows from the database source. It can remove every staged/generated output record and invalidate current record/field references and master-detail views. Dataset/provider errors propagate, while control notifications are restored even on failure. It is far more destructive than [`CancelPost`](CancelPost.md), which only abandons one pending buffer.

#### Official terminal references

- [Embarcadero: TCustomClientDataSet.EmptyDataSet](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TCustomClientDataSet.EmptyDataSet)
- [Free Pascal: TCustomBufDataset.Clear](https://www.freepascal.org/docs-html/current/fcl/db/tcustombufdataset.clear.html) (analogous buffered-dataset operation; not proof of Velox behaviour)

<small>Created 2026-07-15</small>
