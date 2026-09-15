---
title: Collection
description: Gets or changes the collection managing the item, with detach-first reassignment and corresponding lifetime transfer.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, collection-item, collection, ownership, lifetime]
---

```Delphi
property Collection: TCollection read write;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Item: TCollectionItem;
begin
  Item := TCollectionItem.Create(nil);
  try
    Item.Collection := nil;  // same value: no operation
    Value := Item.Collection = nil;
  finally
    Item.Free;
  end;
end;
```

### Usage

Gets or changes the collection managing the item, with detach-first reassignment and corresponding lifetime transfer.

### Additional Technical Info
`Collection` identifies the hidden Delphi collection currently managing the item. A non-nil value means that collection contains the item and normally owns its lifetime. Nil means the item is detached and must have some other clear owner, commonly the caller that deliberately detached or constructed it.

Assigning the existing value is a no-op. Otherwise the setter first asks the old collection to remove the item, which clears its back-reference and sends extraction/change notifications. It then asks the new collection to insert it. Successful insertion requires the item to be an instance of the collection's configured item class, appends it, assigns a new [`ID`](ID.md) and sends add/change notifications.

The two phases are not rolled back as a unit. If the destination is incompatible or its insertion/naming/notification logic raises, the old removal has already happened and the item can remain detached. Catching the exception does not restore its previous owner or index. Retain a clear recovery owner and re-read `Collection` after a failed move.

Assigning nil deliberately detaches without freeing. Its [`Index`](Index.md) becomes `-1`, while the old numeric ID remains stored but is no longer a valid identity in that collection. The caller must then free the item or attach it to a compatible collection. Conversely, attaching a detached item transfers normal lifetime management to the collection; do not also free it through the old caller path.

Collection removal is generally linear because the backing list locates/shifts items; insertion is amortized O(1) plus collection-specific notifications. Both mutate shared owner state synchronously and are not thread-safe. Retained indexes and collection enumerations can become invalid.

The source-reviewed example demonstrates a safe no-op nil assignment on a caller-owned detached item. Real host-owned descendants should normally remain with their supplied owner. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollectionItem.Collection`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollectionItem.Collection) - Delphi collection membership reference.
- [Free Pascal: `TCollectionItem.Collection`](https://www.freepascal.org/docs-html/rtl/classes/tcollectionitem.collection.html) - compatible reassignment overview; failure ordering above is from current Delphi source.

<small>Created 2026-07-15</small>
