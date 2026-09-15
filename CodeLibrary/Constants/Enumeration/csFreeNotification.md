---
title: csFreeNotification
description: "Marks that one or more components requested notification when this component is destroyed; it does not convey ownership."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, component-state, free-notification, ownership]
---

```Delphi
csFreeNotification = 8
```

### Example

```Delphi
function HasFreeNotificationObservers(const State: TComponentState): Boolean;
begin
  Result := csFreeNotification in State;
end;
```

### Usage

`csFreeNotification` marks that one or more components requested notification when this component is destroyed; it does not convey ownership.

### Additional Technical Info
`csFreeNotification` is member ordinal 8 of the component-state element enumeration and a flag in [`TComponentState`](../../Types/Sets/TComponentState.md). The framework sets it when other components have registered to receive destruction notification for this component.

The flag does not identify the observers, promise that callbacks are safe, keep the component alive or transfer/free ownership. It also does not mean this component observes someone else. Destruction notifications are framework bookkeeping, not an application event subscription contract.

The property is read-only and can change as components register/remove notifications. Do not use it as a concurrency or lifetime guard. The example is source-reviewed only; no notification was registered.

**External references**

- [Embarcadero TComponent.FreeNotification](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TComponent.FreeNotification) - registration behavior.
- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - flag meaning.
- [Free Pascal TComponentState](https://www.freepascal.org/docs-html/rtl/classes/tcomponentstate.html) - compatible state set.

<small>Created 2026-07-15</small>
