---
title: Create
description: Creates a detached caller-owned item for nil or inserts a new item into a compatible owning collection.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, collection-item, constructor, ownership, attachment]
---

```Delphi
constructor Create(Collection: TCollection); virtual;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Item: TCollectionItem;
begin
  Item := TCollectionItem.Create(nil);
  try
    Value := (Item.Collection = nil) and (Item.Index = -1);
  finally
    Item.Free;
  end;
end;
```

### Usage

Creates a detached caller-owned item for nil or inserts a new item into a compatible owning collection.

### Additional Technical Info
`Create` invokes the virtual [`Collection`](../Properties/Collection.md) setter with the supplied reference. It performs no other base initialization. Delphi's zero-initialized instance fields mean a nil construction starts detached, with `Collection=nil`, [`Index`](../Properties/Index.md) `-1`, numeric [`ID`](../Properties/ID.md) `0` and base [`DisplayName`](../Properties/DisplayName.md) equal to `TCollectionItem`.

A detached object is caller-owned and must be freed. It has no collection-scoped identity or useful domain payload, so direct base construction is mainly relevant to framework code and diagnostics. The example uses this exact case and does not imply that scripts should replace a host's concrete item type with the base class.

For a non-nil collection, the setter calls that collection's private insertion path. The collection first requires the new object to be an instance of its configured item class. If compatible, it appends the item, assigns the next collection ID, sets the item name, sends add/change notifications and assumes lifetime management. Do not separately free the result while the owner is expected to retain it.

If the object is incompatible, insertion raises before attachment. When a Delphi constructor raises, object construction is unwound automatically; callers do not receive a usable result. Even for a compatible class, allocation, naming or notification code in a concrete descendant/collection can raise, so construction should not be treated as a transactional host update.

The constructor is virtual. Calling it through a descendant type executes the descendant's override and can add validation or state. Prefer a collection's registered `Add` method because it constructs exactly the class the collection requires; the collection type itself is hidden from the public Code Library even though compatible visible descendants expose selected operations.

Construction/insertion is O(1) amortized, with possible list growth and host callbacks. It is not thread-safe.

The source-reviewed example creates and frees a detached base instance. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollectionItem.Create`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollectionItem.Create) - recommends creating items through their collection.
- [Free Pascal: `TCollectionItem`](https://www.freepascal.org/docs-html/rtl/classes/tcollectionitem.html) - compatible collection-managed construction context.

<small>Created 2026-07-15</small>
