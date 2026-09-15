---
title: Count
description: Reports the live number of items currently owned by a TCollection descendant.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcollection, count]
---

```Delphi
property Count: Integer read;
```

### Example

```Delphi
function HasCollectionItems(const Items: TCollection): Boolean;
begin
  Result := Items.Count > 0;
end;
```

### Usage

`Count` reports the live number of items currently owned by a collection.

**Parameters and result**

Read-only `Integer`. An empty collection returns 0.

**Behaviour**

- The value changes immediately as items are added, inserted, removed or destroyed.
- Count says nothing about an item's persistent `ID`, validity of its fields or business meaning.
- A previously read value can become stale after callbacks or other code mutate the collection.
- Use a fresh count when validating a later index.

**Errors and edge cases**

Reading through a nil collection raises an object-reference failure. The property itself has no overflow under normal list limits; allocation/list limits constrain practical size.

### Additional Technical Info
`Count` is a script-visible property declared on hidden ancestor `TCollection`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Count` is the current number of item references in the collection's internal list. Valid positional indexes are zero through `Count - 1`.

**Implementation trace**

The PascalScript read helper calls Delphi `TCollection.Count`. Studio 37.0 returns the internal generic list's `Count` without scanning items.

**Side effects and ownership**

No side effect and no ownership transfer.

**Performance and concurrency**

O(1). Concurrent mutation makes the observation unstable and collection access is not synchronised.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Delete`](../Methods/Delete.md) and [`Insert`](../Methods/Insert.md) use zero-based positions.
- [`FindItemID`](../Methods/FindItemID.md) searches a separate item-ID domain.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollection.Count`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.Count)
- [Free Pascal: `TCollection.Count`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.count.html)

<small>Created 2026-07-15</small>
