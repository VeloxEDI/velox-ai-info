---
title: "Flow"
description: "Provides an alias of Action for the current Velox flow object."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variable
  - action
  - flow
---

```Delphi
Flow: TvxActionMan
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Flow.ModuleName;
end;
```

### Usage

Provides an alias of Action for the current Velox flow object.

**Behaviour**

- `Flow` and `Action` are aliases, not copies and not parent/child objects.
- Property changes or method side effects through either alias affect the same action object.
- In normal execution the object belongs to the current action context. Do not cache it for another execution or thread.
- In design/reference contexts, the fallback action can have default/empty state. A non-nil reference alone does not prove that a configured flow is executing.
- The variable declaration is not `const`, but scripts should not replace or nil the reference; doing so only disrupts their view of host context.

**Ownership, errors and side effects**

Velox owns the instance. Never call `Free` on it. Reading the reference has no I/O, but accessed properties/methods can log, query, mutate, start work or raise exceptions as documented for `TvxActionMan`. Errors from member access propagate unless the called member handles them.

### Additional Technical Info
`Flow` is the host-provided `TvxActionMan` for the current script. It exposes the live action/flow object and is exactly the same instance as [`Action`](Action.md).

The object reference is available as execution context. Treat the reference itself as read-only and host-owned. Members exposed by `TvxActionMan` can read or change live action state according to their individual contracts.

**Implementation**

During compilation, Velox registers both `Action` and `Flow` as `TvxActionMan`. Before execution, `SetVariableInstances` resolves `lAction := TvxActionMan(Action)` and binds both names to that same pointer.

The backing `GetAction` resolver first uses the action associated with the current custom map item or script item. If no action is available, it creates a scripter-owned `TvxActionMan` fallback for map design. That fallback makes the reference non-nil but does not represent a configured, running production flow.

**Performance and concurrency**

Retrieving the already-bound reference is constant-time. The object represents mutable execution state and is not documented as a general cross-thread object; use it only inside the current script execution.

**Related entries**

- [`Action`](Action.md) is the exact alias.
- [`Map`](Map.md) exposes the active custom map when available.
- [`Source`](Source.md) and [`Dest`](Dest.md) expose the current data-definition context.

<small>Created 2026-07-15</small>
