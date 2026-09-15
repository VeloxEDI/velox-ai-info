---
title: TCollectionItem
description: Represents a normally collection-owned persistent item with collection-scoped identity, live ordering and virtual display naming.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, lists, collection-item, ownership, index]
---

```Delphi
TCollectionItem = class(TPersistent)
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Item: TCollectionItem;
begin
  // A detached base item is caller-owned. Real collection descendants are
  // normally obtained from their compatible owning collection.
  Item := TCollectionItem.Create(nil);
  try
    Value := Item.DisplayName + ':' + IntToStr(Item.Index);
  finally
    Item.Free;
  end;
end;
```

### Usage

`TCollectionItem` represents a normally collection-owned persistent item with collection-scoped identity, live ordering and display naming.

### Additional Technical Info
`TCollectionItem` is Delphi's base for persistent objects managed by a typed collection. Velox exposes it because visible domain classes, including mail address and message-part items, inherit its collection membership, [`ID`](TCollectionItem/Properties/ID.md), [`Index`](TCollectionItem/Properties/Index.md) and [`DisplayName`](TCollectionItem/Properties/DisplayName.md) behavior.

In ordinary use, obtain a concrete descendant from its host collection and treat it as borrowed. A compatible collection inserts the item, assigns an ID, reports it through a zero-based position and owns its lifetime. Clearing or destroying the collection frees its attached items. Freeing a borrowed item yourself removes and destroys it immediately and can invalidate other code that expects the host collection to retain it.

The registered virtual [`Create`](TCollectionItem/Methods/Create.md) accepts a hidden `TCollection` reference. Passing nil creates a detached caller-owned item as the example shows, but a raw base item has no domain payload and is rarely useful. Prefer the visible collection's `Add` method where one is available, because the collection constructs its required descendant class.

[`Collection`](TCollectionItem/Properties/Collection.md) can detach or move an item. Detachment does not free it; responsibility moves to the caller. Attachment gives lifetime management to the new collection. Reassignment is not transactional: the implementation removes the item from its old collection before it asks the new collection to accept it, so an incompatible destination can raise after leaving the item detached.

`ID` and `Index` are not interchangeable. `ID` is assigned from the collection's increasing counter and remains stable while the item stays in that collection. `Index` is the live order and changes when items are inserted, removed or rearranged. Detaching retains the old numeric ID but removes its collection-scoped meaning and returns `Index=-1`; attaching again assigns a new ID.

The base display name is the runtime class name. Assigning it on the base class stores nothing and only notifies an attached collection. Concrete descendants can override both accessors, so their displayed text and validation may differ.

Collection operations are mutable, synchronous and unsynchronised. Looking up `Index` searches the collection linearly; reordering/removal also shifts array elements. Do not cache indexes across edits, retain an item after owner destruction, or share collection state across concurrent Velox flows.

The source-reviewed example intentionally demonstrates the exceptional detached-base case and frees it. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollectionItem`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollectionItem) - authoritative Delphi class contract.
- [Free Pascal: `TCollectionItem`](https://www.freepascal.org/docs-html/rtl/classes/tcollectionitem.html) - compatible ownership overview; Velox follows current Delphi implementation details where the dialects differ.

<small>Created 2026-07-15</small>
