---
title: Query
description: Returns the view's borrowed live child dataset; the exposed setter is unsafe and must not be used.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, data-view, client-dataset, ownership, unsafe]
---

```Delphi
property Query: TvxClientDataSet read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Rows: TvxClientDataSet;
begin
  Rows := Dataview.Query;
  if Rows.Active then
    Value := Rows.RecordCount
  else
    Value := 0;

  // Never assign Dataview.Query or free Rows.
end;
```

### Usage

`Query` returns the view's borrowed live child dataset; the exposed setter is unsafe and must not be used.

**Behaviour**

- The returned dataset and the view share Active state, schema, records, indexes and cursor. Navigating either reference moves both.
- View activation, SQL/field changes and Reset can close/recreate dataset storage and invalidate fields/bookmarks while the object reference remains live.
- Record edits through Query affect the view's current in-memory record. Posting to the client dataset is not the same as saving a destination file or committing external data.

**Errors**

Normal dataset operations can raise for inactive state, invalid records/fields, wrong edit state, indexes, constraints and allocation. Unsafe assignment can cause nil dereferences, invalid casts, use-after-free and processing against a different dataset than the pipeline, often later rather than at the assignment statement.

**Usage notes**

Treat the effective contract as read-only despite the generated setter. Obtain Query when needed, use it within the current view lifecycle and never store it across view reset/destruction. The writable configuration is future product work to remove or guard.

### Additional Technical Info
`Query` returns the live in-memory dataset owned by this data view. Use it as a borrowed reference to inspect or operate on the view's records. **Do not assign this property and do not free the returned dataset.**

The example performs a read-only observation and retains no reference beyond the event. It is source-reviewed and was not executed by the documentation workflow.

The compiler-visible type is `TvxClientDataSet`. The native property and runtime helpers actually use its more specialised descendant `TdaChildClientDataSet`.

**Implementation**

The view constructor creates `TdaChildClientDataSet(Self)`, optionally copies the file definition's string-trimming setting, and assigns that original object to an owned DataSource. Report pipelines are connected to the DataSource. View navigation, field access, linking, record counts and reset operations delegate directly to the FQuery pointer.

The normal getter simply returns that pointer. Dataset/schema refresh closes or recreates the data *inside* the same object; it does not normally replace the pointer. The view destructor frees its DataSource, explicitly frees the current FQuery pointer and then destroys remaining owned components.

The setter is a raw pointer assignment. It does not close/free the old Query, change component ownership, reconnect the DataSource or pipeline, validate the specialised runtime class, relink master/detail state or transfer settings.

**Edge cases and quirks**

- Although the declaration is read/write, assignment is an implementation hazard. Assigning nil makes view methods dereference nil while the DataSource/pipeline still points to the original dataset.
- Assigning another `TvxClientDataSet` creates a compiler/native type mismatch: the view expects child-only parent/file-field behaviour but the script declaration accepts the base Velox type.
- After any replacement, the DataSource/pipeline remains connected to the original view-owned dataset while view methods use the replacement, so two different cursors can silently drive processing and reporting.
- On view destruction, the replacement currently in FQuery is freed even if it belongs to another owner. The original dataset remains owned by the view and is freed separately during inherited component cleanup. Every retained external reference can become dangling.
- Assigning the existing Query back to itself is unnecessary but does not split the pointers.

**Side effects**

Reading has no direct side effect, although subsequent dataset calls can navigate/edit shared state. Assignment changes the view's internal pointer immediately without repairing any dependent object graph.

**Performance and concurrency**

The getter is constant-time. Operations on the returned in-memory dataset scale with records, fields, indexes and BLOBs. There is no synchronisation across the view, Query and pipeline cursor; do not share them between concurrent script executions.

**External references**

- [Embarcadero DocWiki: `Datasnap.DBClient.TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TClientDataSet) - base in-memory dataset behaviour; the writable-pointer defect and ownership graph are specific to Velox.

<small>Created 2026-07-15</small>
