---
title: Organization
description: Stores the optional Organization header value, including an encode-on-write but raw-on-read asymmetry for non-ASCII text.
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, organization, header, mime, encoded-word]
---

```Delphi
property Organization: string read write;
```

### Example

```Delphi
procedure SetOriginatingOrganization;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.Organization := 'Velox EDI Limited';
end;
```

### Usage

Stores the optional Organization header value, including an encode-on-write but raw-on-read asymmetry for non-ASCII text.

### Additional Technical Info
`Organization` stores the optional, nonstandard `Organization` message header value. It is informational; it does not select an account, sender, SMTP server, tenant, certificate or authorization context.

The property is a direct String field. Assignment performs no length, control-character, trust or business validation. [`ClearHeader`](../Methods/ClearHeader.md) and [`Clear`](../Methods/Clear.md) reset it to empty.

#### Normal output

[`GenerateHeader`](../Methods/GenerateHeader.md) passes Organization through the same MIME header encoder used for [`Subject`](Subject.md), using the message's header encoding and charset settings. Non-ASCII text can therefore become RFC 2047 encoded-words in the generated `Organization` field. An empty value removes the generated field.

[`NoEncode`](NoEncode.md) bypasses this projection. In raw mode, changing Organization does not change the saved or transmitted header; edit `Headers` instead or return to normal generation.

#### Important load asymmetry

[`ProcessHeaders`](../Methods/ProcessHeaders.md) assigns `Headers.Values['Organization']` directly. Unlike Subject, it does not call `DecodeHeader`. A message generated from `Café Operations` can be loaded with Organization containing the literal encoded-word form such as `=?...?=` rather than the original display text.

This asymmetry matters in forwarding and round trips:

- display code should not assume a loaded value is already decoded;
- blindly setting the encoded form on a normally generated message can encode it again;
- comparisons against plain organization names can fail;
- a raw copied header and the typed field can diverge.

Use ASCII when interoperability is more important than localized display, or deliberately decode and normalize externally before business comparisons. Treat incoming Organization as untrusted descriptive text. Do not use it as evidence of sender identity.

`ExtraHeaders` is appended after the typed value and permits duplicates, so avoid supplying Organization through both mechanisms.

The example is source-reviewed only; no message was generated.

**External references**

- [Indy upstream: `TIdMessage`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - encoded generation and direct raw parsing.
- [RFC 2047](https://www.rfc-editor.org/rfc/rfc2047.html) - encoded-word representation for non-ASCII header text.
- [RFC 5322 section 3.6.8](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.8) - optional field syntax used for extension headers.

<small>Created 2026-07-15</small>
