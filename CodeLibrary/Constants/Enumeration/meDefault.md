---
title: meDefault
description: Defers an Indy mail message's whole-message layout choice until header generation examines its message parts.
sidebar_position: 164
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
  - layout
---

```Delphi
meDefault = 0
```

### Example

```Delphi
procedure ConfigureAutomaticLayout(Message: TIdMessage);
begin
  Message.Encoding := meDefault;

  { Add Body and MessageParts before the message is sent or saved. }
end;
```

### Usage

`meDefault` defers a Velox mail message's whole-message layout choice until header generation examines its message parts.

### Additional Technical Info
`meDefault` is the automatic member of [`TIdMessageEncoding`](../../Types/Enumerations/TIdMessageEncoding.md). It defers the choice between MIME and non-MIME layout until [`TIdMessage.GenerateHeader`](../../Classes/Mail/TIdMessage/Methods/GenerateHeader.md) counts the message parts.

Despite the property name, this is not a character encoding and does not select UTF-8, base64 or quoted-printable. The example is source-reviewed and is not executed by the documentation workflow.

**Automatic selection**

Immediately before output, header generation permanently resolves the value:

| `MessageParts.Count` | Resolved `Encoding` |
|---:|---|
| `0` | [`mePlainText`](mePlainText.md) |
| `1` or more | [`meMIME`](meMIME.md) |

Any part triggers MIME, including a text part. The property setter runs during resolution, so it also changes [`AttachmentEncoding`](../../Classes/Mail/TIdMessage/Properties/AttachmentEncoding.md). Reading `Encoding` after generation returns the resolved member, not `meDefault`; adding or removing parts later does not restore automatic mode.

**Assignment side effect**

Assigning `Message.Encoding := meDefault` first stores the enum and then sets `AttachmentEncoding` to `UUE`, because the setter treats every non-`meMIME` value as the legacy plain-layout default. If parts exist when headers are generated, the later resolution to `meMIME` changes attachment encoding again to `MIME`.

Set an intentional attachment-encoder override after setting `Encoding`. Encoder registry lookup can raise after the enum field has already changed, leaving partially updated state.

**Construction, clearing and reuse**

New messages and `ClearHeader` set the internal field to `meDefault` directly. That direct assignment bypasses the property setter. In particular, clearing a reused message can show `Encoding = meDefault` while retaining a previous `AttachmentEncoding` value. Reset both properties explicitly when object reuse must reproduce new-message defaults.

**Header-generation mutations**

Automatic resolution is only one of several mutations performed by header generation. Depending on the selected layout it can also normalize part transfer encodings, clear an incompatible whole-body transfer encoding, infer `ContentType`, regenerate MIME boundaries and update single-part MIME state. Do not treat sending or saving as serialization of an otherwise unchanged object.

**Input behavior**

Received messages never resolve to `meDefault`. `ProcessHeaders` chooses `mePlainText` when the raw `MIME-Version` header is absent and `meMIME` when it is present. It does not infer the automatic state from parts, boundary, content type or transfer encoding.

**Errors and side effects**

The constant itself does not raise. Assigning it can fail while selecting the `UUE` attachment encoder. Later generation can fail in header, charset, part or encoder processing after mutating message state.

**Performance and concurrency**

Reading the enum is constant-time, but resolving it occurs during a stateful full header/part preparation pass. Do not generate, send, save or mutate one `TIdMessage` concurrently.

**When to use it**

Use `meDefault` when the final part collection is known before output and Indy's simple zero-parts/has-parts decision is appropriate. Choose `meMIME` explicitly for modern multipart, alternative-body or attachment messages. Avoid relying on automatic `mePlainText` when legacy UUE output is not acceptable.

**Related entries**

- [`meMIME`](meMIME.md) selects MIME layout explicitly.
- [`mePlainText`](mePlainText.md) selects the non-MIME/legacy layout explicitly.
- [`TIdMessage.Encoding`](../../Classes/Mail/TIdMessage/Properties/Encoding.md) documents property mutation and receive behavior.
- [`TIdMessage.ClearHeader`](../../Classes/Mail/TIdMessage/Methods/ClearHeader.md) resets the field directly.

**External references**

- [RFC 2045, MIME-Version](https://www.rfc-editor.org/rfc/rfc2045.html#section-4)
- [RFC 2046, MIME media types](https://www.rfc-editor.org/rfc/rfc2046.html)
- [Indy `IdMessage.pas` upstream source](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - compatibility reference; Velox's compiled modified source is authoritative.

<small>Created 2026-07-15</small>
