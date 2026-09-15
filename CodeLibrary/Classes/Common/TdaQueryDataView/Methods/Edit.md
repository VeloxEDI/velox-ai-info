---
title: Edit
description: Places the concrete view's current client record into edit state, or follows Delphi dataset rules for empty/read-only/inactive data.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, edit, dataset-state]
---

```Delphi
procedure Edit;
```

### Example

```Delphi
procedure ChangeStatus(const View: TdaSQLQueryDataView);
begin
  View.Edit;
  View['Status'].AsString := 'Ready';
  View.Post;
end;
```

### Usage

Call `Edit` when the current record in a query DataView needs to be changed. Assign the required fields, then complete the operation with `Post` or abandon it with `CancelPost` in the owning exception path.

- Check [`Empty`](../Properties/Empty.md) carefully; it reports EOF and is not a safe existence test at every cursor position.
- Do not assume the edit acquires a database lock or begins a transaction.

### Additional Technical Info
`Edit` begins modification of the current record in the client dataset owned by a concrete DataView.

#### Source-backed behaviour

The hidden base is a no-op stub. Both shipped descendants call `FQuery.Edit`. The terminal `TDataSet.Edit` checks browse state, datasource editing permission and modifiability; an empty modifiable dataset can enter insert state instead. Existing edit/insert state is retained. Failures for inactive, read-only or unsupported editing propagate.

No field changes occur until assignments are made. Assignments can invoke field validation/provider checks. [`Post`](Post.md) only calls the client post when `FQuery.Modified` is true, and client posting is still not the same as the SQL DataView save/apply operation.

#### Official terminal references

- [Embarcadero: TDataSet.Edit](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Edit)
- [Free Pascal: TDataSet.Edit](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.edit.html)

<small>Created 2026-07-15</small>
