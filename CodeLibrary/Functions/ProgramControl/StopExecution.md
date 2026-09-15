---
title: "StopExecution"
description: "Signals flow cancellation by cancelling every view in the current map and setting the enclosing action log to flsCancelled."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - program-control
  - cancellation
  - flow
---

```Delphi
procedure StopExecution;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Value = 'CANCEL' then
  begin
    Log.Add('Cancellation requested by input value');
    StopExecution;
    Exit; // the procedure does not unwind the script
  end;
end;
```

### Usage

`StopExecution` signals flow cancellation by cancelling every view in the current map and setting the enclosing action log to flsCancelled.

### Additional Technical Info
`StopExecution` performs two operations: it calls [`CancelExecution`](CancelExecution.md) for the current map context, then sets `Log.IsCancelled` to `True`. This gives the enclosing action executor a flow-level cancellation signal while also cancelling every view and field in the containing map when the call occurs in a supported mapping context.

It is cooperative cancellation, not an immediate abort. The current script continues until it returns or explicitly transfers control, and inner mapping loops can continue work until they next inspect the relevant flags. The example is fictional and source-reviewed only.

**Processing sequence**

1. `CancelExecution` examines the current `MapItem`.
2. A field or view context resolves its containing map; the map cancels all views, clears their reprocess flags and cancels every field. Other contexts receive no map change.
3. `Log.IsCancelled := True` changes the enclosing action log state to cancelled (`flsCancelled`).
4. Execution returns to the next statement in the script.
5. The surrounding map and action loops observe cancellation at their own checkpoints.

The log cancellation is applied even when `CancelExecution` had no supported map context.

**Cancellation is not failure or rollback**

Cancellation is distinct from the log's Boolean success status. This procedure does not itself set `Log.Status` to `False`, add an explanatory message or raise an exception. In non-test execution, successful database work can still be committed and source files can still pass through normal audit or transport finalisation. Treat the operation as a request to stop subsequent processing, never as compensation for work already performed.

Add a log message before the call when operators need to know why the flow was cancelled.

**Timing and scope quirks**

- The currently executing script continues unless it calls `Exit` or uses equivalent branching.
- The map-wide flags stop loops as they reach their next cancellation checks. Code already executing in the active script still runs unless it explicitly exits.
- The outer action loop checks cancellation after the current action item returns.
- A configured action with `IgnoreCancel=True` can clear the cancellation state and allow later action items to continue.
- Repeated calls are effectively idempotent with respect to the flags, but any intervening application logic can alter them.

**Aliases**

[`StopAction`](StopAction.md) calls this method directly. The Code Library declaration named [`StopFlow`](StopFlow.md) is registered to the `StopAction` method pointer. All three therefore share the same native behaviour.

**Related entries**

- [`CancelExecution`](CancelExecution.md) performs only the map-context part.
- [`StopStep`](StopStep.md) is an alias for `CancelExecution`, not for this procedure.
- [`StopAction`](StopAction.md) and [`StopFlow`](StopFlow.md) expose this behaviour under alternative names.

<small>Created 2026-07-15</small>
