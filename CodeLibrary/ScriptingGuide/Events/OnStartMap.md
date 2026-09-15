---
title: OnStartMap
description: The no-parameter event that runs before a view map starts its current record sequence.
sidebar_position: 2
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - events
  - onstartmap
  - maps
---

`OnStartMapEvent` runs before a view map begins the current sequence of linked records. It is intended for sequence-level initialisation, not for changing a destination record.

## Syntax

```Delphi
procedure OnStartMapEvent;
begin
  { Initialise state for this view-map sequence. }
end;
```

## How it works

`TvxViewMap.ProcessDataView` clears the view's cancellation flag and, when the view is not in reprocess mode, calls the OnStartMap boundary. On first use after a formula change, Velox compiles the event with the map's Source, Dest and Global Script context and retrieves the no-parameter `ONSTARTMAPEVENT` delegate.

Before calling the delegate, Velox resets the view map's `LineNo` counter to zero. It then resolves LinkedData and starts the record loop. A top-level view normally receives one OnStartMap call for its processing sequence. A child view receives one for each sequence started for a master record, unless that child is being reprocessed.

## Example

```Delphi
procedure OnStartMapEvent;
begin
  LogInfo('Starting the Order view-map sequence');
end;
```

The example is source-reviewed and only writes a diagnostic log entry.

## State and side effects

There is no `Value` parameter. Use registered Globals, Locals or other explicit context if state must be shared with later events. At this point the view map has not inserted the next destination record; the implementation specifically avoids putting the destination view into edit mode before this event.

Changing datasets, counters or shared variables here affects the complete sequence and can affect every subsequent record. I/O calls execute synchronously in the action thread.

## Errors

Compilation errors are logged against the OnStartMap script and prevent a delegate being installed. Runtime exceptions are caught by `ProcessDataView` and logged as an inability to process OnStartMap for the view description. The map then continues according to the current log status; do not rely on an exception as ordinary flow control.

## Edge cases and quirks

- The event is skipped when `Reprocess` is already true. Code that must run for every repeated pass belongs at a more appropriate record boundary.
- `LineNo` is reset even when no OnStartMap procedure is installed, because the reset belongs to the boundary method.
- OnStartMap occurs before the first LinkedData evaluation. It is not once per whole action when the map has nested child views.
- No destination record has yet been inserted for the sequence's next row, so record-field edits are premature.

## Related reference

- **LinkedData** — selects the records processed after this event.
- **OnEndMap** — matching sequence-completion boundary.
- **Map processing flow** — complete nested sequence.
