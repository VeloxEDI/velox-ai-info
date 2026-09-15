---
title: opInsert
description: Identifies a Delphi component notification sent after a component has been inserted into an owner's component list.
sidebar_position: 181
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, delphi, component, notification, ownership]
---

```Delphi
opInsert = 0
```

### Example

```Delphi
function IsInsertionNotification(Operation: TOperation): Boolean;
begin
  Result := Operation = opInsert;
end;
```

### Usage

`opInsert` identifies a Velox component notification sent after a component has been inserted into an owner's component list.

### Additional Technical Info
`opInsert` is the first value in Delphi's `TOperation` enumeration. It tells notification-handling code that a component has just been inserted into an owner's component list. Velox registers `TOperation` as a hidden scripting type, while exposing its two constants for comparisons and for APIs whose signatures use the type.

The example only classifies a received value. Comparing a value with `opInsert` does not insert, own, create or initialise a component.

**Exact lifecycle position**

In the current Delphi implementation, `TComponent.InsertComponent` performs these operations before it sends this notification:

1. asks an attached designer whether insertion is permitted;
2. validates that the component can be contained by the proposed owner;
3. removes it from any previous owner;
4. validates that its name is empty or unique in the new owner;
5. inserts it into the new owner's component collection;
6. establishes the component reference and propagates design state when applicable; and
7. calls the owner's `Notification(AComponent, opInsert)`.

Consequently, notification code observes the component after its owner/list relationship has changed. It must not treat the callback as a cancellable `before insert` event. Earlier validation can raise an exception; if that happens before insertion completes, no `opInsert` notification is sent by this path.

The base `TComponent.Notification` implementation forwards the notification through the owner's current component tree. It iterates defensively because a callback can change that collection. Overrides should perform minimal work and preserve inherited propagation unless they deliberately replace the component framework contract.

**Velox-specific behavior and quirks**

Velox's internal `TvxNotification` helper translates `opInsert` to its `OnAdd` callback. However, its public `Subscribe` method uses Delphi `FreeNotification`, which registers for destruction/removal notification and does not itself insert the subscribed component into an owner. A subscription therefore normally produces `opRemove` when the component is destroyed, not an `opInsert` event. Do not interpret `OnAdd` as proof that `Subscribe` was called.

Most Velox source consumers use [`opRemove`](opRemove.md) to clear dependencies; there is no corresponding product-wide rule that every reference assignment emits `opInsert`. Component-property assignment, ownership insertion and free-notification registration are separate mechanisms.

**Side effects, errors and performance**

The enumeration value has no side effects and comparison is constant-time. The operation that generated it may have already changed ownership and may have invoked other notification handlers. Component ownership and notification lists are mutable framework state, not a thread-safe event bus; process them on the component's owning thread and avoid blocking, recursive ownership changes or retaining unverified references.

**External references**

- [Embarcadero `System.Classes.TOperation`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TOperation)
- [Embarcadero `TComponent.Notification`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TComponent.Notification)
- [Embarcadero `TComponent.InsertComponent`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TComponent.InsertComponent)
- [Free Pascal `TOperation`](https://www.freepascal.org/docs-html/rtl/classes/toperation.html)
- [Free Pascal `TComponent.Notification`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.notification.html)
- [Free Pascal `TComponent.InsertComponent`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.insertcomponent.html)

<small>Created 2026-07-15</small>
