---
title: TvxActionMan
description: Represents the live Velox action or flow that owns configured steps and execution state.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - modules
  - flow
---

```Delphi
TvxActionMan = class(TvxModule)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.ModuleName + ': ' + IntToStr(Action.ActionCount) + ' step(s)';
end;
```

### Usage

`TvxActionMan` represents the live Velox action or flow that owns configured steps and execution state.

**Usage notes**

Velox owns the manager. Never call `Free` on it. Treat configuration-like setters as changes to shared loaded state unless the member page states otherwise; assignment does not automatically save reviewed configuration.

### Additional Technical Info
`TvxActionMan` is the live manager for one Velox action or flow. It owns the ordered action-step collection, definition manager, local execution data and status used while the flow runs. It also carries the request/response context and result policy when the flow is invoked through the Velox API.

**Implementation**

The scripting runtime registers this class beneath a hidden module ancestor and exposes one method plus 16 properties declared on `TvxActionMan`. Inherited module and logging members remain available according to their own registrations but are documented at their declaring ancestors.

No constructor is registered for scripts. Obtain the current object through [`Action`](../../Variables/Modules/Action.md) or its exact `Flow` alias. [`ExecuteFlow`](TvxActionMan/Methods/ExecuteFlow.md) obtains another manager internally from the action pool; it does not transfer ownership to the script.

**Behaviour**

The object is mutable execution state, not a detached configuration record. Collection reads, status changes, email resolution, definition-manager access and API properties operate on the action instance currently loaded for this execution.

Velox can return an action to its pool and reuse it after execution. Some fields reset per run, some configuration fields remain loaded and some API references deliberately remain assigned by their caller. Do not retain the object or one of its children after the current execution, assume that a later execution receives the same instance, or use it across threads.

An action normally owns its definition manager and action items. API request and response objects are borrowed from the waiting web request. The member pages distinguish these ownership models and the substantial risks of replacing live references.

**Edge cases and quirks**

- [`ActionStatus`](TvxActionMan/Properties/ActionStatus.md) is a failure latch: scripts can set it false but cannot restore it true through the setter.
- [`Data`](TvxActionMan/Properties/Data.md) and [`SourceManager`](TvxActionMan/Properties/SourceManager.md) are exact aliases, despite both being writable in the generated declaration.
- [`LinkedActionFID`](TvxActionMan/Properties/LinkedActionFID.md) has a current runtime-registration defect and must not be used from scripts.
- [`REST`](TvxActionMan/Properties/REST.md) describes the current invocation; it does not publish or authenticate an endpoint.
- A non-nil manager can be a design fallback with default or unloaded state. Check the exact member contract rather than treating object existence as proof of a running configured flow.

**Performance and concurrency**

Simple property reads are cheap, but `ExecuteFlow` performs synchronous flow execution and most inherited operations can log, query, commit, move files or call external services. `TvxActionMan` is not a general thread-safe scripting object. The action pool provides managers for executions, but that does not make concurrent mutation of one borrowed instance safe.

**Related entries**

- [`ExecuteFlow`](TvxActionMan/Methods/ExecuteFlow.md) — synchronously executes another flow.
- [`ActionCount`](TvxActionMan/Properties/ActionCount.md) and [`Actions`](TvxActionMan/Properties/Actions.md) — inspect configured steps.
- [`TvxActionItem`](TvxActionItem.md) — base type returned by `Actions[Index]`.
- [`Action`](../../Variables/Modules/Action.md) — current host-provided manager reference.

<small>Created 2026-07-15</small>
