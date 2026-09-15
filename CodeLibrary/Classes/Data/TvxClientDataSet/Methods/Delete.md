---
title: Delete
description: Moves a relative number of records from the current cursor and deletes the reached record, ignoring an incomplete move.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, delete, moveby, cursor, destructive]
---

```Delphi
procedure Delete(aIndex: Integer)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if not (DATA1.BOF and DATA1.EOF) then
  begin
    // Zero means delete the current record.
    DATA1.Delete(0);
    Value := True;
  end
  else
    Value := False;
end;
```

### Usage

Moves a relative number of records from the current cursor and deletes the reached record, ignoring an incomplete move.

**Errors**

Inactive/empty/read-only state, posting/validation failure, navigation events, provider constraints or delete events can raise. A failed move can still have posted prior edits or changed cursor flags before a later delete failure.

**Usage notes**

Prefer locating a stable business key, verifying it, then calling `Delete(0)`. Use `DeleteRecNo` only when a transient sequence number is intentionally the contract.

### Additional Technical Info
`Delete(aIndex)` deletes a record relative to the current cursor. Despite the parameter name, `aIndex` is not an absolute list/record index.

The example safely selects the only unambiguous form: zero deletes the current record. It is source-reviewed and was not executed by the documentation workflow.

**Signature**

**Implementation**

When `aIndex <> 0`, Velox calls inherited `MoveBy(aIndex)`: positive values move forward and negative values move backward. It discards MoveBy's returned actual distance. It then calls inherited parameterless `Delete` on whatever record was reached.

If the requested distance crosses EOF/BOF, MoveBy stops at the boundary, sets the corresponding flag and returns a shorter distance. Because that result is ignored, this method proceeds to delete the boundary record rather than rejecting the out-of-range request. Do not pass an unchecked offset.

MoveBy enters browse mode and can post a pending edit before moving. It fires scroll events/notifications. Inherited Delete verifies active/nonempty/writable state, fires delete events, removes the current record, then normally selects the next record or the previous record when the deleted one was last.

**Persistence**

The method mutates the in-memory client dataset. Normal Velox non-edit activation disables `LogChanges`, so a delta for ApplyUpdates may not exist. Even when edit-mode change logging is enabled by the host, this call does not itself apply updates or commit an external transaction.

**Performance and concurrency**

Movement is proportional to the requested/reachable distance in the generic cursor path; deletion/resync cost depends on dataset size/indexes. The operation is destructive and unsynchronised.

**External references**

- [Embarcadero DocWiki: `TDataSet.MoveBy`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.MoveBy) - relative movement and short-result behavior.
- [Embarcadero DocWiki: `TDataSet.Delete`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Delete) - current-record deletion lifecycle.
- [Free Pascal: `TDataSet.Delete`](https://www.freepascal.org/docs-html/fcl/db/tdataset.delete.html) - compatible current-record delete/event context.

<small>Created 2026-07-15</small>
