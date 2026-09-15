---
title: TvxActionItem
description: Represents one configured action step returned by a Velox action manager.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - modules
  - action-step
---

```Delphi
TvxActionItem = class(TvxLogRelative)
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

`TvxActionItem` represents one configured action step returned by a Velox action manager.

**Usage notes**

Treat the object as borrowed from Velox. Do not call `Free`, retain it after its parent module is reloaded or destroyed, or cast it to an unregistered Velox type merely because the object is a item.

### Additional Technical Info
`TvxActionItem` is the script-visible base type for one configured step in a Velox action or flow. Scripts normally receive a concrete descendant through `TvxActionMan.Actions[Index]` and use the two registered Boolean properties to inspect or control whether the manager should execute that step.

**Implementation**

The scripting compiler registers `TvxActionItem` beneath a hidden logging-aware implementation ancestor. Runtime registration exposes exactly [`Active`](TvxActionItem/Properties/Active.md) and [`ItemActive`](TvxActionItem/Properties/ItemActive.md); both property names use the same native `ItemActive` read/write helpers.

The native class has additional members used by the engine, but they are not registered on this scripting class. Their presence in product source does not make them callable from a Velox script.

No constructor is registered for scripts. Obtain an instance from [`TvxActionMan.Actions`](TvxActionMan/Properties/Actions.md) or another documented live context rather than attempting to create one.

**Behaviour**

Velox creates and owns each action item as part of its parent action manager. The native construction default is active, although loaded configuration can supply a different current value.

Before the manager executes each configured step, it reads the shared active field. A false value skips that step and advances to the next item without calling the step's execute method. Changing the property on a step whose execution has already begun does not cancel or roll back that current call, but it can affect a later pass through the same loaded action.

The object is live and shared with its parent manager. Changes through one reference, or through either property alias, are immediately visible through every reference to the same action item. Assignment changes in-memory module state; it does not itself save the action configuration.

**Edge cases and quirks**

- `Active` is a scripting alias for native `ItemActive`; it is not a separate inherited flag.
- `ItemActive` and `Active` can never hold different values on the same instance.
- A valid item can still refer to an unavailable or invalid concrete action module. The active flag does not prove that the step is assigned, loadable or guaranteed to succeed.
- An invalid `Actions` index or an unavailable parent/context fails before a member can be read. Guard the source reference and index as documented by the property that returns the item.

**Performance and concurrency**

Reading or writing the active field is constant-time and performs no I/O. The field has no script-facing lock. Do not read and change the same loaded action item concurrently from multiple executions; the manager consumes the current live value and a racing result is not defined as an atomic configuration decision.

**Related entries**

- [`Active`](TvxActionItem/Properties/Active.md) — preferred readable name for the shared execution-enable field.
- [`ItemActive`](TvxActionItem/Properties/ItemActive.md) — native-name alias for the same field.
- [`TvxActionMan`](TvxActionMan.md) — owns the configured action-item collection.
- [`Action`](../../Variables/Modules/Action.md) — supplies the current action manager to a script.

<small>Created 2026-07-15</small>
