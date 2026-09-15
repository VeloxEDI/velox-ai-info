---
title: ItemActive
description: Provides the native-name alias of the action step's shared execution-enable flag.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - action-step
  - item-active
---

```Delphi
property ItemActive: Boolean read write;
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
    Value := Step.ItemActive;
  end
  else
    Value := False;
end;
```

### Usage

`ItemActive` provides the Velox-name alias of the action step's shared execution-enable flag.

**Behaviour**

Reading `ItemActive` returns the current live value. Assignment immediately changes the value observed through `Active`, other references to this item and the parent manager's next execution check.

The manager tests the field before calling each step. False skips that step and continues iteration. Changing the field after the current step has already started cannot abort or roll back it. The value can remain changed while the same action object stays loaded, but assignment alone does not write the module configuration to durable storage.

**Errors**

Direct access on a valid item has no range check or validation failure. Errors arise from using a nil/stale item reference or from the indexed/context operation used to obtain it.

**Usage notes**

Prefer `Active` in new scripts when its meaning is clearer, but retain `ItemActive` when matching existing configuration or script conventions. Both are supported by the current runtime.

### Additional Technical Info
`ItemActive` is the read/write native-name property for the same execution-enable field exposed more concisely as [`Active`](Active.md).

The native constructor initializes the field to `True`. Loaded configuration can supply `False`. The parent manager skips the step when the current value is false.

**Implementation**

The native property reads and writes a private Boolean field. Scripting runtime registration connects both `ItemActive` and `Active` to the same getter and setter. The names are aliases, not independent settings.

**Edge cases and quirks**

- `Step.ItemActive := False` followed by `Step.Active := True` leaves both names true; the last assignment changes their one shared field.
- The flag controls the manager's call boundary only. It does not prove assignment, successful module loading, valid source/destination data or successful execution.
- Skipping a step does not undo any side effect produced when that step ran earlier.
- Reloading the parent action can restore configured state or replace the item, invalidating a cached reference.

**Side effects**

Writing the field changes a shared in-memory execution decision. It does not directly execute the action, cancel a running action, log, perform I/O or save configuration.

**Performance and concurrency**

Access is constant-time and unsynchronised. Do not use the property as cross-thread coordination; concurrent reads and writes can race with the manager's live check.

**Related entries**

- [`Active`](Active.md) — exact alias and the shorter scripting name.
- [`TvxActionItem`](../../TvxActionItem.md) — acquisition, ownership and class-level behaviour.
- [`TvxActionMan`](../../TvxActionMan.md) — consumes this field before executing each step.
- [`Action`](../../../../Variables/Modules/Action.md) — supplies the current action manager.

<small>Created 2026-07-15</small>
