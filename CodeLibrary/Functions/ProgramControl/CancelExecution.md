---
title: "CancelExecution"
description: "Cancels every view and field in the current map without marking the enclosing flow log cancelled."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - program-control
  - cancellation
  - mapping
---

```Delphi
procedure CancelExecution;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Value = '' then
  begin
    CancelExecution;
    Exit; // CancelExecution does not return from this script
  end;

  Value := UpperCase(Value);
end;
```

### Usage

`CancelExecution` cancels every view and field in the current map without marking the enclosing flow log cancelled.

**Side effects and transaction boundary**

- It changes cancellation/reprocessing flags throughout the current map.
- It does not change the log's Boolean success status.
- It does not undo field values, database writes, files, messages or other side effects already produced.
- It is not a transaction rollback instruction. Finalisation can still commit successful work or move files according to the surrounding action's normal rules.

Because the procedure has no return value, a caller cannot distinguish a successful flag change from a call made outside a supported map context.

### Additional Technical Info
`CancelExecution` asks the complete map containing the current field or view to stop its remaining processing. Despite being called through one `MapItem`, it cancels every view in that map and every field in those views. It does not mark the enclosing flow log as cancelled, abort the current script, raise an exception or roll back work already completed.

The exact scope depends on the object represented by the current `MapItem`. The example explicitly uses `Exit` because statements following `CancelExecution` would otherwise still execute. It is fictional and source-reviewed only.

**Context-dependent behaviour**

| Current map context | Effect |
|---|---|
| Field map (`TvxFieldMap`) | Resolves `FieldMap.ViewMap.Map` and cancels every view and field in that complete map. |
| View map (`TvxViewMap`) | Resolves `ViewMap.Map` and cancels every view and field in that complete map. |
| Any other context, including no map item | Does nothing. No error or result indicates the no-op. |

`TvxMap.CancelExecution` loops through all of the map's views. Each view sets `Cancelled=True`, clears `Reprocess` and calls `CancelExecution` on every field. Map processing loops observe those flags after control returns from the script. The broad map-wide scope is an important implementation quirk: a call from one field is not field-local.

**Control flow**

Calling this procedure does not transfer control. In particular, it does not behave like Delphi's `Exit`, `Break` or an exception. If the remainder of the current script must not run, follow it with `Exit` or structure the subsequent statements behind an `else` branch.

The procedure also does not set `Log.IsCancelled`. Use [`StopExecution`](StopExecution.md) when the enclosing action flow must receive the cancellation signal as well as the map context.

**Implementation notes**

The script method inspects the current `MapItem` at runtime, obtains its containing `TvxMap` and calls that map's cancellation method. It handles a field map first, then a view map, with no fallback action. The apparently similar [`StopStep`](StopStep.md) is only a wrapper around this exact method and therefore has the same map-wide scope.

**Related entries**

- [`StopStep`](StopStep.md) exposes the same behaviour under a different name.
- [`StopExecution`](StopExecution.md) also marks the enclosing log cancelled.
- [`StopAction`](StopAction.md) and [`StopFlow`](StopFlow.md) are aliases for the flow-cancelling behaviour.

<small>Created 2026-07-15</small>
