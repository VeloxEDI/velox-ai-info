---
title: Delete
description: Destroys the TCollection item at a zero-based index and shifts later collection positions.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcollection, delete]
---

```Delphi
procedure Delete(Index: Integer);
```

### Example

```Delphi
procedure RemoveFirstItem(const Items: TCollection);
begin
  if Items.Count > 0 then
    Items.Delete(0);
end;
```

### Usage

`Delete` destroys the TCollection item at a zero-based index and shifts later collection positions.

**Parameters and result**

`Index` is a current zero-based list position from 0 through `Count - 1`. It is not a `TCollectionItem.ID`.

**Behaviour**

- Later items shift toward index zero after deletion.
- The target object is destroyed rather than merely unlinked.
- An item's persistent `ID` and its current `Index` are different concepts; use `FindItemID` for an ID.
- Deletion can invoke collection notifications/destructors before the call returns.

**Errors and edge cases**

An index below zero or at/above `Count` raises the Velox list range exception before a valid target can be freed. Exceptions from notification/destruction propagate and may leave a partially completed mutation.

### Additional Technical Info
`Delete` is a script-visible method declared on hidden ancestor `TCollection`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Delete` removes and frees exactly one collection item selected by its current zero-based position. It does not return the removed object and must not be followed by use of an alias to that item.

**Implementation trace**

Studio 37.0 first sends the internal `cnDeleting` notification for `FItems[Index]`, then calls `Free` on that item. The item's destructor releases it from the collection, triggers the remaining collection notifications and changes subsequent indexes.

**Side effects and ownership**

Destroys an owned object, mutates the list and can invoke descendant code. All aliases to the deleted item become stale.

**Performance and concurrency**

Index validation is O(1); removal can be O(n) because later pointers shift, plus callback/destructor cost. Concurrent access is unsafe.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Count`](../Properties/Count.md) defines the valid index range.
- [`FindItemID`](FindItemID.md) searches by item ID rather than position.
- [`Clear`](Clear.md) destroys every item.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollection.Delete`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.Delete)
- [Free Pascal: `TCollection.Delete`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.delete.html)

<small>Created 2026-07-15</small>
