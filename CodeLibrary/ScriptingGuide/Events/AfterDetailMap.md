---
title: AfterDetailMap
description: The record event that runs after child detail maps and before processing completes.
sidebar_position: 6
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - events
  - afterdetailmap
  - detail-maps
---

`AfterDetailMapEvent` runs after the current record's child/detail view maps have finished. Use it for record-wide finalisation that needs the parent fields and all processed child data to be available.

## Syntax

```Delphi
procedure AfterDetailMapEvent(var Value: Variant);
begin
  if Boolean(Value) then
    LogInfo('Finished the Order record and its detail maps');
end;
```

The example is source-reviewed and performs only diagnostic logging.

## How it works

After record-level AfterMap, `ProcessRecord` converts `Value` to Boolean. If true, it processes each registered detail view in order, including any requested reprocessing loops. If false, it skips the detail maps and clears the parent's reprocess flag to avoid a repeating loop with no child responsible for resetting it.

Provided the current view has not been cancelled, Velox then invokes AfterDetailMap regardless of whether children actually ran. The event is compiled lazily with Source, Dest and Global Script and is verified as one `var Variant` parameter.

When a delegate exists, Velox puts the parent destination view into edit state, calls the event, then posts if log status remains successful or cancels the edit when it does not. This means field assignments made in the event can be persisted after child processing.

## Value and side effects

`Value` is the record-control Variant carried from BeforeMap through record-level AfterMap. It tells the script whether the preceding record path remained enabled, but changing it here does not retroactively run or undo child maps. The event can edit the current parent record and can read state produced by child processing.

## Errors

Compilation failures are logged and leave the event unassigned. Runtime exceptions are caught by `ProcessRecord` and logged as an inability to process AfterDetailMap. Post failures inside the boundary are caught separately and logged as an unexpected data-view posting error.

## Edge cases and quirks

- The event runs even when `Value` is false and detail maps were skipped, as long as the view was not cancelled. Test `Value` when the distinction matters.
- `Value := True` here does not cause skipped details to run; the decision has already been made.
- Child maps can request parent reprocessing. AfterDetailMap runs after each completed parent record pass that reaches this boundary.
- The parent view is explicitly edited for the event and posted afterwards. Manual `Post`, `Cancel` or cursor movement can interfere with that enclosing edit/post contract.

## Related reference

- **AfterMap (Record)** — decides whether detail processing runs.
- **OnEndMap** — completes the entire view-map sequence after all records.
- **Map processing flow** — nested detail and reprocess loops.
