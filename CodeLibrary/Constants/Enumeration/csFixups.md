---
title: csFixups
description: "Marks a component whose streamed references to components outside its form are still awaiting fix-up."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, component-state, fixups, streaming]
---

```Delphi
csFixups = 7
```

### Example

```Delphi
function HasPendingReferenceFixups(const State: TComponentState): Boolean;
begin
  Result := csFixups in State;
end;
```

### Usage

`csFixups` marks a component whose streamed references to components outside its form are still awaiting fix-up.

### Additional Technical Info
`csFixups` is member ordinal 7 of the component-state element enumeration and a flag in [`TComponentState`](../../Types/Sets/TComponentState.md). It indicates that the streaming system still has unresolved references to components in another form/design context.

While present, a reference property can be nil or incomplete even though its serialized name was read. Do not treat the component graph as fully connected or start work that depends on those links. The framework resolves fixups; scripts cannot complete them by modifying the flag.

This is a component-streaming state, not a Velox data-repair queue, retry status or general configuration-validation result. The example is source-reviewed only; no stream/fixup processing ran.

**External references**

- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - fixup-state definition.
- [Free Pascal TComponentState](https://www.freepascal.org/docs-html/rtl/classes/tcomponentstate.html) - compatible streaming state.

<small>Created 2026-07-15</small>
