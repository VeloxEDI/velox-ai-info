---
title: csDesigning
description: "Marks a component that belongs to a form or design surface currently being manipulated at design time."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, component-state, designing]
---

```Delphi
csDesigning = 4
```

### Example

```Delphi
function IsDesigning(const State: TComponentState): Boolean;
begin
  Result := csDesigning in State;
end;
```

### Usage

`csDesigning` marks a component that belongs to a form or design surface currently being manipulated at design time.

### Additional Technical Info
`csDesigning` is member ordinal 4 of the component-state element enumeration and a flag in [`TComponentState`](../../Types/Sets/TComponentState.md). It reports that the component is part of a form/design hierarchy being manipulated by a designer.

Most Velox execution occurs at runtime, so this flag is normally absent. Its presence is not a supported way for a script to switch product mode, suppress validation or assume that external services are safe to call. Design-time code can still load properties and invoke framework hooks.

The flag propagates through component ownership relationships and can accompany `csAncestor`, `csInline` or `csDesignInstance`. Treat it as read-only context and test it with set membership. The example is source-reviewed only; no designer was run.

**External references**

- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - design-state meaning.
- [Free Pascal TComponentState](https://www.freepascal.org/docs-html/rtl/classes/tcomponentstate.html) - compatible state set.

<small>Created 2026-07-15</small>
