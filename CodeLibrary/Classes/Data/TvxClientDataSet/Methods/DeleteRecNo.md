---
title: DeleteRecNo
description: Moves to an absolute client-dataset sequence number and deletes that record, making sort/filter position part of the operation.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, deleterecno, recno, cursor, destructive]
---

```Delphi
procedure DeleteRecNo(aRecNo: Integer)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  PositionToDelete: Integer;
begin
  PositionToDelete := DATA1.RecordPosition;
  DATA1.DeleteRecNo(PositionToDelete);
  Value := True;
end;
```

### Usage

`DeleteRecNo` moves to an absolute client-dataset sequence number and deletes that record, making sort/filter position part of the operation.

**Usage notes**

Prefer a stable business-key Find plus verification and `Delete(0)`. Use this method only when the sequence position was captured and consumed immediately under unchanged index/filter/data state.

**Persistence**

The deletion is in-memory. Normal Velox non-edit activation disables change logging; other host modes may record a delta, but this method does not apply/commit externally.

### Additional Technical Info
`DeleteRecNo` assigns the requested integer to inherited `RecNo`, then deletes the resulting current record. It uses an absolute client-dataset sequence position, not a business key or zero-based field/list index.

The example deletes the currently reported position; it is illustrative, destructive, source-reviewed and was not executed by the documentation workflow.

**Signature**

Client-dataset RecNo is normally 1-based in browse state. Setting it enters browse mode, can post a pending edit, fires BeforeScroll, calls the internal cursor's `MoveToSeqNo`, recentres/resynchronises buffers, and fires AfterScroll. Velox then calls inherited current-record Delete with its normal delete/resync events.

Sequence numbers are transient. Sorting through IndexFieldNames, filters/ranges, inserts/deletes, reloads and other cursor changes can change which business record occupies a number. Never retain a RecNo as a durable identifier.

**Boundary and error behavior**

An inactive dataset, invalid/out-of-range sequence number, browse/post/validation failure, read-only/empty state or event/provider error raises. Movement happens before deletion, so a failure after successful movement can leave a different current record without deleting it.

**Performance and concurrency**

MoveToSeqNo and delete/resync cost depend on client-dataset indexes and buffers. Cursor mutation is unsynchronised.

**External references**

- [Embarcadero DocWiki: `TDataSet.RecNo`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.RecNo) - generic active-record-number contract and descendant implementation context.
- [Free Pascal: `TDataSet.RecNo`](https://www.freepascal.org/docs-html/fcl/db/tdataset.recno.html) - compatible warning that RecNo is not reliable exact positioning.
- [Embarcadero DocWiki: `TDataSet.Delete`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Delete) - deletion after the move.

<small>Created 2026-07-15</small>
