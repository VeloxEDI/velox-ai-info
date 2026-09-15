---
title: ReplyTo
description: Holds the address list projected into Reply-To for response routing, without changing the default SMTP sender or recipient envelope.
sidebar_position: 30
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, reply-to, routing, header, address]
---

```Delphi
property ReplyTo: TIdEmailAddressList read write;
```

### Example

```Delphi
procedure SetReplyRoute;
var
  Msg: TIdMessage;
  ReplyAddress: TIdEmailAddressItem;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.ReplyTo.Clear;
  ReplyAddress := Msg.ReplyTo.Add;
  ReplyAddress.Address := 'support@example.invalid';
end;
```

### Usage

`ReplyTo` holds the address list projected into Reply-To for response routing, without changing the default SMTP sender or recipient envelope.

### Additional Technical Info
`ReplyTo` returns the live message-owned [`TIdEMailAddressList`](../../TIdEMailAddressList.md) used for the `Reply-To` header. It tells a recipient user agent where replies should be addressed; it does not redirect the original delivery.

Assignment calls `ReplyTo.Assign(value)` into the existing owned collection. Direct methods mutate it in place. The list/items are borrowed, nil assignment is not guarded, and permissive parsing is not strict address validation.

[`GenerateHeader`](../Methods/GenerateHeader.md) MIME-encodes and joins every entry into `Reply-To`. [`ProcessHeaders`](../Methods/ProcessHeaders.md) destructively parses the raw field and decodes display names. Empty input clears the generated value, and [`ClearHeader`](../Methods/ClearHeader.md) clears the list.

Indy's default SMTP envelope construction ignores ReplyTo: recipients come from To/Cc/Bcc, and MAIL FROM comes from [`Sender`](Sender.md) or [`From`](From.md). Reply routing is a header-level instruction only and can be ignored or overridden by mail software and policy.

[`NoEncode`](NoEncode.md) writes raw Headers, so typed ReplyTo edits are omitted unless the raw field is also synchronized. Validate externally supplied reply addresses to avoid redirecting users to attacker-controlled destinations, and make the change visible in business/security review when it crosses trust boundaries.

The example uses a reserved `.invalid` destination and was not executed or sent.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - Reply-To ownership, generation and parsing.
- [Indy upstream: `IdSMTPBase.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdSMTPBase.pas) - envelope fields that do not include ReplyTo.
- [RFC 5322 section 3.6.2](https://www.rfc-editor.org/rfc/rfc5322#section-3.6.2) - Reply-To originator-field semantics.

<small>Created 2026-07-15</small>
