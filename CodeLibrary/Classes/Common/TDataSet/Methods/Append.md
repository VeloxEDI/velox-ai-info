---
title: Append
description: Starts a new pending record at the logical end of a modifiable dataset and leaves it in insert state.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, append, insert, edit-state]
---

```Delphi
procedure Append;
```

### Example

```Delphi
procedure AddRecord(const Data: TvxClientDataSet);
begin
  Data.Append;
  try
    Data.FieldByName('Code').AsString := 'A100';
    Data.Post;
  except
    Data.Cancel;
    raise;
  end;
end;
```

### Usage

Call `Append` on an active, editable dataset when you want to add a new record at the logical end of its current records. Unlike [`Insert`](Insert.md), it does not start the new record at the current cursor position.

`Append` only opens a pending record for editing. Assign the required field values, then call [`Post`](Post.md) to accept the record or [`Cancel`](Cancel.md) to abandon it. Wrap assignments in exception handling so a failed assignment cancels the pending record. Posting changes the dataset; it does not by itself save the record to an external database.

### Additional Technical Info

`Append` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It creates an editable record buffer; it does not save that record by itself.

#### Source-backed behaviour

The compiled modified `Data.DB` path first runs the common insert checks: any current edit is resolved through browse mode, modify permission and parent/detail state are checked, and before-insert/before-scroll events run. It then clears cursor buffers, initializes a record flagged at EOF, obtains preceding records, invokes descendant `InternalInsert`, enters `dsInsert`, invokes the new-record callback and emits insert/scroll notifications.

Defaults and calculated-field callbacks can run before script assignments. The pending row becomes part of the concrete dataset only after [`Post`](Post.md); [`Cancel`](Cancel.md) abandons it.

#### Operational guidance

- Require [`Active`](../Properties/Active.md) and a modifiable descendant.
- Wrap field assignment and Post so an exception explicitly cancels the pending insert.
- Append is not a database transaction and does not prove any server write.
- Event, provider, default/calculated-field and allocation errors propagate; cursor state may already have changed.

#### Related members

[`Insert`](Insert.md) starts a row near the current position. [`AppendRecord`](AppendRecord.md) supplies values and completes the add in one call.

#### Official RTL references

- [Embarcadero: TDataSet.Append](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Append)
- [Free Pascal: TDataSet.Append](https://www.freepascal.org/docs-html/fcl/db/tdataset.append.html)

<small>Created 2026-07-15</small>
