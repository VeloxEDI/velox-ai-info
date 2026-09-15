---
title: Sender
description: Holds the single Sender header identity and takes precedence over the first From address for Indy's default SMTP MAIL FROM envelope.
sidebar_position: 31
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, sender, from, smtp, envelope]
---

```Delphi
property Sender: TIdEmailAddressItem read write;
```

### Example

```Delphi
procedure SetResponsibleSender;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.Sender.Text := 'Velox Mailer <mailer@example.invalid>';
end;
```

### Usage

Holds the single Sender header identity and takes precedence over the first From address for Velox's default SMTP MAIL FROM envelope.

### Additional Technical Info
`Sender` returns one live [`TIdEMailAddressItem`](../../TIdEMailAddressItem.md) owned directly by the message. It is distinct from the author list in [`FromList`](FromList.md): RFC message semantics use Sender for the agent responsible for transmission when that differs from the author(s).

Assignment copies Address and Name into the existing object; it does not replace ownership. Direct edits mutate the same borrowed item. Nil assignment is not guarded, and `Text` parsing is permissive rather than validating.

[`GenerateHeader`](../Methods/GenerateHeader.md) encodes the item into the `Sender` header. [`ProcessHeaders`](../Methods/ProcessHeaders.md) assigns raw `Sender` directly through the item's `Text` parser. Unlike list fields, it does not subsequently call the encoded-display-name decoder, so an encoded word can remain in Name after loading. [`ClearHeader`](../Methods/ClearHeader.md) empties `Sender.Text` but retains the item.

Indy's default SMTP send trims `Sender.Address` and uses it as MAIL FROM when nonempty. Otherwise it trims the `Address` of [`From`](From.md), which can create a blank first FromList item as a read side effect. Only the raw Address is used for this envelope choice; the display Name is irrelevant. Custom send overloads can supply another envelope sender, including an empty bounce sender.

Header Sender, From authors and SMTP MAIL FROM serve different purposes and may legitimately differ, but careless mismatch can fail anti-spoofing policy or confuse operators. Validate domains and authorization before sending. [`NoEncode`](NoEncode.md) skips the generated Sender header while the transport may still use this property for its envelope sender.

The example uses `.invalid` and was source-reviewed only; no network operation occurred.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - Sender object, header generation and parsing.
- [Indy upstream: `TIdSMTPBase.Send`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdSMTPBase.pas) - Sender-first MAIL FROM selection.
- [RFC 5322 section 3.6.2](https://www.rfc-editor.org/rfc/rfc5322#section-3.6.2) - From and Sender roles.
- [RFC 5321 section 3.3](https://www.rfc-editor.org/rfc/rfc5321#section-3.3) - SMTP envelope sender context.

<small>Created 2026-07-15</small>
