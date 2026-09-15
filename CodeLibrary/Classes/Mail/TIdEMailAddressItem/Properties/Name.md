---
title: Name
description: Gets or replaces the raw display name that the Text formatter may quote and place before the current address.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, display-name, quoting]
---

```Delphi
property Name: string read write;
```

### Example

```Delphi
procedure LabelRecipient(const Item: TIdEMailAddressItem);
begin
  Item.Name := 'Operations, North';
  // Item.Text will quote the comma-containing display name.
end;
```

### Usage

Gets or replaces the raw display name that the Text formatter may quote and place before the current address.

### Additional Technical Info
`Name` is the raw display-name field of [`TIdEMailAddressItem`](../../TIdEMailAddressItem.md). Assignment stores the String directly; it does not trim, validate, quote, encode or modify [`Address`](Address.md).

Reading [`Text`](Text.md) decides how to present the name. If `Name` is non-empty and does not compare equal to `Address` under Indy's case-insensitive locale-aware comparison, it is written before the formatted address. Characters outside Indy's ASCII atom-plus-space set cause double-quoting; embedded backslashes and double quotes receive a backslash escape.

If `Name` and `Address` compare equal case-insensitively, the formatter suppresses the name and returns only the address representation. This comparison can be affected by process/operating-system locale. The stored `Name` remains unchanged.

When `Address` is empty but `Name` is not, formatted `Text` becomes the name followed by `<>` (with quoting as required). That is a formatter artifact, not a valid deliverable mailbox. When both fields are empty, `Text` is empty.

Assigning `Text` later clears and reparses both fields, so round-tripping a raw name may normalize whitespace, remove comments, remove quotes or unescape characters. Set `Address` and `Name` directly when the fields are already trusted and separated.

The formatter handles RFC-style quoting but not MIME encoded-word generation itself. Downstream mail-header encoding may transform non-ASCII display text; this property alone does not establish an encoding or SMTP compatibility contract. Apply length, control-character and disclosure policies to external names.

The setter is O(n) managed-string assignment and does no I/O. Formatting can scan and concatenate the complete name. The containing item is mutable, normally list-owned and not thread-safe.

The source-reviewed example demonstrates formatter quoting with a fictional name and sends no mail.

**External references**

- [Indy upstream: `TIdEMailAddressItem.GetText`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - display-name comparison, quoting and escaping implementation.
- [RFC 5322 section 3.4](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.4) - display-name/mailbox syntax.
- [RFC 5322 section 3.2.4](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.2.4) - quoted-string context.

<small>Created 2026-07-15</small>
