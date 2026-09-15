---
title: Recipients
description: Holds primary To addresses used in generated headers and combined with Cc/Bcc by Indy's default SMTP envelope path.
sidebar_position: 28
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, to, recipient, smtp, envelope]
---

```Delphi
property Recipients: TIdEmailAddressList read write;
```

### Example

```Delphi
procedure AddPrimaryRecipient;
var
  Msg: TIdMessage;
  Recipient: TIdEmailAddressItem;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Recipient := Msg.Recipients.Add;
  Recipient.Text := 'Destination <destination@example.invalid>';
end;
```

### Usage

`Recipients` holds primary To addresses used in generated headers and combined with Cc/Bcc by Velox's default SMTP envelope path.

### Additional Technical Info
`Recipients` is the live [`TIdEMailAddressList`](../../TIdEMailAddressList.md) owned by the message for primary `To` destinations. The collection and its items are borrowed and mutable; do not free or retain them beyond the owning message/action.

Assignment calls `Recipients.Assign(value)` and copies into the existing collection. Direct collection operations mutate it in place. Nil assignment is not guarded. Address parsing accepts malformed/ambiguous input and is not a deliverability check.

[`GenerateHeader`](../Methods/GenerateHeader.md) MIME-encodes display names and joins the list into the `To` header. [`ProcessHeaders`](../Methods/ProcessHeaders.md) destructively parses raw `To` and decodes display names. [`ClearHeader`](../Methods/ClearHeader.md) clears the list.

Indy's default SMTP `Send(message)` copies Recipients, [`CCList`](CCList.md) and [`BccList`](BccList.md) into a separate envelope list, then issues one RCPT command per copied entry. The aggregation does not deduplicate addresses. Explicit-recipient overloads can use a different envelope, so this property is not authoritative evidence of actual delivery targets.

An empty list can still coexist with raw To headers or an explicitly supplied SMTP envelope. Conversely, a populated list is ignored by [`NoEncode`](NoEncode.md) for header generation, although a sender may still use it for the envelope. Keep typed properties, raw headers and the transport call aligned.

Apply allow/deny policy, count/length bounds and strict address validation before network use. The example uses `.invalid` and was not executed or sent.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - recipient ownership and To projection.
- [Indy upstream: `IdSMTPBase.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdSMTPBase.pas) - default envelope aggregation and RCPT processing.
- [RFC 5322 section 3.6.3](https://www.rfc-editor.org/rfc/rfc5322#section-3.6.3) - destination header fields.
- [RFC 5321 section 3.3](https://www.rfc-editor.org/rfc/rfc5321#section-3.3) - envelope recipients and RCPT commands.

<small>Created 2026-07-15</small>
