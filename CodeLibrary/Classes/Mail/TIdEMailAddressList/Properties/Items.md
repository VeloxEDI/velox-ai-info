---
title: Items
description: Indexes borrowed list-owned items, while assignment copies Address and Name into the existing destination object instead of replacing it.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, collection, index, assign]
---

```Delphi
property Items[Index: Integer]: TIdEMailAddressItem read write; default;
```

### Example

```Delphi
procedure CopyFirst(const Source, Target: TIdEMailAddressList);
begin
  if (Source.Count > 0) and (Target.Count > 0) then
    Target.Items[0] := Source.Items[0];
end;
```

### Usage

Indexes borrowed list-owned items, while assignment copies Address and Name into the existing destination object instead of replacing it.

### Additional Technical Info
`Items` is the zero-based default indexed property of [`TIdEMailAddressList`](../../TIdEMailAddressList.md).

| Component | Meaning |
|---|---|
| `Index` | Existing position from `0` through `Count - 1`. Out-of-range access raises through Delphi's collection list. |
| Read result | Borrowed `TIdEMailAddressItem` owned by this list. |
| Assigned value | Borrowed source item whose fields are copied into the existing destination item. |

Reading does not clone or transfer ownership. The reference becomes invalid when the item is deleted, the list is cleared, [`EMailAddresses`](EMailAddresses.md) replaces the list, or the list/owning message is destroyed. Insertions/deletions can change its `Index`.

#### Assignment copies; it does not replace

The setter delegates to Delphi `TCollection.SetItem`, which calls `Assign` on the existing item at `Index`. `TIdEMailAddressItem.Assign` copies raw `Address` and `Name` when the source has the same type.

The destination object keeps its identity, collection ownership, ID and index. The source stays in its own collection. Later edits are independent. Assigning the same object to itself is harmless field self-copy.

The item's `Assign` override and raw field setters do not call inherited `Changed`. The destination content can therefore change without the list owner receiving a normal item-change notification.

A nil or incompatible source reaches inherited assignment and raises rather than clearing the destination. Index validation occurs before assignment. Address/Name assignment is not an insertion and does not change `Count`.

This copy contract is similar to [`AddItems`](../Methods/AddItems.md), but it overwrites one existing item's content rather than appending. [`SortByDomain`](../Methods/SortByDomain.md) uses a different route: it swaps and reparses formatted `Text`, so retained objects keep identity while content changes.

The getter is O(1). Assignment copies managed Strings proportional to their length and can trigger collection change behavior; failures propagate without an explicit transaction. The list and items are mutable and not thread-safe.

The source-reviewed example checks both bounds before copying. It does not transfer objects or send mail.

**External references**

- [Indy upstream: `TIdEMailAddressList.Items`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - typed getter/setter and item Assign override.
- [Embarcadero DocWiki: `System.Classes.TCollection.Items`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.Items) - Delphi indexed collection contract.
- [Free Pascal: `TCollection.Items`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.items.html) - compatible collection property context; Velox executes current Delphi/Indy source.

<small>Created 2026-07-15</small>
