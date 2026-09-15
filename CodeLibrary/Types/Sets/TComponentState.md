---
title: TComponentState
description: Reports the active loading, streaming, destruction and design-time flags of a script-visible component.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, set, component, lifecycle, state]
---

```Delphi
TComponentState = set of TComponentStateE
```

### Example

```Delphi
function ComponentIsUsable(const State: TComponentState): Boolean;
begin
  Result := not (csDestroying in State) and
            not (csLoading in State) and
            not (csReading in State);
end;
```

### Usage

`TComponentState` reports the active loading, streaming, destruction and design-time flags of a script-visible component.

#### Behavior and boundaries

- The runtime function directly copies the current Velox `TComponent.ComponentState` set. It performs no remapping; correctness depends on the currently aligned member ordinals.
- The property is read-only in Velox scripting. The component framework changes flags during streaming, design work and destruction.
- Treat the value as an instantaneous snapshot. A lifecycle transition can occur after a check, so it is not a synchronization primitive.
- Most Velox flow execution occurs at runtime, making design flags unusual, but components can still expose loading, reading, fix-up or destruction states.
- Do not persist the set's bit pattern. Persist named application state instead if a flow needs a durable lifecycle record.

### Additional Technical Info
`TComponentState` is the read-only state returned by the inherited `ComponentState` property of script-visible Delphi components. The PascalScript compiler calls its hidden element enumeration `TComponentStateE`; the installed Delphi source calls the corresponding host element type `TComponentStateItem`. Both current declarations contain the same eleven members in the same order.

| Member | Meaning and relationship |
|---|---|
| `csLoading` | The component and its children are being loaded; it remains set until loading completes. |
| `csReading` | Properties are currently being read from a stream. `csLoading` is also set. |
| `csWriting` | Properties are currently being written to a stream. |
| `csDestroying` | Destruction has started or is imminent; avoid initiating new work against the component. |
| `csDesigning` | The component belongs to a form/design surface being manipulated at design time. |
| `csAncestor` | The component originated in an ancestor form; normally paired with `csDesigning`. |
| `csUpdating` | The component is applying ancestor changes; normally paired with `csAncestor`. |
| `csFixups` | References to components in another form are still awaiting fix-up after loading. |
| `csFreeNotification` | Other components requested notification when this component is destroyed. |
| `csInline` | The component is an inline/nested design instance such as an embedded frame. |
| `csDesignInstance` | The component is the root object in a designer; it appears with `csDesigning`. |

**Related Code Library entries**

- [Sets](../Sets.md) - set constructors, membership and operator rules.

**External references**

- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - member meanings and relationships.
- [Embarcadero ComponentState property](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponent.ComponentState) - read-only framework behavior.
- [Free Pascal set types](https://www.freepascal.org/docs-html/ref/refsu16.html) - compatible set representation concepts.

<small>Created 2026-07-15</small>
