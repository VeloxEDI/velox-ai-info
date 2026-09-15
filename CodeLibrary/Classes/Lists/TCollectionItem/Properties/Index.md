---
title: Index
description: Gets the item's current zero-based collection position or reorders an attached item within its owner.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, collection-item, index, ordering, reorder]
---

```Delphi
property Index: Integer read write;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Item: TCollectionItem;
begin
  Item := TCollectionItem.Create(nil);
  try
    Item.Index := 10;  // detached: ignored
    Value := Item.Index;  // -1
  finally
    Item.Free;
  end;
end;
```

### Usage

`Index` gets the item's current zero-based collection position or reorders an attached item within its owner.

### Additional Technical Info
`Index` is the item's current zero-based position in its [`Collection`](Collection.md). The getter searches the collection's backing list for the same object and returns that position. It returns `-1` when detached. Because lookup is linear, repeatedly reading every item's index inside another loop can become O(n²).

For an attached item, assigning a different valid position moves the same object within the collection list and then sends an all-items change notification. The item's [`ID`](ID.md) does not change, but the positions of every crossed item do. Any cached index, positional selection or enumeration must therefore be reconsidered after the move.

The setter first obtains the current index. When the item is detached that is `-1`, so every assignment is ignored without validating the requested value; the example remains at `-1`. When attached, an out-of-range target is rejected by the underlying generic list and the exception propagates. Assigning the existing position is a no-op and sends no notification.

Reordering is not a copy and does not transfer ownership. The collection continues to own the item. Concrete collection update code can observe the new order synchronously and can raise from the notification after the move has occurred, so a caught exception does not necessarily mean the order is unchanged.

Use `ID` when identity must survive ordinary reordering, and re-read `Index` only when current presentation or processing order matters. Do not persist it as a durable identifier.

Lookup and moves are O(n) for an array-backed collection and are not thread-safe. The source-reviewed example demonstrates exact detached behavior and was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollectionItem.Index`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollectionItem.Index) - Delphi current-position semantics.
- [Free Pascal: `TCollectionItem.Index`](https://www.freepascal.org/docs-html/rtl/classes/tcollectionitem.index.html) - compatible zero-based ordering context.

<small>Created 2026-07-15</small>
