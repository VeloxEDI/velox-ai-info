---
title: FindItemID
description: Returns the first TCollectionItem whose persistent integer ID exactly matches a requested value.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcollection, finditemid]
---

```Delphi
function FindItemID(ID: Integer): TCollectionItem;
```

### Example

```Delphi
function FindCollectionItem(const Items: TCollection;
  const ItemID: Integer): TCollectionItem;
begin
  Result := Items.FindItemID(ItemID);
end;
```

### Usage

`FindItemID` returns the first TCollectionItem whose persistent integer ID exactly matches a requested value.

**Parameters and result**

`ID` is an exact signed integer item identifier. The result is a collection-owned live reference; nil means no current item matched.

**Behaviour**

- Search order is current collection order and the first match wins.
- IDs are assigned by collection machinery and can contain gaps after deletion; do not substitute an index.
- The method does not create, clone, retain or validate the returned item beyond the equality test.
- Mutating the collection can invalidate the returned reference.

**Errors and edge cases**

A nil collection raises an object-reference failure. A missing ID is normal and returns nil; dereferencing that nil result later is the caller's error.

### Additional Technical Info
`FindItemID` is a script-visible method declared on hidden ancestor `TCollection`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`FindItemID` searches the collection for a `TCollectionItem.ID` and returns that live item reference or nil. An item ID is not its zero-based position and need not be contiguous.

**Implementation trace**

Studio 37.0 scans `FItems` from index 0 to `Count - 1`, compares each item's integer `ID`, returns immediately on the first equality and returns nil after a complete miss.

**Side effects and ownership**

Read-only for the collection under the reviewed implementation. The result does not transfer ownership.

**Performance and concurrency**

O(n) comparisons and O(1) extra space. Concurrent mutation can invalidate both the scan assumptions and returned reference.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Count`](../Properties/Count.md) is the current scan bound.
- [`Delete`](Delete.md) accepts a position, not an item ID.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollection.FindItemID`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.FindItemID)
- [Free Pascal: `TCollection.FindItemID`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.finditemid.html)

<small>Created 2026-07-15</small>
