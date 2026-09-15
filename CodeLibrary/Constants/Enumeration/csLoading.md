---
title: csLoading
description: "Marks a component hierarchy being reconstructed from a stream, before all properties, children, and references are complete."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, component-state, loading, streaming]
---

```Delphi
csLoading = 0
```

### Example

```Delphi
function IsComponentStillLoading(const State: TComponentState): Boolean;
begin
  Result := csLoading in State;
end;
```

### Usage

`csLoading` marks a component hierarchy being reconstructed from a stream, before all properties, children, and references are complete.

### Additional Technical Info
`csLoading` is member ordinal 0 of the component-state element enumeration used by [`TComponentState`](../../Types/Sets/TComponentState.md). The framework sets it while loading a component and its owned children from a component stream, and clears it after loading completes.

Properties, child collections and cross-component references can be incomplete while the flag is present. Current Velox/product components use `csLoading` checks to defer connection, dataset and property side effects until configuration has been reconstructed.

`csReading` is a narrower property-read phase that normally occurs while `csLoading` is also set. `csFixups` can identify unresolved external references later in loading. None of these flags proves that business data has loaded or that a Velox flow is ready.

The state is read-only and instantaneous; it is not a lock. The example is source-reviewed only; no component stream was read.

**External references**

- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - loading-state definition.
- [Embarcadero TComponent.Loaded](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TComponent.Loaded) - completion callback context.
- [Free Pascal TComponentState](https://www.freepascal.org/docs-html/rtl/classes/tcomponentstate.html) - compatible state set.

<small>Created 2026-07-15</small>
