---
title: csUpdating
description: "Marks an inherited component while ancestor-definition changes are being applied in the designer framework."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, component-state, updating, ancestor, design]
---

```Delphi
csUpdating = 6
```

### Example

```Delphi
function IsApplyingAncestorChanges(const State: TComponentState): Boolean;
begin
  Result := csUpdating in State;
end;
```

### Usage

`csUpdating` is present while the Designer is applying changes from a parent design to a component.

### Additional Technical Info
`csUpdating` is member ordinal 6 of the component-state element enumeration used by [`TComponentState`](../../Types/Sets/TComponentState.md). The design/streaming framework sets it while applying changes inherited from an ancestor component definition; it normally accompanies `csAncestor`.

It is unrelated to a dataset update, software upgrade, Git pull or Velox configuration publication. It does not mean changes have committed or that an application transaction exists.

The framework owns the transient read-only flag. Avoid side effects that assume the final inherited state while it is present. The example is source-reviewed only; no ancestor update ran.

**External references**

- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - updating/ancestor relationship.
- [Free Pascal TComponentState](https://www.freepascal.org/docs-html/rtl/classes/tcomponentstate.html) - compatible state context.

<small>Created 2026-07-15</small>
