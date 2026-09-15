---
title: meMIME
description: Selects Indy's MIME message layout with MIME headers, boundaries and encoded message parts.
sidebar_position: 165
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - constant
  - mail
  - indy
  - mime
  - multipart
  - attachment
---

```Delphi
meMIME = 1
```

### Example

```Delphi
procedure ConfigureMIMELayout(Message: TIdMessage);
begin
  Message.Encoding := meMIME;
  Message.CharSet := 'utf-8';

  { Add the required text and attachment MessageParts next. }
end;
```

### Usage

`meMIME` selects Velox's MIME message layout with MIME headers, boundaries and encoded message parts.

### Additional Technical Info
`meMIME` is the [`TIdMessageEncoding`](../../Types/Enumerations/TIdMessageEncoding.md) member for MIME message layout. It controls how Indy organizes the whole message; [`CharSet`](../../Classes/Mail/TIdMessage/Properties/CharSet.md), whole-body [`ContentTransferEncoding`](../../Classes/Mail/TIdMessage/Properties/ContentTransferEncoding.md) and each part's transfer encoding remain separate decisions.

The example selects MIME layout and a character set before parts are built. It is source-reviewed and is not executed by the documentation workflow.

**Assignment side effect**

Setting `Encoding := meMIME` stores the enum and immediately sets [`AttachmentEncoding`](../../Classes/Mail/TIdMessage/Properties/AttachmentEncoding.md) to `MIME`. This can overwrite an earlier attachment-encoder choice. Set a deliberate override afterwards.

Encoder lookup can raise after the enum has already been stored, so a failed assignment can leave `Encoding = meMIME` with attachment state only partly updated.

**Header generation**

For MIME layout, `GenerateHeader` performs stateful preparation that includes:

- clearing the boundary stack and generating a new top-level MIME boundary;
- inferring `ContentType` when it is blank;
- initializing message-part headers through the selected message encoder;
- setting `MIME-Version: 1.0` on MIME output paths;
- detecting the special one-part MIME case; and
- normalizing nonempty, unrecognized part transfer values to `base64`.

The recognized part transfer values are `7bit`, `8bit`, `binary`, `base64`, `quoted-printable` and `binhex40`. Generation also clears a nonempty whole-body transfer value other than `7bit`, `8bit` or `binary` when message parts exist, because this implementation does not support attachments inside an encoded whole body.

**Content-type inference**

When `ContentType` is blank, current Indy source infers:

| Parts summary | Inferred content type |
|---|---|
| More than one text part, with attachments | `multipart/mixed` |
| More than one text part, no attachments | `multipart/alternative` |
| Zero or one text part, with attachments | `multipart/mixed` |
| Zero or one text part, no attachments | `text/plain` |

This is a structural heuristic, not semantic validation of the parts. Set `ContentType` and parent relationships deliberately for nested or specialized MIME structures.

**Single-part MIME and Body**

Indy marks a message as single-part MIME only when `Encoding = meMIME`, there is exactly one message part and `Body` is empty under its whitespace-only test. That path lets the part supply the message-level content headers. Otherwise Body can serve as a MIME preamble or be converted into a text part according to `ConvertPreamble` and the generation path.

**Input behavior**

`ProcessHeaders` selects `meMIME` solely when `MIME-Version` is present. A boundary or MIME-looking `Content-Type` without that header still selects `mePlainText`; conversely the header selects MIME even when the structure is incomplete. Changing `Encoding` after loading does not reparse Body or MessageParts.

**Errors and interoperability**

Header/part/charset encoder lookup, malformed part relationships, I/O and transport can fail after generation has mutated the message. MIME improves modern interoperability but does not by itself guarantee a valid multipart tree, correct charset, safe filenames or accepted attachment size.

**Performance and concurrency**

Generation walks and can mutate all parts and allocates a fresh boundary. Sending large encoded attachments adds stream/encoding cost. Do not generate or mutate the same message concurrently.

**Related entries**

- [`meDefault`](meDefault.md) selects MIME automatically whenever any part exists.
- [`mePlainText`](mePlainText.md) writes a non-MIME body plus optional legacy attachments.
- [`TIdMessage.MIMEBoundary`](../../Classes/Mail/TIdMessage/Properties/MIMEBoundary.md) exposes the regenerated boundary stack.
- [`TIdMessage.Encoding`](../../Classes/Mail/TIdMessage/Properties/Encoding.md) documents the complete property contract.

**External references**

- [RFC 2045, Internet message bodies and transfer encodings](https://www.rfc-editor.org/rfc/rfc2045.html)
- [RFC 2046, multipart media type](https://www.rfc-editor.org/rfc/rfc2046.html#section-5.1)
- [Indy `IdMessage.pas` upstream source](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - compatibility reference; Velox's compiled modified source is authoritative.
- [Indy `IdMessageClient.pas` upstream source](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - MIME body writer compatibility reference.

<small>Created 2026-07-15</small>
