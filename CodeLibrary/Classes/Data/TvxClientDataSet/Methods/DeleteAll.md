---
title: DeleteAll
description: Destructively resets all in-memory records while controls are disabled, without performing row-by-row Delete events.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, deleteall, emptydataset, destructive, reset]
---

```Delphi
procedure DeleteAll
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if not (DATA1.BOF and DATA1.EOF) then
    DATA1.DeleteAll;
  Value := DATA1.BOF and DATA1.EOF;
end;
```

### Usage

`DeleteAll` destructively resets all in-memory records while controls are disabled, without performing row-by-row Delete events.

**Usage notes**

Use only when the entire in-memory packet is disposable. If each deletion needs business validation/audit/event handling, iterate stable keys under an explicitly designed lifecycle instead.

**Errors and side effects**

The dataset must be active and able to enter browse mode. Posting, validation, reset, resynchronisation or dataset events can raise errors. Cursor, BOF/EOF, record count, current field values, bookmarks and `RecordPosition` all change; values copied into ordinary variables remain safe, but cursor and bookmark assumptions do not.

### Additional Technical Info
`DeleteAll` removes every record from the active in-memory client dataset by wrapping `EmptyDataSet` in `DisableControls`/`EnableControls`.

The example records whether the resulting active cursor is empty. It is destructive, source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox increments the dataset's controls-disabled count, calls `EmptyDataSet`, and restores controls in a `finally` block even when reset raises. Disabling controls suppresses data-aware control updates; it is not a transaction and does not disable every dataset callback.

EmptyDataSet enters browse mode (which can post a pending edit), resets the complete client-dataset store/change state, marks data changed, sets provider EOF, resynchronises, and initialises the active record buffer. It does not call inherited Delete once per row, so do not expect per-record BeforeDelete/AfterDelete processing.

**Persistence and recoverability**

The reset discards the local rows and their pending change history. It is not an externally committed SQL delete and cannot be undone through the former client-dataset delta. Recovery requires the surrounding flow to reload/recreate the data or use its own prior snapshot.

Normal non-edit Velox datasets already have LogChanges disabled. Host edit-mode/provider/database behavior is separate; this method never calls ApplyUpdates or commits a transaction.

**Performance and concurrency**

The native reset is substantially different from an O(rows) script delete loop, though index/buffer cleanup still depends on dataset state. It is destructive and unsynchronised.

**External references**

- [Embarcadero DocWiki: `TCustomClientDataSet.EmptyDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TCustomClientDataSet.EmptyDataSet) - authoritative client-dataset reset operation.
- [Embarcadero DocWiki: `TDataSet.Delete`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Delete) - contrasts the row-level delete lifecycle not used here.

<small>Created 2026-07-15</small>
