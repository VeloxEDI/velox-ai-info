---
title: TdaSQLQueryDataView
description: Represents a host-managed database query view with a live client dataset, link metadata and end-of-flow record-flagging controls.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, data, database, sql, data-view]
---

```Delphi
TdaSQLQueryDataView = class(TdaQueryDataView)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Rows: TvxClientDataSet;
begin
  // Dataview must be a database-backed SQL view in this event.
  Rows := Dataview.Query;
  if Rows.Active then
    Value := Dataview.TableName + ': ' + IntToStr(Rows.RecordCount)
  else
    Value := Dataview.TableName + ': inactive';
end;
```

### Usage

`TdaSQLQueryDataView` represents a Velox-provided database query view with a live client dataset, link metadata and end-of-flow record-flagging controls.

**Lifecycle**

Activation applies the selected database connection's SQL dialect/collation settings, opens the view and builds references for configured primary, primary/foreign and foreign-key fields. Deactivation deletes those references and closes Query. Reset closes Query plus the find/update queries and marks the view inactive while retaining their SQL connection objects for central connection cleanup.

View methods, Query, DataSource and the report pipeline share one mutable record set and cursor. Moving through the view or Query changes the current row seen by field references and the pipeline. Opening errors can replace the normal child dataset and DataSource when the Query has not been externally assigned.

**Usage notes**

Configure SQL, links and processed-flag options in the Velox application wherever possible. Scripts may inspect these properties, control the one-shot capture latch for a row and work through Query, but must not free host objects. Use the public `LinkDataView` helper instead of assigning Query directly.

### Additional Technical Info
`TdaSQLQueryDataView` is Velox's database-backed ReportBuilder data view. It combines a configured SQL definition, a live client dataset and report pipeline with metadata used to save mapped records and optionally flag successfully processed source records.

The example observes the current SQL view without taking ownership or navigating its cursor. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox registers this class below the hidden `TdaQueryDataView`. Its constructor creates an owned `TdaChildSQLClientDataSet`, connects an owned DataSource and pipeline, creates separate find/update query objects and initialises the primary-key capture list and SQL command buffers. No constructor or own method is exposed to scripts; the public surface consists of the nine properties documented below.

Scripts normally receive host instances. Source views use their uppercased configured Description, destination views use `D_` plus that name, and the current mapped view can be available as `Dataview`. Velox also exposes known views such as `DEvent` and `DIssue`. A Description must become a valid, non-colliding script identifier because this registration path does not sanitise it.

**Saving and processed-record flagging**

Primary-key descriptors support generated SQL for destination inserts/updates and track source rows for later processed-flag updates. `FlagIdFields` enables the per-view part of that later update; database-definition options, successful flow status and captured key values must also allow it. `FlagTableName` optionally changes the UPDATE target.

`FlagAsProcessed` and `RecordPKValue` do not execute an update. They are aliases for a one-shot capture latch checked immediately before cursor movement: False skips one capture and is reset to True.

**Edge cases and quirks**

- Table/link-name getters lazily cache only non-empty results and never invalidate them. Calling them before activation can return empty; changing SQL or links after a non-empty read can leave stale values.
- `TableName` means the first selected table, not the complete query. `MasterTableName` is raw/unencoded and assumes the master is another SQL view even though runtime linking can use a client-dataset view.
- `FKFieldName` and `MasterFieldName` select the first configured foreign-key descriptor, not every link. `MasterFieldName` can attempt link resolution and log a flow error while being read.
- `FlagTableName` is inserted verbatim into generated SQL. Never set it from a file, message, API request or other untrusted input.
- Query's setter is used internally by `LinkDataView`, but a direct first replacement permanently frees the view's normal owned dataset. Nil, wrong-specialisation and dangling references are not guarded.

**Performance and concurrency**

The selected rows are represented by a client dataset; record count, field width, indexes and BLOBs affect memory and opening cost. Saving builds SQL and can issue per-record or batched database operations. The view, queries, key list and pipeline have no object-level synchronisation and must remain within their owning flow/thread.

**External references**

- [Embarcadero DocWiki: `Datasnap.DBClient.TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TClientDataSet) - inherited client-dataset context; Velox adds SQL-view ownership, saving, link and flagging behaviour.

<small>Created 2026-07-15</small>
