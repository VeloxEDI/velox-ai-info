---
title: "StopAction"
description: "Cancels every view in the current map and marks the enclosing flow log cancelled after the script returns."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - program-control
  - cancellation
  - action
---

```Delphi
procedure StopAction;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if not IsValid(Value) then
  begin
    Log.Add('Action cancelled because the value is invalid');
    StopAction;
    Exit;
  end;
end;
```

### Usage

`StopAction` cancels every view in the current map and marks the enclosing flow log cancelled after the script returns.

### Additional Technical Info
`StopAction` is an alternative public name for [`StopExecution`](StopExecution.md). The method simply calls `StopExecution`, which cancels every view and field in the current map when applicable and sets `Log.IsCancelled` to `True`.

The call does not terminate the current PascalScript routine. The example uses `Exit` deliberately and is fictional and source-reviewed only.

**Implementation**

```Delphi
procedure TvxScripter.StopAction;
begin
  StopExecution;
end;
```

Consequently, its exact scope is inherited:

- in either a field or view map, the containing map cancels every view and field and clears each view's `Reprocess` flag;
- outside those contexts, no map flag changes; and
- in every context, the enclosing log is marked cancelled.

**Operational behaviour**

The flow executor notices the log cancellation cooperatively after the current action item. The map loops notice their map-wide cancellation flags at their own checkpoints. A later action configured to ignore cancellation can clear the log flag and continue the action list.

`StopAction` does not set failure status, write a reason to the log, unwind the script, roll back a transaction or reverse external side effects. Successful work can still follow the normal commit and file-finalisation path. Log a useful reason before calling it and use `Exit` when later statements in the same script must be skipped.

**Name compatibility**

The name suggests action scope but does not introduce any additional action-level mechanism beyond `StopExecution`. [`StopFlow`](StopFlow.md) is registered directly to this method pointer and is another exact alias at runtime.

**Related entries**

- [`StopExecution`](StopExecution.md) is the direct implementation.
- [`StopFlow`](StopFlow.md) is registered to the same native method.
- [`CancelExecution`](CancelExecution.md) changes map state without cancelling the enclosing log.

<small>Created 2026-07-15</small>
