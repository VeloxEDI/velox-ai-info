---
title: ReceiptRecipient
description: Holds the single address emitted into both modern disposition-notification and legacy return-receipt headers, without guaranteeing a receipt.
sidebar_position: 27
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, receipt, mdn, header, privacy]
---

```Delphi
property ReceiptRecipient: TIdEmailAddressItem read write;
```

### Example

```Delphi
procedure RequestDispositionNotification;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.ReceiptRecipient.Text :=
    'Integration Monitor <monitor@example.invalid>';
end;
```

### Usage

`ReceiptRecipient` holds the single address emitted into both modern disposition-notification and legacy return-receipt headers, without guaranteeing a receipt.

### Additional Technical Info
`ReceiptRecipient` returns one live [`TIdEMailAddressItem`](../../TIdEMailAddressItem.md) owned directly by the message. It identifies where a recipient user agent is asked to send a disposition/read notification. It does not cause or guarantee a receipt; policy, user choice, privacy controls and transport behavior can ignore it.

Assignment copies Address and Name into the existing owned item with `Assign`; it does not replace ownership. Direct edits mutate the same item. Nil assignment is not guarded, and its permissive `Text` parser is not mailbox validation.

[`GenerateHeader`](../Methods/GenerateHeader.md) encodes this item once and writes the identical value to both `Disposition-Notification-To` and legacy `Return-Receipt-To`. An empty item clears both generated values.

[`ProcessHeaders`](../Methods/ProcessHeaders.md) first assigns raw `Disposition-Notification-To` to `Text`. It falls back to raw `Return-Receipt-To` only if the first item's formatted Text is empty. Unlike list-valued address fields, this single-item path does not call Indy's extra encoded-display-name decoder after parsing; encoded words can therefore remain in Name when loading.

[`ClearHeader`](../Methods/ClearHeader.md) sets `ReceiptRecipient.Text` empty but retains the item object. [`NoEncode`](NoEncode.md) skips typed header generation, so changing this property has no effect on raw output.

Receipt requests disclose an address and can reveal message-reading behavior. Use only where policy permits, do not treat absence as delivery failure, and avoid using confidential/internal addresses in messages crossing trust boundaries.

The example is source-reviewed and uses `.invalid`; no receipt request was sent.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - dual generation and parsing precedence.
- [RFC 8098 section 2.1](https://www.rfc-editor.org/rfc/rfc8098#section-2.1) - Disposition-Notification-To semantics and consent considerations.
- [RFC 5322 section 3.4](https://www.rfc-editor.org/rfc/rfc5322#section-3.4) - mailbox syntax used by the address item.

<small>Created 2026-07-15</small>
