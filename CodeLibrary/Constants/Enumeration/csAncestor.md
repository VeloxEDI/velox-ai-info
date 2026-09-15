---
title: csAncestor
description: "Marks a component inherited from an ancestor form or design definition while the component framework is in design state."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, component-state, ancestor, design]
---

```Delphi
csAncestor = 5
```

### Example

```Delphi
function IsInheritedDesignComponent(const State: TComponentState): Boolean;
begin
  Result := csAncestor in State;
end;
```

### Usage

`csAncestor` is present in a component's `TComponentState` when the Designer loaded that component from a parent design. Test it with `csAncestor in State`; do not compare the complete state set with the number `5`.

This is read-only design information. It does not identify the parent component, prove that every property came from the parent design, or give a script permission to change the design.

### Additional Technical Info
`csAncestor` is member ordinal 5 of the component-state element enumeration and a flag in [`TComponentState`](../../Types/Sets/TComponentState.md). It indicates that the component originated in an ancestor form/design definition. Delphi normally uses it together with `csDesigning`.

The flag is framework-controlled and the script property is read-only. It does not expose the ancestor object, guarantee that every property is inherited, grant permission to edit the design, or describe a runtime Velox parent/child relationship.

Test membership with `in`; do not compare the whole set to integer 5 or persist bit `1 shl 5` as a business contract. The returned set is an instantaneous lifecycle snapshot. The example is source-reviewed only; no design surface was opened.

**External references**

- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - authoritative member relationship.
- [Free Pascal TComponentState](https://www.freepascal.org/docs-html/rtl/classes/tcomponentstate.html) - compatible component-state set.

<small>Created 2026-07-15</small>
