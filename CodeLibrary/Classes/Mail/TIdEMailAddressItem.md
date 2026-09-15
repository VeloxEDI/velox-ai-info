---
title: TIdEMailAddressItem
description: Represents one collection-owned mail address through independent raw address/name fields and permissive parsed or formatted views.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, mail, email-address, parser, ownership]
---

```Delphi
TIdEMailAddressItem = class(TCollectionItem)
```

### Example

```Delphi
procedure AddRecipient(const Recipients: TIdEMailAddressList);
var
  Recipient: TIdEMailAddressItem;
begin
  Recipient := Recipients.Add;
  Recipient.Address := 'integration@example.invalid';
  Recipient.Name := 'Integration Queue';
end;
```

### Usage

`TIdEMailAddressItem` represents one collection-owned mail address through independent raw address/name fields and permissive parsed or formatted views.

#### Ownership and lifetime

Normal items are owned by a [`TIdEMailAddressList`](TIdEMailAddressList.md), commonly a property of `TIdMessage` such as recipients, carbon-copy recipients or blind-copy recipients. Create entries with [`TIdEMailAddressList.Add`](TIdEMailAddressList/Methods/Add.md). The returned item is borrowed: clearing/freeing its list or owning message destroys it.

The `Collection`, `Index` and `ID` properties describe its position in the address list. Do not retain an item after clearing or freeing its list, and do not free an item independently.

### Additional Technical Info
`TIdEMailAddressItem` stores one address entry. Velox exposes the raw [`Address`](TIdEMailAddressItem/Properties/Address.md) and [`Name`](TIdEMailAddressItem/Properties/Name.md) fields, the combined parsed/formatted [`Text`](TIdEMailAddressItem/Properties/Text.md) view, and derived [`User`](TIdEMailAddressItem/Properties/User.md) and [`Domain`](TIdEMailAddressItem/Properties/Domain.md) views.

The class parses and formats legacy Internet mail-header syntax, but it is not an address validator. It does not verify mailbox existence, DNS, permitted domain labels, RFC length limits, internationalized-domain conversion, SMTPUTF8 support or deliverability. Raw setters accept empty and malformed strings.

#### Raw and derived state

`Address` and `Name` are independent managed String fields. Assigning either performs no syntax check and does not parse the other. `User` and `Domain` are calculated each time from `Address`; they are not separate stored fields.

Reads split at the **last** `@`. Their setters replace around the **first** `@`, so multiple-at strings behave asymmetrically. With no at-sign, both derived getters return empty, while a derived setter inserts an at-sign and preserves some or all of the previous raw value. Use one well-formed `local-part@domain` address before modifying either component.

#### Parsing and formatting

Assigning `Text` first clears both raw fields and then runs Indy's permissive state-machine parser. It understands common display names, comments, quotes, angle brackets and backslash escapes, and it silently normalizes many inputs. It does not provide a success result or strict failure boundary; malformed or ambiguous text can produce partial/unexpected fields rather than an exception.

Reading `Text` formats the current fields. A display name may be quoted and escaped. The address local part may be quoted when unsupported characters are detected, but the current period shortcut stops further validation after the first period and can emit a later invalid character unquoted. Do not use formatted output as proof that raw input was valid.

Collections copy items through `Assign`, which copies only `Address` and `Name`. Formatting/parsing helpers such as sorting and filtering can round-trip via `Text`, potentially canonicalizing unusual source strings.

The raw fields and custom setters do not call the inherited collection `Changed` notification. Editing `Address`, `Name`, `Text`, `User` or `Domain` can therefore mutate a list-owned item without notifying its owner or observers that expect standard `TCollectionItem` setter behavior.

All state is mutable and not thread-safe. Parsing and formatting are O(n) for typical input but repeatedly concatenate managed strings and can allocate more than the final text. Impose sensible length limits before accepting external header data.

The source-reviewed example uses `Add`, then sets raw fields deliberately. The `.invalid` domain makes it non-deliverable; no mail operation was executed.

**External references**

- [Indy upstream: `IdEMailAddress.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - implementation source for the item parser and formatter used by Velox.
- [RFC 5322 section 3.4: Address Specification](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.4) - normative mailbox/address-list syntax; the Indy parser is deliberately more permissive in places.

<small>Created 2026-07-15</small>
