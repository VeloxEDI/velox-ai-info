---
title: BccList
description: Holds blind-copy recipients used by the default SMTP envelope while normal generated output deliberately suppresses the Bcc header.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, bcc, recipient, smtp, privacy]
---

```Delphi
property BccList: TIdEmailAddressList read write;
```

### Example

```Delphi
procedure AddBlindCopy;
var
  Msg: TIdMessage;
  Recipient: TIdEmailAddressItem;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Recipient := Msg.BccList.Add;
  Recipient.Address := 'audit@example.invalid';
  Recipient.Name := 'Audit Archive';
end;
```

### Usage

`BccList` holds blind-copy recipients used by the default SMTP envelope while normal generated output deliberately suppresses the Bcc header.

### Additional Technical Info
`BccList` returns the live [`TIdEMailAddressList`](../../TIdEMailAddressList.md) owned by the message. Its items identify blind-copy recipients. The message creates/frees the list; scripts must not free it or retain returned items beyond the message/action lifetime.

Assigning another list calls `BccList.Assign(value)` and copies entries into the existing owned collection. It does not replace ownership. Direct `Add`, `Clear`, default-index and `EMailAddresses` operations mutate the live list. Nil assignment is not guarded.

#### Envelope and header are intentionally different

Indy's default SMTP `Send(message)` path copies Recipients, CCList and BccList into one envelope list and issues a recipient command for every entry. Bcc entries can therefore receive the message even though they are absent from visible message headers. Duplicates across the three lists are not deduplicated by this aggregation.

[`GenerateHeader`](../Methods/GenerateHeader.md) removes the generated `Bcc` value for normal sends and direct [`SaveToStream`](../Methods/SaveToStream.md). [`SaveToFile`](../Methods/SaveToFile.md) temporarily enables file mode and includes the encoded Bcc list in the saved header. A saved `.eml` can therefore disclose blind recipients; restrict access and redact before sharing it.

Suppression is not an absolute scrub: `ExtraHeaders` are appended later and may add a new `Bcc` line. Treat caller-supplied extra/raw headers as a separate disclosure surface.

[`NoEncode`](NoEncode.md) bypasses this suppression and writes raw Headers unchanged. If untrusted or previously loaded raw headers contain `Bcc`, setting NoEncode can expose them even when BccList itself is empty.

[`ProcessHeaders`](../Methods/ProcessHeaders.md) destructively parses raw `Bcc` into this list and MIME-decodes display names. Parsing/formatting is permissive and canonicalizing, not mailbox validation. [`ClearHeader`](../Methods/ClearHeader.md) clears the list.

The example uses a reserved `.invalid` address and was source-reviewed only; no SMTP operation occurred.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - owned list, parse and conditional header generation.
- [Indy upstream: `TIdSMTPBase.Send`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdSMTPBase.pas) - default envelope aggregation.
- [RFC 5322 section 3.6.3](https://www.rfc-editor.org/rfc/rfc5322#section-3.6.3) - destination fields and Bcc privacy models.
- [RFC 5321 section 3.3](https://www.rfc-editor.org/rfc/rfc5321#section-3.3) - SMTP envelope recipients are distinct from message headers.

<small>Created 2026-07-15</small>
