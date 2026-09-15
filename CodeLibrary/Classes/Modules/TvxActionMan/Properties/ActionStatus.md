---
title: ActionStatus
description: Reads the current flow result latch and can irreversibly mark the execution unsuccessful.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - flow
  - status
---

```Delphi
property ActionStatus: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action.ActionCount = 0 then
    Action.ActionStatus := False;
  Value := Action.ActionStatus;
end;
```

### Usage

`ActionStatus` reads the current flow result latch and can irreversibly mark the execution unsuccessful.

**Behaviour**

Setting false records flow failure state used by the enclosing execution result. It does not itself raise an exception, add an error message, cancel the log, stop the currently executing script statement or undo earlier work. The manager's separate log status also controls its step loop, so scripts should record a meaningful log error when failure needs diagnostic context.

Writing true after a false value has no effect.

### Additional Technical Info
`ActionStatus` is the current Boolean success latch for the flow. A script can change it from true to false to make the current/total action unsuccessful, but cannot restore it to true through this property.

The engine sets the backing current and total status to true at the start of `Execute`. The public setter reacts only to `False`.

**Implementation**

When assigned false, the native setter stores false in both the current action-status field and the total-status field. When assigned true, it performs no assignment. This deliberate asymmetric implementation makes failure sticky for the execution.

**Edge cases and quirks**

- This is not an ordinary freely assignable Boolean even though the generated declaration is read/write.
- False also latches total status, which affects the final return and sub-action aggregation.
- A false property value and log status are related execution signals but are not the same field. Changing this property alone does not guarantee immediate loop termination.
- It is not a transaction rollback instruction; external side effects already performed can remain.

**Side effects**

False changes the current and total in-memory result state. True has no side effect.

**Performance and concurrency**

Access is constant-time and unsynchronised. Use only on the current execution's manager; it is not a cross-thread signalling primitive.

**Related entries**

- [`ExecuteFlow`](../Methods/ExecuteFlow.md) — folds a false sub-action result into total status.
- [`IgnoreCancel`](IgnoreCancel.md) — controls cancellation handling, not this failure latch.
- [`TvxActionMan`](../../TvxActionMan.md) — owning execution object.

<small>Created 2026-07-15</small>
