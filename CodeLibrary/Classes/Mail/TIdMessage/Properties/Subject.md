---
title: Subject
description: Stores decoded subject text for normal MIME-aware header generation while remaining separate from raw Headers in no-encode mode.
sidebar_position: 32
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, subject, header, mime, encoded-word]
---

```Delphi
property Subject: string read write;
```

### Example

```Delphi
procedure SetBusinessSubject(const DocumentNumber: String);
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.Subject := 'Invoice ' + DocumentNumber + ' ready for review';
end;
```

### Usage

Stores decoded subject text for normal MIME-aware header generation while remaining separate from raw Headers in no-encode mode.

### Additional Technical Info
`Subject` is the typed human-readable topic used for the normal generated `Subject` header. It is metadata, not body content, a routing guarantee or a trustworthy document identifier.

The property is a direct String field. Assignment does not immediately alter `Headers` or `LastGeneratedHeaders`. [`GenerateHeader`](../Methods/GenerateHeader.md) later passes Subject through Indy's MIME header encoder using the message's selected header encoding and charset. Non-ASCII text can become one or more RFC 2047 encoded-words, while ordinary safe ASCII can remain readable.

[`ProcessHeaders`](../Methods/ProcessHeaders.md) performs the reverse operation with `DecodeHeader`, so normally loaded Subject values are decoded display text rather than encoded-word syntax. This is intentionally different from [`Organization`](Organization.md), whose incoming value is copied raw.

#### State and output modes

[`ClearHeader`](../Methods/ClearHeader.md) and [`Clear`](../Methods/Clear.md) reset Subject to empty. Normal generation replaces or removes the generated field according to the current property. `ExtraHeaders` is appended after typed generation and permits duplicate Subject fields, so do not specify Subject through both paths.

[`NoEncode`](NoEncode.md) bypasses GenerateHeader. In that mode the serialized Subject comes from raw Headers, and changing this property has no effect. Conversely, editing raw Headers and then using normal generation can be overwritten by the typed property.

The setter has no explicit length or control-character validation. Validate external values, remove CR/LF, and apply a sensible operational limit before assignment. Subjects are widely logged, displayed in notifications and exposed to recipients; do not include secrets. They are attacker-controlled on incoming mail, so never authorize a process or select a file solely from Subject text.

Indy does not automatically add or remove `Re:`. Reply composition owns that policy, and repeated prefixes can reduce threading/display quality even though actual threading should use [`InReplyTo`](InReplyTo.md) and [`References`](References.md).

The example is source-reviewed only; no message was generated.

**External references**

- [Indy upstream: `TIdMessage`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - Subject clearing, encoding, decoding and generation order.
- [RFC 5322 section 3.6.5](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.5) - informational fields and reply-subject guidance.
- [RFC 2047](https://www.rfc-editor.org/rfc/rfc2047.html) - encoded-word representation used for non-ASCII header text.

<small>Created 2026-07-15</small>
