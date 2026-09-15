---
title: CCList
description: Holds carbon-copy addresses projected into the Cc header and included in the default SMTP recipient envelope.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, cc, recipient, header, smtp]
---

```Delphi
property CCList: TIdEmailAddressList read write;
```

### Example

```Delphi
procedure AddCarbonCopy;
var
  Msg: TIdMessage;
  Recipient: TIdEmailAddressItem;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Recipient := Msg.CCList.Add;
  Recipient.Text := 'Technical Review <review@example.invalid>';
end;
```

### Usage

`CCList` holds carbon-copy addresses projected into the Cc header and included in the default SMTP recipient envelope.

### Additional Technical Info
`CCList` returns the live message-owned [`TIdEMailAddressList`](../../TIdEMailAddressList.md) used for carbon-copy recipients. Items and the list are borrowed; clearing the list/message or ending the owning action invalidates retained item references.

The writable property is copy-based. Assignment calls `CCList.Assign(value)` rather than replacing the list, while direct collection operations mutate it in place. Nil assignment is not guarded. Address `Text` parsing is permissive and does not prove deliverability or RFC validity.

[`GenerateHeader`](../Methods/GenerateHeader.md) MIME-encodes names and joins all entries into the `Cc` header. [`ProcessHeaders`](../Methods/ProcessHeaders.md) clears/repopulates the list through destructive address-list parsing and decodes encoded display names. Empty lists produce an empty generated field, and [`ClearHeader`](../Methods/ClearHeader.md) clears the collection.

Indy's default SMTP `Send(message)` copies Recipients, CCList and BccList into a separate envelope-recipient list. CC addresses therefore affect both visible header recipients and delivery. Another SMTP overload can instead supply an explicit envelope list, so the `Cc` header alone never proves who actually received the transaction.

No deduplication occurs across To/Cc/Bcc. Apply policy checks, count/length limits and address validation before sending, especially for externally derived headers. [`NoEncode`](NoEncode.md) writes raw Headers and ignores this typed property unless the raw `Cc` field was separately updated.

The example uses a fictional `.invalid` address and was not executed or sent.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - Cc ownership and header projection.
- [Indy upstream: `IdSMTPBase.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdSMTPBase.pas) - default envelope aggregation.
- [RFC 5322 section 3.6.3](https://www.rfc-editor.org/rfc/rfc5322#section-3.6.3) - To, Cc and Bcc destination fields.
- [RFC 5321 section 3.3](https://www.rfc-editor.org/rfc/rfc5321#section-3.3) - SMTP envelope recipient semantics.

<small>Created 2026-07-15</small>
