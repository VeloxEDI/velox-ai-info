---
title: Insert
description: Starts a new pending record near the current cursor and leaves the dataset in insert state.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords: [velox, scripting, hidden-ancestor, tdataset, insert, edit-state, cursor]
---

```Delphi
procedure Insert;
```

### Example

```Delphi
function InsertRecord(const Data: TvxClientDataSet): Boolean;
var
  EditStarted: Boolean;
begin
  Result := False;
  EditStarted := False;
  try
    Data.Insert;
    EditStarted := True;
    Data.FieldByName('Code').AsString := 'A100';
    Data.Post;
  except
    LogError('Dataset insert failed: ' + ExceptionToString(ExceptionType, ExceptionParam));
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

Call `Insert` on an active, editable dataset when you want to start a new record at or near the current cursor position. Use [`Append`](Append.md) instead when the new record should be added at the logical end. If the dataset is sorted or indexed, that ordering can reposition the record, so do not use insertion position as a business sequence number.

After `Insert`, assign the field values and call [`Post`](Post.md) to accept the pending record or [`Cancel`](Cancel.md) to abandon it. The operation changes the dataset buffer and does not by itself save anything to an external database.

### Additional Technical Info

`Insert` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). Concrete datasets decide the final physical/order placement.

#### Source-backed behaviour

After common browse/modify/events checks, the base saves the current bookmark, shifts its record buffer, initializes a new record, marks it at BOF when appropriate or copies the prior bookmark, invokes descendant `InternalInsert`, then enters `dsInsert`, runs new-record and insert/scroll notifications.

The row remains pending until [`Post`](Post.md). For a sorted/indexed client dataset, logical order is index-driven; the requested insertion location is not a durable row order contract.

#### Operational guidance

- Do not use insert position as a business sequence key.
- Assign required fields and Post, or Cancel on failure.
- The operation can auto-resolve a previous edit through browse mode.
- It does not begin a server transaction.

#### Related members

[`Append`](Append.md) starts at the logical end. [`InsertRecord`](InsertRecord.md) supplies positional values and completes immediately.

#### Official RTL references

- [Embarcadero: TDataSet.Insert](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Insert)
- [Free Pascal: TDataSet.Insert](https://www.freepascal.org/docs-html/fcl/db/tdataset.insert.html)

<small>Created 2026-07-15</small>
