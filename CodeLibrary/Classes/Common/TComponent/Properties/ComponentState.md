---
title: ComponentState
description: Exposes the current read-only set of low-level Delphi component lifecycle and streaming flags.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcomponent, componentstate]
---

```Delphi
property ComponentState: TComponentState read;
```

### Example

```Delphi
function ComponentIsDestroying(const Item: TComponent): Boolean;
begin
  Result := csDestroying in Item.ComponentState;
end;
```

### Usage

`ComponentState` exposes the current read-only set of low-level Velox component lifecycle and streaming flags.

**Parameters and result**

Read-only `TComponentState` set. More than one flag can be present simultaneously.

**Behaviour**

- Flags are transient observations and can change during callbacks.
- `csDestroying` can warn that a component/owned graph is being torn down, but it does not make later access safe.
- Design/loading flags are Velox context, not persisted business state.
- An empty set is valid for an ordinary runtime component.

**Errors and edge cases**

A nil receiver fails. The property itself does not raise for an empty/unknown combination.

### Additional Technical Info
`ComponentState` is a script-visible property declared on hidden ancestor `TComponent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`ComponentState` is a Delphi set of transient flags such as loading, reading, writing, destroying, designing, updating and fixup states. It describes native component machinery, not Velox flow status.

**Implementation trace**

The PascalScript helper reads the native `TComponent.ComponentState` field. Studio 37.0 component/streaming methods include and exclude flags as lifecycle operations proceed; scripts receive the current set without a setter.

**Side effects and ownership**

Read-only. Testing a flag does not pause, cancel or change the corresponding lifecycle.

**Performance and concurrency**

O(1). It is not an atomic lifecycle protocol for cross-thread coordination.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`DestroyComponents`](../Methods/DestroyComponents.md) participates in destruction state.
- [`Owner`](Owner.md) explains the ownership graph affected by lifecycle operations.

**External references**

- [Embarcadero DocWiki: `System.Classes.TComponent.ComponentState`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent.ComponentState)
- [Free Pascal: `TComponent.ComponentState`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.componentstate.html)

<small>Created 2026-07-15</small>
