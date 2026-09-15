---
title: opRemove
description: Identifies a Delphi component notification sent while an ownership link is being removed or a registered component is being destroyed.
sidebar_position: 182
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, delphi, component, notification, destruction]
---

```Delphi
opRemove = 1
```

### Example

```Delphi
function IsRemovalNotification(Operation: TOperation): Boolean;
begin
  Result := Operation = opRemove;
end;
```

### Usage

`opRemove` identifies a Velox component notification sent while an ownership link is being removed or a component is being destroyed.

### Additional Technical Info
`opRemove` is the second value in Delphi's `TOperation` enumeration. It tells notification-handling code that a component is being removed from an owner's component list or that a component registered for free notification is being destroyed. Velox registers `TOperation` as a hidden scripting type, while exposing its constants for comparisons and compatible API parameters.

The example only classifies the received value. `opRemove` is not an instruction: comparing, assigning or passing the constant does not remove or free a component.

**Exact lifecycle position**

For an explicit `TComponent.RemoveComponent` call, current Delphi source validates the name change and then calls the owner's `Notification(AComponent, opRemove)` before it clears the component reference and removes the component from the owner's list. During destruction, a component also calls `Notification(Self, opRemove)` on components in its free-notification list.

This ordering gives a handler an opportunity to compare the supplied component and clear its own non-owning field while the callback reference can still be identified. It does not make the component safe to retain. After destruction-driven notification returns, the object continues through teardown and its memory will be released.

The base notification implementation removes reciprocal free-notification links when the operation is `opRemove`, then forwards the event through currently owned components. The traversal tolerates child removal during callbacks. An override that omits inherited processing can prevent propagation and leave framework bookkeeping inconsistent.

**Velox-specific behavior and quirks**

Velox uses this value as a defensive lifetime signal in several internal component classes:

- database and definition modules set references to removed data/SQL components to `nil`;
- log-relative components clear a removed log reference;
- the system database releases matching cached SQL connections; and
- `TvxNotification` maps the value to its `OnRemove` callback.

These are identity checks, not name or type searches. An `opRemove` notification for an unrelated component must be ignored. In particular, do not clear every component reference merely because the operation equals `opRemove`.

`TvxNotification.Subscribe` calls `AComponent.FreeNotification(Self)`. That subscription normally produces an `opRemove` callback when `AComponent` is destroyed. It does not transfer ownership, and `Unsubscribe` removes the mutual notification registration without destroying either object.

**Safety and common mistakes**

- Clear or release only the field that equals the notified component.
- Do not free the notified component merely because this value was received; destruction or removal is already controlled by the component framework.
- Do not access the component after the notification chain has returned, and avoid calling code that can recursively destroy it during an unrelated handler.
- Keep overrides fast. Notification can fan out recursively through an ownership tree and can occur repeatedly during component streaming and teardown.
- Component ownership and free-notification lists are mutable and are not a general thread-safe publish/subscribe mechanism.

An owned component may be destroyed as part of its owner's teardown without every sibling receiving the same route of notification unless the relevant free-notification relationship exists. Code holding a non-owned component reference should register for free notification rather than relying only on shared ownership-tree propagation.

**External references**

- [Embarcadero `System.Classes.TOperation`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TOperation)
- [Embarcadero `TComponent.Notification`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TComponent.Notification)
- [Embarcadero `TComponent.RemoveComponent`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TComponent.RemoveComponent)
- [Free Pascal `TOperation`](https://www.freepascal.org/docs-html/rtl/classes/toperation.html)
- [Free Pascal `TComponent.Notification`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.notification.html)
- [Free Pascal `TComponent.RemoveComponent`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.removecomponent.html)

<small>Created 2026-07-15</small>
