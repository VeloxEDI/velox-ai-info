---
title: "StopFlow"
description: "Aliases StopAction, cancelling all views in the current map and marking the enclosing flow log cancelled."
sidebar_position: 12
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
procedure StopFlow;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Value = 'STOP' then
  begin
    Log.Add('Flow cancellation requested');
    StopFlow;
    Exit;
  end;
end;
```

### Usage

`StopFlow` aliases StopAction, cancelling all views in the current map and marking the enclosing flow log cancelled.

### Additional Technical Info
`StopFlow` is a scripting declaration registered directly to the native [`StopAction`](StopAction.md) method pointer. There is no separate `TvxScripter.StopFlow` implementation. At runtime it therefore has exactly the same behaviour as `StopAction` and [`StopExecution`](StopExecution.md).

It cancels every view and field in the current map when a field or view context is active and sets `Log.IsCancelled` to `True`. The procedure then returns to the next script statement. The example is fictional and source-reviewed only.

**Registration detail**

The declaration name and native method name intentionally differ:

```Delphi
RegisterDelphiMethod(@TvxScripter.StopAction, 'procedure StopFlow;');
```

This is an alias, not a wrapper with extra flow semantics. The same implementation chain calls `StopExecution`, which calls `CancelExecution` and then marks the log cancelled.

**Behaviour and limitations**

- A field- or view-map call cancels every view and field in the containing map and clears each view's reprocessing flag.
- Outside a field/view context only the log cancellation is applied.
- The active script is not unwound; use `Exit` to skip remaining statements.
- Cancellation is observed at processing checkpoints and can be cleared by an action configured with `IgnoreCancel=True`.
- No failure status or reason is added automatically.
- Existing database, file, transport and other side effects are not rolled back.

Despite the `Flow` name, it should be treated as a cooperative flag propagated through the current action executor. It is not a process-kill or transactional-abort facility.

**Related entries**

- [`StopAction`](StopAction.md) is the exact registered native target.
- [`StopExecution`](StopExecution.md) supplies the underlying cancellation implementation.
- [`CancelExecution`](CancelExecution.md) omits the flow-log cancellation signal.

<small>Created 2026-07-15</small>
