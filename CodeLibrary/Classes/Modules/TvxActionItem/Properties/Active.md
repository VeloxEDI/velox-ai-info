---
title: Active
description: Reads or changes whether the action manager should execute this configured action step.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - action-step
  - active
---

```Delphi
property Active: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Step: TvxActionItem;
begin
  if Action.ActionCount > 0 then
  begin
    Step := Action.Actions[0];
    Value := Step.Active;
  end
  else
    Value := False;
end;
```

### Usage

`Active` reads or changes whether the action manager should execute this configured action step.

**Errors**

The getter and setter perform direct field access and do not raise a validation error on a valid object. A nil/stale item reference or an invalid index used to obtain the item can fail before this property is accessed.

**Usage notes**

The item is owned by Velox. Do not free it, and do not use this property as a durable scheduler, authorisation control or substitute for saving reviewed action configuration.

### Additional Technical Info
`Active` is a read/write Boolean alias that controls whether the parent action manager should execute this configured action step.

`True` allows the manager to attempt the step when it reaches it. `False` makes the manager skip the step. The native construction default is `True`; a loaded action can start with its saved/configured value instead.

**Implementation**

`Active` is registered only in the scripting layer. Its runtime getter and setter read and write the native [`ItemActive`](ItemActive.md) property, which is backed directly by one Boolean field. There is no second `Active` field and no conversion or validation.

**Behaviour**

The action manager checks the field immediately before each step. If it is false, the manager advances to the next item without calling this step's execute method or changing the action log status for a failed execution.

Writing the property changes the live loaded action item. All references to that item, including reads through `ItemActive`, see the new value immediately. The assignment is not an automatic configuration save, does not validate whether an action module is assigned and does not load or unload the module.

If a script changes `Active` on the step that is currently running, that step has already passed the manager's check. The write does not abort, cancel or roll back the current call. It can affect subsequent manager passes while the same action object remains loaded.

**Edge cases and quirks**

- `Active` and `ItemActive` are exact aliases; last assignment wins.
- `True` is permission to attempt the step, not proof that it will run successfully. Cancellation, prior log failure, missing configuration or the concrete step's own errors can still prevent or fail execution.
- `False` skips the manager's call to that step. It does not reverse side effects from an earlier execution.
- Reloading the parent action can restore configured state and replace the object. A retained reference can then be stale.

**Side effects**

Assignment changes the execution decision for the shared in-memory action item. It performs no direct file, database, network or log operation and does not persist the module by itself.

**Performance and concurrency**

Access is constant-time. There is no script-facing lock or atomic compare-and-set operation. Avoid concurrent mutation of the same loaded step; the action manager uses whichever live value it observes when it reaches the check.

**Related entries**

- [`ItemActive`](ItemActive.md) — exact native-name alias for the same field.
- [`TvxActionItem`](../../TvxActionItem.md) — ownership, acquisition and lifetime of the containing step.
- [`TvxActionMan`](../../TvxActionMan.md) — checks the flag while iterating configured steps.
- [`Action`](../../../../Variables/Modules/Action.md) — supplies the current action manager.

<small>Created 2026-07-15</small>
