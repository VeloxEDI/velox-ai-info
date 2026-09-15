---
title: Insert
description: Creates a collection item by appending it and then moves the new item to the requested zero-based index.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcollection, insert]
---

```Delphi
function Insert(Index: Integer): TCollectionItem;
```

### Example

```Delphi
function InsertFirstItem(const Items: TCollection): TCollectionItem;
begin
  Result := Items.Insert(0);
end;
```

### Usage

`Insert` creates a collection item by appending it and then moves the new item to the requested zero-based index.

**Parameters and result**

`Index` is the desired zero-based position in the collection *after* creation. Valid positions are 0 through the new `Count - 1`; using the old count appends. The result is the new live `TCollectionItem`.

**Behaviour**

- Observers can see the new item appended before it is moved to the requested position.
- Without an outer update batch, add and move can cause separate change notifications.
- The item class is fixed by the collection; the caller does not supply it.
- The result is collection-owned and must not be independently freed unless the owning API explicitly permits item removal that way.

**Errors and edge cases**

Item construction, callbacks and index movement can raise. Because append happens before movement and there is no rollback block in `Insert`, an invalid move or callback failure can leave the newly created item present.

### Additional Technical Info
`Insert` is a script-visible method declared on hidden ancestor `TCollection`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Insert` constructs a new instance of the collection's configured item class and places it at a requested index. The returned item remains owned by the collection.

**Implementation trace**

The current Delphi implementation calls `Add` first, which constructs and appends the item and runs add notifications, then assigns the new item's `Index`. That setter moves the already-added item and runs the collection's change path again.

**Side effects and ownership**

Allocates an item, mutates order and invokes item construction/collection notifications. Existing indexes can change.

**Performance and concurrency**

Construction/callback cost dominates; the move is O(n) in the internal list. Use `BeginUpdate`/`EndUpdate` for notification batching, not thread safety.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`BeginUpdate`](BeginUpdate.md) can batch the add-and-move notifications.
- [`Count`](../Properties/Count.md) helps calculate a valid destination.
- [`Delete`](Delete.md) destroys a current indexed item.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollection.Insert`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.Insert)
- [Free Pascal: `TCollection.Insert`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.insert.html)

<small>Created 2026-07-15</small>
