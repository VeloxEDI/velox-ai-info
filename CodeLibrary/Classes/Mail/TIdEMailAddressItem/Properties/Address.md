---
title: Address
description: Gets or replaces the item's raw mailbox string without parsing, validation, normalization or display-name changes.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, mailbox, raw-value]
---

```Delphi
property Address: string read write;
```

### Example

```Delphi
procedure SetMailbox(const Item: TIdEMailAddressItem);
begin
  Item.Address := 'alerts@example.invalid';
end;
```

### Usage

`Address` gets or replaces the item's raw mailbox string without parsing, validation, normalization or display-name changes.

### Additional Technical Info
`Address` is the raw mailbox field of [`TIdEMailAddressItem`](../../TIdEMailAddressItem.md). Its getter and setter access the stored String directly.

The setter does not trim whitespace, remove angle brackets, split a display name, unquote a local part, lowercase a domain or check for an at-sign. Empty strings, multiple at-signs, comments, control characters and otherwise malformed values are accepted. No DNS, mailbox or deliverability check occurs.

Assign plain `local-part@domain` content here. To parse combined header text such as `Display Name <local@example.invalid>`, assign [`Text`](Text.md) instead and inspect the resulting fields.

#### Effects on related properties

Changing `Address` leaves [`Name`](Name.md) untouched. [`User`](User.md) and [`Domain`](Domain.md) are derived dynamically from the new raw value by scanning backward to the last `@`. If no at-sign exists, both getters return empty even though `Address` still contains text.

Reading [`Text`](Text.md) formats `Name` and `Address` together. That formatter may add angle brackets or quote the local part, but it does not modify this raw field. A later `Text` assignment is different: it clears and reparses both fields.

The raw value is used by recipient processing and message-header encoding. Accepting a String here does not mean downstream SMTP servers will accept it. Apply application-level syntax and allow/deny policies before saving externally sourced values.

#### Malformed and international content

The implementation operates on Delphi Unicode Strings but its formatter's atom character set is ASCII-oriented. Internationalized local parts and domains require an end-to-end SMTPUTF8/IDNA policy outside this property. Do not assume automatic Punycode conversion or Unicode normalization.

Multiple-at values expose a specific inconsistency: derived reads split at the last at-sign, while the `User` and `Domain` setters replace around the first. Normalize to a single at-sign before using component setters.

The property operation itself is O(n) for managed-string assignment and performs no I/O. The containing item is mutable and normally collection-owned; concurrent reads/writes and retained references after list clearing are unsafe.

The source-reviewed example sets a deliberately non-deliverable `.invalid` address and was not sent.

**External references**

- [Indy upstream: `TIdEMailAddressItem`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - raw `FAddress` storage and derived helpers.
- [RFC 5322 section 3.4.1: Addr-Spec Specification](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.4.1) - normative local-part and domain structure not enforced by this setter.
- [RFC 6532](https://www.rfc-editor.org/rfc/rfc6532.html) - internationalized header context; support must be established end to end.

<small>Created 2026-07-15</small>
