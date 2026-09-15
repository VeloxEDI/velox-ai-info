---
title: "Map"
description: "Provides the active TvxMap when the script is executing for a custom map item."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variable
  - map
  - execution-context
---

```Delphi
Map: TvxMap
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Map <> nil then
    Value := Map.ModuleName
  else
    Value := Null;
end;
```

### Usage

Provides the active TvxMap when the script is executing for a custom map item.

**Ownership, errors and performance**

Velox owns the map. Never free it or retain it outside the current execution. Reading the bound reference is constant-time. Nil dereference and errors from called map members propagate; the variable itself performs no I/O.

### Additional Technical Info
`Map` exposes the live `TvxMap` associated with the current `TvxCustomMapItem`. Velox declares the name in every scripter so reusable script source can compile, but binds an instance only in a custom-map context.

The variable is a host-owned object reference and can be nil/unbound outside map execution.

**Implementation**

`RegisterVariables` always registers `Map` as `TvxMap`; the source comment explicitly says this allows other scripts such as Velox scriptlets to compile even though they cannot always reference a current custom map. During instance binding, Velox calls `SetVarToInstance('Map', TvxCustomMapItem(MapItem).Map)` only when `MapItem is TvxCustomMapItem`.

**Behaviour and edge cases**

- Check for nil before dereferencing in reusable code or scriptlets.
- A declared `Map` name does not prove that the current execution is a map event.
- When assigned, it is the underlying map shared by the current map item, not a copy of configuration.
- Different field/view map items can expose the same parent map. Do not use object identity to infer the current field/view; use the specific event context variables for that purpose.
- A non-nil map does not prove that all views, fields, connections or modules are valid/enabled.
- Treat the public reference as read-only context. Member calls can mutate map/execution state and should follow their documented contracts.

**Related entries**

- [`Action`](Action.md) and [`Flow`](Flow.md) expose the action that owns the current execution.
- [`Source`](Source.md) and [`Dest`](Dest.md) expose the surrounding data definitions.

<small>Created 2026-07-15</small>
