---
title: Actions
description: Returns a borrowed configured action step by zero-based index from the live flow manager.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - flow
  - action-items
---

```Delphi
property Actions[Index: Integer]: TvxActionItem read;
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

`Actions` returns a borrowed configured action step by zero-based index from the live flow manager.

**Behaviour**

The returned object is a live configured step. Changes to script-available properties affect the manager's shared item. The same reference can become stale if the action is unloaded, rebuilt, released to the pool or destroyed.

The property does not filter inactive steps. Read [`TvxActionItem.Active`](../../TvxActionItem/Properties/Active.md) to see whether the manager should skip a returned item.

**Usage notes**

Velox owns every returned item. Never call `Free` on it.

### Additional Technical Info
`Actions` is the read-only indexed view of action steps owned by the current `TvxActionMan`.

Indexes are zero-based. Guard every access with `Index >= 0` and `Index < ActionCount`.

**Implementation**

The runtime helper passes the index to the native manager, which returns its child at that position cast as `TvxActionItem`. No copy is created and no ownership is transferred.

The runtime importer contains an earlier erroneous helper also registered under the name `Actions`, but it then registers the real indexed getter. PascalScript searches class items from the newest entry backwards, so the real indexed getter is the effective current binding. The erroneous entry instead leaves [`LinkedActionFID`](LinkedActionFID.md) without its required runtime name.

**Errors and quirks**

- Negative or `Index >= ActionCount` input reaches the underlying child list and can raise a range/list error.
- A count checked on a different/stale manager does not validate this access.
- The returned base type can represent different concrete action-step descendants. Only registered base/descendant members are callable.
- Do not infer execution order beyond the current collection order or retain the reference for another execution.

**Performance and concurrency**

Lookup is direct indexed collection access. It performs no step execution or I/O. Count/index access is not exposed as one locked operation; the manager is not a cross-thread collection API.

**Related entries**

- [`ActionCount`](ActionCount.md) — supplies the exclusive upper bound.
- [`TvxActionItem`](../../TvxActionItem.md) — returned type and ownership contract.
- [`LinkedActionFID`](LinkedActionFID.md) — separate declared property affected by the runtime naming defect.
- [`TvxActionMan`](../../TvxActionMan.md) — collection owner.

<small>Created 2026-07-15</small>
