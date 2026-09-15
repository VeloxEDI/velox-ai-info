---
title: IgnoreCancel
description: Controls whether the action manager clears per-step cancellation and continues to later steps.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - flow
  - cancellation
---

```Delphi
property IgnoreCancel: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.IgnoreCancel;
end;
```

### Usage

`IgnoreCancel` controls whether the action manager clears per-step cancellation and continues to later steps.

**Behaviour**

True can allow later steps to run after a step cancels the flow. It does not ignore a false log status/error: the loop also requires successful log status, so an error can still stop iteration. It does not retry the cancelled step, undo its work or guarantee that every later step executes.

A custom script can set the property during its step. The manager reads it after that step returns, so the new value can affect handling of cancellation produced by the current step.

### Additional Technical Info
`IgnoreCancel` is a read/write Boolean policy used by the action-step loop after each executed step.

The new-action default is `False`; loaded flow configuration can supply another value.

**Implementation**

When true, the manager checks the log cancellation flag after each step. If cancelled, it clears that flag so iteration can continue. If not cancelled, it records that at least one step completed without cancellation. After the loop, it sets cancellation again when no step completed without cancellation.

The property is a direct field with no validation, automatic reset per execution or save operation.

**Edge cases and quirks**

- If every attempted step cancels, the manager restores cancellation at the end even though it cleared individual cancellations along the way.
- Inactive steps are skipped before this post-step logic and do not count as a non-cancelled successful step.
- Errors and cancellation are different signals. `IgnoreCancel = True` is not equivalent to [`ActionStatus`](ActionStatus.md) being true.
- The live value can remain changed for later executions while the same manager stays loaded; assignment alone does not persist reviewed configuration.

**Side effects**

Writing changes how the manager mutates its shared log cancellation state after steps. It does not cancel or resume work immediately at the assignment statement.

**Performance and concurrency**

Access is constant-time. The field and log state are unsynchronised script-facing execution state; do not use them as cross-thread coordination.

**Related entries**

- [`ActionStatus`](ActionStatus.md) — sticky Boolean execution failure state.
- [`Actions`](Actions.md) — step collection governed by the loop.
- [`TvxActionItem.Active`](../../TvxActionItem/Properties/Active.md) — causes a step to be skipped before execution.

<small>Created 2026-07-15</small>
