---
title: csDestroying
description: "Marks a component whose destruction has started or is imminent, warning callers not to initiate new work through it."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, component-state, destroying, lifetime]
---

```Delphi
csDestroying = 3
```

### Example

```Delphi
function ComponentCanStartWork(const State: TComponentState): Boolean;
begin
  Result := not (csDestroying in State);
end;
```

### Usage

`csDestroying` marks a component whose destruction has started or is imminent, warning callers not to initiate new work through it.

### Additional Technical Info
`csDestroying` is member ordinal 3 of the component-state element enumeration and a flag in [`TComponentState`](../../Types/Sets/TComponentState.md). The component framework sets it during destruction and propagates destruction notification through owned components.

Treat it as a warning to avoid starting callbacks, I/O or access through the component. It is not a lifetime guarantee: the object can be freed immediately after a check, and an already freed reference cannot safely be queried. The flag is therefore not a lock, reference count or substitute for producer-defined ownership.

Scripts cannot set the read-only state. Never free a host-owned component merely because this flag appears. The example is source-reviewed only; no component was destroyed.

**External references**

- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - destruction-state meaning.
- [Embarcadero TComponent](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TComponent) - component ownership/lifecycle context.
- [Free Pascal TComponentState](https://www.freepascal.org/docs-html/rtl/classes/tcomponentstate.html) - compatible state flag.

<small>Created 2026-07-15</small>
