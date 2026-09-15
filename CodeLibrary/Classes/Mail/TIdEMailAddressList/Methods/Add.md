---
title: Add
description: Appends a blank list-owned email-address item and returns a borrowed reference for immediate population.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, collection, add, ownership]
---

```Delphi
function Add: TIdEMailAddressItem;
```

### Example

```Delphi
procedure AddQueue(const Recipients: TIdEMailAddressList);
var
  Item: TIdEMailAddressItem;
begin
  Item := Recipients.Add;
  Item.Address := 'queue@example.invalid';
  Item.Name := 'Processing Queue';
end;
```

### Usage

Appends a blank list-owned email-address item and returns a borrowed reference for immediate population.

### Additional Technical Info
`Add` calls the inherited collection insertion and returns the new entry cast as [`TIdEMailAddressItem`](../../TIdEMailAddressItem.md). The item is appended at index `Count - 1` with empty `Address` and `Name` fields.

The list owns the item from the instant insertion succeeds. The return is borrowed; do not free it. It remains valid until the list deletes/clears it or the list/owning message is destroyed. Later collection edits can change its `Index`, and [`SortByDomain`](SortByDomain.md) can change its address/name content without moving the object.

Populate either raw `Address`/`Name` fields or the combined `Text` parser after adding. If subsequent assignment fails, the new blank or partially populated item remains in the list because the method and property writes are not a transaction. When atomicity matters, catch the error and delete/clear the incomplete entry through the owning collection policy.

The method does not enforce uniqueness, address syntax, recipient count, allowed domains or deliverability. Adding the same address multiple times creates distinct owned items. It also does not send or encode a message.

Insertion is usually amortized O(1), with collection growth allocation when capacity changes. Collection change notifications can run synchronously and propagate exceptions according to the native owner. The list is mutable and not thread-safe.

The source-reviewed example stores a reserved `.invalid` mailbox and was not executed against mail infrastructure.

**External references**

- [Indy upstream: `TIdEMailAddressList.Add`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - typed wrapper over owned-collection insertion.
- [Embarcadero DocWiki: `System.Classes.TCollection`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection) - Delphi collection ownership context.
- [Free Pascal: `TCollection`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.html) - compatible collection overview; Velox uses current Delphi/Indy behavior.

<small>Created 2026-07-15</small>
