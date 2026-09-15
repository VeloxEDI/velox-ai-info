---
title: ContentTransferEncoding
description: Selects or reports the message-level transfer label, with base64/quoted-printable body encoding and part-related normalization performed only later.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, content-transfer-encoding, base64, quoted-printable]
---

```Delphi
property ContentTransferEncoding: string read write;
```

### Example

```Delphi
procedure ConfigureQuotedPrintableBody;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.Encoding := mePlainText;
  Msg.ContentType := 'text/plain';
  Msg.CharSet := 'utf-8';
  Msg.ContentTransferEncoding := 'quoted-printable';
end;
```

### Usage

`ContentTransferEncoding` selects or reports the message-level transfer label, with base64/quoted-printable body encoding and part-related normalization performed only later.

### Additional Technical Info
`ContentTransferEncoding` is the message-level transfer-encoding value parsed from or generated into `Content-Transfer-Encoding`. Assignment stores the String verbatim. Validation and actual encoding are deferred until generation/body output.

For a non-single-part message with no [`MessageParts`](MessageParts.md), values whose first header token is `base64` or `quoted-printable` make normal full output encode the entire [`Body`](Body.md) using the current [`CharSet`](CharSet.md). Other values normally leave Body on the line-writing path while still labeling the header, so an unsupported/mismatched value can create invalid or misleading output.

#### Interaction with parts and layout

[`GenerateHeader`](../Methods/GenerateHeader.md) recounts parts. If at least one exists and this property is nonempty but not `7bit`, `8bit` or `binary`, it clears the property permanently because Indy cannot wrap a multipart body in base64/quoted-printable. Individual parts keep their own `ContentTransfer` values and are encoded separately.

For calculated single-part MIME, the message-level generated header is removed and the one part supplies its transfer header. For other MIME and plain layouts, the surviving typed value is projected into the message header.

[`ProcessHeaders`](../Methods/ProcessHeaders.md) copies the raw value into this field. Receive logic recognizes standard values, applies MIME restrictions, and can fall back to treating unknown transfer types as 8-bit/application data. It may decode content into Body or MessageParts, so the typed label is not evidence that Body still contains encoded wire text; [`NoDecode`](NoDecode.md) is the explicit bypass.

[`NoEncode`](NoEncode.md) ignores this property and writes raw Headers/Body. The example is source-reviewed only; no encoder ran.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - parsing, generation and part compatibility normalization.
- [Indy upstream: `TIdMessageClient.SendBody`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - body encoder selection.
- [RFC 2045 section 6](https://www.rfc-editor.org/rfc/rfc2045#section-6) - Content-Transfer-Encoding rules.
- [RFC 2045 section 6.4](https://www.rfc-editor.org/rfc/rfc2045#section-6.4) - multipart restrictions.

<small>Created 2026-07-15</small>
