---
title: Clear
description: Destroys every TCollection item from last to first inside an internally balanced update batch.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcollection, clear]
---

```Delphi
procedure Clear;
```

### Example

```Delphi
procedure RemoveAllItems(const Items: TCollection);
begin
  if Items.Count > 0 then
    Items.Clear;
end;
```

### Usage

`Clear` removes and destroys every item in the collection, starting with the last item.

**Parameters and result**

It has no parameters or return value. Calling it on an already-empty collection is a no-op and does not enter an update batch.

**Behaviour**

- Items are selected from the end of the current list, so ordinary removal proceeds last-to-first.
- The collection remains the owner of item lifetime; removed items are destroyed, not returned.
- Collection notifications can occur during the call and can observe a partially cleared collection.

**Errors and edge cases**

A nil collection raises an object-reference failure. An exception from an item destructor or collection callback propagates; items already freed stay freed and unprocessed items can remain.

### Additional Technical Info
`Clear` is a script-visible method declared on hidden ancestor `TCollection`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Clear` removes all items from the collection by destroying the item objects. It is ownership/destruction, not a detach operation, and any script aliases to removed items become invalid.

**Implementation trace**

The Studio 37.0 terminal checks whether the internal list is non-empty, calls `BeginUpdate`, repeatedly frees the current last item, and calls `EndUpdate` in a `finally` block. Each item destructor removes itself through the collection machinery, including notifications implemented by descendants.

**Side effects and ownership**

All item objects can be destroyed, descendant notifications can run and live indexes/count change throughout the operation. External aliases to items are not set to nil.

**Performance and concurrency**

Ordinary work is O(n), plus each item's destructor and descendant notification cost. It mutates shared state and is not safe for concurrent iteration or mutation.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Count`](../Properties/Count.md) reports the live number of remaining items.
- [`Delete`](Delete.md) destroys one indexed item; [`BeginUpdate`](BeginUpdate.md) explains notification batching.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollection.Clear`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.Clear)
- [Free Pascal: `TCollection.Clear`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.clear.html)

<small>Created 2026-07-15</small>
