---
title: LinkedData
description: The event that selects the source data view used to drive destination record creation.
sidebar_position: 4
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - events
  - linkeddata
  - datasets
---

`LinkedDataEvent` assigns the `TdaQueryDataView` whose records drive a destination view map. When it returns a view, Velox processes one destination record for each available linked record. When it leaves the reference `nil`, Velox processes the destination view once without a linked-record loop.

## Syntax

```Delphi
procedure LinkedDataEvent(var LinkedData: TdaQueryDataView);
begin
  LinkedData := GetLinkedData(DATA_Order);
end;
```

The example is source-reviewed and assumes `DATA_Order` is a configured dataset variable in the current map. `GetLinkedData` obtains the data-view wrapper used by the map engine.

## How it works

The view map's `LinkedView` getter calls the event with its current `FLinkedView` reference. On first use after a formula change, a dedicated scripter compiles the event in linked-data mode, registers Source, Dest and Global Script, verifies one `var` class parameter and retrieves `LINKEDDATAEVENT`.

After OnStartMap, `ProcessDataView` tests the returned view. For a non-nil view it positions at the first record when required, then processes records until the query reports end-of-file, logging fails or the map is cancelled. The loop advances the linked view after each record. With no linked view, the map calls its record processor once.

## Value, lifetime and ownership

`LinkedData` is a reference passed by `var`; assigning it changes which view the map stores and uses. The event does not transfer ownership. A view supplied by Velox or returned by `GetLinkedData` remains managed by the current scripter/data context. Do not free it.

The selected view's current record becomes the source context for mappings. Its cursor is advanced by Velox, so other code sharing the same view observes cursor movement.

## Errors

A wrong signature fails event verification. Compilation errors are logged and leave no delegate. The getter itself does not wrap the event call in a local exception handler, but `ProcessDataView` evaluates it within the map's processing call chain; an exception is logged at the surrounding record/action boundary and can stop processing through log status.

## Performance and concurrency

The event can run more often than once per sequence. The loop deliberately calls the `LinkedView` property in its condition so user code can re-evaluate the reference for each iteration. Expensive database or allocation work inside LinkedData therefore multiplies across records. The selected view and its cursor are not an independent snapshot and should not be shared concurrently without explicit owning-code support.

## Edge cases and quirks

- LinkedData is evaluated after OnStartMap and before the first BeforeMap.
- The loop condition can invoke LinkedData repeatedly. Returning different views between calls changes loop state and can produce skipped, repeated or non-terminating processing.
- An empty linked view produces zero destination records. A `nil` linked view produces one unlinked destination record.
- If reprocess remains true at linked-view EOF, Velox clears it to avoid a stuck reprocess condition.
- The scripter omits its normal `LinkedData()` helper function in this event because the parameter has the same name; use the parameter or `GetLinkedData` instead.

## Related reference

- **OnStartMap** — executes immediately before initial linked-data resolution.
- **BeforeMap** — first record-control event for each selected record.
- **Datasets** — view cursors, fields and ownership.
