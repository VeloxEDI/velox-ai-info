---
title: "StopStep"
description: "Aliases CancelExecution, cancelling every view and field in the current map without cancelling the enclosing flow."
sidebar_position: 13
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
procedure StopStep;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Value = 'SKIP' then
  begin
    StopStep;
    Exit; // StopStep itself does not leave this script
  end;

  Value := Trim(Value);
end;
```

### Usage

`StopStep` aliases CancelExecution, cancelling every view and field in the current map without cancelling the enclosing flow.

**Exact behaviour**

| Current map context | Effect |
|---|---|
| Field map | Cancels every view and every field in the field's containing map. |
| View map | Cancels every view and every field in the view's containing map. |
| Other or absent | No operation and no diagnostic. |

The active mapping loop observes the changed flags after the script returns. The call does not immediately leave the current script, so use `Exit` when subsequent statements must not run.

### Additional Technical Info
`StopStep` is a compatibility name for [`CancelExecution`](CancelExecution.md). Its implementation consists solely of calling `CancelExecution`; it has no separate concept of an action step and does not set the enclosing flow log's cancellation flag.

The name is misleading in both directions: the operation does not identify one configured action step, but it does cancel more than the current field or view. From either supported context it obtains the containing `TvxMap` and cancels every view and field in that map. Outside those contexts it silently does nothing. The example is fictional and source-reviewed only.

**Important limitations**

- It does not identify one configured action step; it applies map-wide cancellation flags.
- It does not set `Log.IsCancelled` and therefore does not request that later action items stop.
- It does not set failure status, add a log message or raise an exception.
- It does not undo database, file, transport or other side effects.
- It has no result with which to detect an unsupported context.

For a flow-level cancellation signal, use [`StopExecution`](StopExecution.md), [`StopAction`](StopAction.md) or [`StopFlow`](StopFlow.md). Even those procedures do not unwind the script, so explicit script control flow remains necessary.

**Implementation**

```Delphi
procedure TvxScripter.StopStep;
begin
  CancelExecution;
end;
```

This direct wrapper is why all behavioural changes and quirks of `CancelExecution` also apply to `StopStep`.

**Related entries**

- [`CancelExecution`](CancelExecution.md) is the underlying implementation.
- [`StopExecution`](StopExecution.md) combines context cancellation with a flow-log cancellation signal.

<small>Created 2026-07-15</small>
