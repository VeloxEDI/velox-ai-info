---
title: ID
description: Returns the collection-assigned integer identity that remains stable while the item stays in the same collection.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, collection-item, id, identity, lifetime]
---

```Delphi
property ID: Integer read;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Item: TCollectionItem;
begin
  Item := TCollectionItem.Create(nil);
  try
    // Zero is only the default field value here, not a collection identity.
    Value := Item.ID;
  finally
    Item.Free;
  end;
end;
```

### Usage

Returns the collection-assigned integer identity that remains stable while the item stays in the same collection.

### Additional Technical Info
`ID` exposes the item's stored collection identity. When a compatible collection inserts an item, it assigns its current `NextID` and increments that counter. Reordering the item or inserting/removing other items does not change the value, so it is more stable than [`Index`](Index.md) for referring to an attached item during that collection's lifetime.

Ordinary collection `Clear` removes and frees items but does not reset the next-ID counter, so subsequently added items normally do not reuse the cleared IDs. Current Delphi also has native reset operations, but Velox does not expose them on a public collection page and host code can still call them. Treat uniqueness as scoped to the actual collection instance and current host lifecycle, not as a database, cross-run or global identifier.

Detaching through [`Collection := nil`](Collection.md) leaves the numeric field unchanged, but it is no longer an identity owned by the former collection. Attaching to any compatible collection, including the original one, assigns that collection's next ID. A directly constructed detached item starts with the zero-initialized value `0`; it has not been assigned and can collide with a real first item.

The property is read-only in scripts. Use it to locate/reconcile items only while the owning collection is alive and unchanged by native reset behavior. Do not serialize it as a durable business key or assume IDs are dense; deleted items leave gaps.

Reading the field is constant-time and has no notification side effect. The owning collection remains mutable and unsynchronised, so an ID does not keep the object alive or make concurrent access safe.

The source-reviewed example intentionally shows the non-meaningful detached default. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollectionItem.ID`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollectionItem.ID) - Delphi identity semantics.
- [Free Pascal: `TCollectionItem.ID`](https://www.freepascal.org/docs-html/rtl/classes/tcollectionitem.id.html) - compatible distinction between ID and current index.

<small>Created 2026-07-15</small>
