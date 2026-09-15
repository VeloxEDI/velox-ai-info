---
title: "ProcessMasterRecord"
description: "Cancels the current linked view and requests reprocessing of its immediate master record."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - program-control
  - mapping
  - master-detail
  - reprocessing
---

```Delphi
function ProcessMasterRecord: boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DATA_Self.FieldByName('NeedsMoreDetail').AsBoolean then
  begin
    ProcessMasterRecord;
    Value := False;
    Exit;
  end;
end;
```

### Usage

`ProcessMasterRecord` cancels the current linked view and requests reprocessing of its immediate master record.

**Returns**

Always returns `True`, including when the current view has no master. The result reports neither whether a master existed nor whether reprocessing later occurred. Use the function for its state changes, not as a success test.

### Additional Technical Info
`ProcessMasterRecord` stops the current view-map pass and asks its immediate master view map to be processed again. It supports master/detail mapping patterns in which a detail record discovers that its parent must be revisited before detail processing can continue.

The callable is dynamically registered only for scripts whose current `MapItem` is a `TvxViewMap`. It is visible in the generated Code Library because the generator uses a reference-discovery mode, but that does not make it available in unrelated action or field contexts. The example is fictional and source-reviewed only; its condition and `Value` meaning must be adapted to the specific view event.

**State changes**

```Delphi
Result := True;
CurrentView.Cancelled := True;
CurrentView.Reprocess := False;
if Assigned(CurrentView.MasterViewMap) then
  CurrentView.MasterViewMap.Reprocess := True;
```

Cancelling the current view prevents the normal view loop from advancing its linked data and suppresses later work guarded by `not Cancelled`. Clearing its own `Reprocess` flag prevents the cancelled detail from immediately requesting another pass. The immediate master loop subsequently observes its `Reprocess` flag and coordinates another processing pass.

**No-master behaviour**

When no `MasterViewMap` is assigned, the function still cancels the current view, clears its reprocess flag and returns `True`. There is no exception or diagnostic. This can silently skip the remainder of a top-level view if the function is called in the wrong place.

**Processing-flow implications**

The helper changes loop-control flags; it does not jump directly to a master record while the current script is running. Follow it with `Exit` when remaining script statements should not execute. The surrounding view/detail loops decide when and how the master is revisited.

The master/detail engine contains coordination for multiple child views: once a child cancels in this manner, later children are processed without prematurely resetting the master's reprocess flag. Incorrect conditions can nevertheless produce repeated passes. Ensure that reprocessing changes the data or state used by the condition so the same detail does not request the master forever.

**Side effects and errors**

- It changes in-memory view-map cancellation/reprocess flags only.
- It does not mark the action log cancelled or failed.
- It does not add a log entry, post/cancel a dataset directly or roll back prior work.
- The method itself does not raise for a missing master, but subsequent map/dataset work can fail normally.

Use [`ProcessGrandMasterRecord`](ProcessGrandMasterRecord.md) when the intended target is the root-most master in a deeper hierarchy rather than the immediate parent.

**Related entries**

- [`ProcessGrandMasterRecord`](ProcessGrandMasterRecord.md) walks the entire master chain and reprocesses its root.
- [`CancelExecution`](CancelExecution.md) cancels a view without requesting master reprocessing.

<small>Created 2026-07-15</small>
