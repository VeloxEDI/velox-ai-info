---
title: Edit
description: Places the current record into edit state, or starts an insert when the active dataset is empty.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords: [velox, scripting, hidden-ancestor, tdataset, edit, insert, current-record]
---

```Delphi
procedure Edit;
```

### Example

```Delphi
function ChangeStatus(const Data: TvxClientDataSet): Boolean;
var
  EditStarted: Boolean;
begin
  Result := False;
  EditStarted := False;
  try
    Data.Edit;
    EditStarted := True;
    Data.FieldByName('Status').AsString := 'Complete';
    Data.Post;
  except
    LogError('Dataset edit failed: ' + ExceptionToString(ExceptionType, ExceptionParam));
    if EditStarted then
    begin
      try
        Data.Cancel;
      except
        LogError('Dataset cleanup failed: ' + ExceptionToString(ExceptionType, ExceptionParam));
      end;
    end;
    Exit;
  end;
  Result := True;
end;
```

This helper returns `False` after logging failure. The calling event must check the result and `Exit` before doing further work; an `Exit` inside the helper does not exit its caller. Follow [mandatory script failure handling](../../../../../instructions/scripts/failure-handling.md). Cancellation is explicit best-effort cleanup of this example's edit; it does not reverse a posted or committed external change.

### Usage

Places the current record into edit state, or starts an insert when the active dataset is empty.

- Verify Active, nonempty intent and modify permission; an empty dataset creates a new pending record.
- Pair field changes with explicit Post/Cancel exception handling.
- Edit does not lock a database row by contract and does not begin a SQL transaction.

### Additional Technical Info
`Edit` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). Writable field assignments require edit or insert state.

#### Source-backed behaviour

If already in edit/insert state, the method does nothing. If the active buffer has no records, it calls [`Insert`](Insert.md). Otherwise it checks browse mode and modify permission, runs before-edit and parent/detail coordination, invokes descendant `InternalEdit` through the edit-error retry/abort handler, calculates fields, sets state `dsEdit`, emits record-change and runs after-edit.

`CheckBrowseMode` can post a prior modified record or cancel an unmodified one before this edit begins.

#### Related members

[`Modified`](../Properties/Modified.md) reports whether the current edit buffer changed. [`Post`](Post.md) accepts and [`Cancel`](Cancel.md) abandons it.

#### Official RTL references

- [Embarcadero: TDataSet.Edit](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Edit)
- [Free Pascal: TDataSet.Edit](https://www.freepascal.org/docs-html/fcl/db/tdataset.edit.html)

<small>Created 2026-07-15</small>
