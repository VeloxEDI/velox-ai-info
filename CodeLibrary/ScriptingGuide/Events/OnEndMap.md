---
title: OnEndMap
description: The no-parameter event that runs when a view map finishes its current record sequence.
sidebar_position: 7
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - events
  - onendmap
  - maps
---

`OnEndMapEvent` is the sequence-completion event for one view map. It runs after the linked-record loop (or the single unlinked record) has finished, including each record's detail maps and AfterDetailMap event.

## Syntax

```Delphi
procedure OnEndMapEvent;
begin
  LogInfo('Finished the Order view-map sequence');
end;
```

The example is source-reviewed and writes a diagnostic log entry.

## How it works

At the end of `ProcessDataView`, Velox calls OnEndMap only when the view is neither cancelled nor marked for reprocessing. The first use compiles a no-parameter delegate with Source, Dest and Global Script context.

When a delegate exists, Velox places the current destination view in edit state, invokes the event, then posts the current record when log status remains successful. If log status is not successful it cancels the edit. A post failure is caught and logged separately.

For a top-level view this normally occurs once after its complete linked sequence. For a child view it occurs at the end of each sequence processed for a master record.

## State and side effects

There is no `Value` parameter. Use explicit registered state to accumulate results across records. The event can read sequence counters and can edit the current destination record, which is normally the last record processed for this view. It is not a transaction commit boundary and does not by itself close datasets or release map resources.

## Errors

Compilation and no-parameter signature errors are logged against OnEndMap. Runtime exceptions are caught by `ProcessDataView` and logged with the view description. A failure does not make the event run a second time; log state controls later action processing.

## Edge cases and quirks

- The event is skipped when the view is cancelled or remains in reprocess state.
- With an empty non-nil LinkedData view, no records are created but Velox still reaches the OnEndMap boundary. If a delegate exists, `View.Edit` occurs before the user procedure: it may edit an existing current record, or fail and log before the procedure runs when no editable record exists. Do not assume a newly mapped record is current.
- Velox calls `View.Edit` only when an event delegate exists. Editing the current record is therefore part of the event boundary, not of an empty OnEndMap slot.
- Child-view OnEndMap is once per master-driven sequence, not once per overall action.

## Related reference

- **OnStartMap** — matching sequence-start boundary.
- **AfterDetailMap** — last per-record event before sequence completion.
- **Map processing flow** — conditions that suppress or repeat the boundary.
