---
title: TIdEMailAddressList
description: Owns an ordered set of mail-address items and exposes permissive list parsing, formatting, copying, domain filtering and content-swapping sorting.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, mail, email-address, collection, parser]
---

```Delphi
TIdEMailAddressList = class(TOwnedCollection)
```

### Example

```Delphi
procedure AddRecipients(const Recipients: TIdEMailAddressList);
var
  Item: TIdEMailAddressItem;
begin
  Item := Recipients.Add;
  Item.Text := 'North Queue <north@example.invalid>';

  Item := Recipients.Add;
  Item.Text := 'South Queue <south@example.invalid>';
end;
```

### Usage

`TIdEMailAddressList` owns an ordered set of mail-address items and exposes permissive list parsing, formatting, copying, domain filtering and content-swapping sorting.

### Additional Technical Info
`TIdEMailAddressList` owns an ordered collection of [`TIdEMailAddressItem`](TIdEMailAddressItem.md) entries. It is used by message recipient properties and other Indy mail components.

Velox exposes [`Add`](TIdEMailAddressList/Methods/Add.md), [`AddItems`](TIdEMailAddressList/Methods/AddItems.md), [`AddressesByDomain`](TIdEMailAddressList/Methods/AddressesByDomain.md), [`FillTStrings`](TIdEMailAddressList/Methods/FillTStrings.md), [`GetDomains`](TIdEMailAddressList/Methods/GetDomains.md), [`SortByDomain`](TIdEMailAddressList/Methods/SortByDomain.md), default indexed [`Items`](TIdEMailAddressList/Properties/Items.md) and combined [`EMailAddresses`](TIdEMailAddressList/Properties/EMailAddresses.md).

#### Ownership and inherited collection operations

A list exposed by `TIdMessage` is message-owned and borrowed. Its items are list-owned. `Add` returns a borrowed item; `Clear`, deletion or owner destruction frees it and invalidates retained references. Do not free the list or items separately unless your own native API explicitly transferred ownership.

The hidden collection ancestors provide `Count`, `Clear`, deletion and update/assignment behavior under their declaring paths. Indexes are zero-based and shift after deletion. The collection is homogeneous: every added entry is a `TIdEMailAddressItem`.

#### List parsing and formatting

`EMailAddresses` reads as each item's formatted `Text` joined with comma-space. Assignment clears the list first, then permissively splits commas, comments, quoted text, group labels and semicolons before delegating each part to the item parser. It is canonicalizing rather than byte-preserving and is not strict validation.

Because clearing happens before parsing, assignment is destructive even for malformed input or a later exception. Empty input leaves the list empty. Blank parsed entries and the special `<>` form are removed.

`AddItems` is the safer field-copy operation when a source list already exists: it appends new items and copies raw `Address` and `Name`. It is still non-transactional on failure.

#### Domain operations and important mutation semantics

`AddressesByDomain` clears a supplied destination list, then copies matching entries through formatted `Text`. Matching is case-insensitive and locale-aware. Never pass the source list itself: it is cleared before iteration and becomes empty.

`GetDomains` clears a supplied `TStrings`, emits unique lowercase derived domains and includes empty String when an item has no parsed domain. `FillTStrings` differs: it appends every formatted address without clearing and dereferences a nil target.

`SortByDomain` performs a stable, case-sensitive, locale-aware bubble sort. It does **not** move collection items. It swaps their formatted `Text`, causing existing item identities, IDs and indexes to remain fixed while each object's `Address`/`Name` content changes. Round-tripping through `Text` can also canonicalize unusual input. Do not retain an item reference as the identity of a particular recipient across sorting.

The item field/setter implementation does not call inherited `Changed`. Direct item edits, indexed content assignment and the content-swapping sort can therefore occur without the collection owner receiving a normal item-change notification.

#### Failure, scale and concurrency

All mutations are synchronous and non-transactional. Parser, allocation, target-list callback and collection exceptions can leave cleared or partially populated output. Validate/copy into a separately owned staging structure when replacement must be atomic.

Most scans are O(n); formatting/concatenation can copy growing Strings, and `SortByDomain` is O(n²). Apply practical recipient count and header-length limits. Lists, items, target strings and owner messages are mutable and not thread-safe.

The source-reviewed example appends two fictional `.invalid` recipients and does not send mail.

**External references**

- [Indy upstream: `IdEMailAddress.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - complete list implementation used by Velox.
- [RFC 5322 section 3.4](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.4) - normative address-list and group syntax; this implementation is permissive rather than validating.

<small>Created 2026-07-15</small>
