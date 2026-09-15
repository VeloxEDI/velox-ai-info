---
title: TIdMessageEncoding
description: Controls whole-message plain-text or MIME layout and Indy's automatic choice for a mail message.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, mail, mime, encoding, indy]
---

```Delphi
TIdMessageEncoding = (meDefault, meMIME, mePlainText)
```

### Example

```Delphi
procedure ConfigureMessageLayout(Message: TIdMessage);
begin
  Message.Encoding := meMIME;
end;
```

### Usage

`TIdMessageEncoding` controls whole-message plain-text or MIME layout and Velox's automatic choice for a mail message.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| [`meDefault`](../../Constants/Enumeration/meDefault.md) | 0 | Let header generation choose plain text when there are no parts or MIME when parts exist. |
| [`meMIME`](../../Constants/Enumeration/meMIME.md) | 1 | Generate MIME layout and set the message-parts attachment encoding to `MIME`. |
| [`mePlainText`](../../Constants/Enumeration/mePlainText.md) | 2 | Generate non-MIME/plain layout and set attachment encoding to legacy `UUE` unless later overridden. |

#### Behavior and boundaries

- Assigning any value other than `meMIME`, including `meDefault`, immediately sets `AttachmentEncoding` to `UUE`; automatic generation can later change the layout.
- Encoder lookup can raise after the enum field has been stored, leaving partially updated message state.
- `ClearHeader` restores this property to `meDefault` but does not reset `AttachmentEncoding`; a reused message can therefore show `meDefault` while retaining a previous encoder selection.
- When parts exist, unsupported part transfer encodings are normalized: MIME falls back to base64, while plain-text layout falls back to UUE.
- With message parts present, a non-7bit/8bit/binary whole-body transfer encoding is cleared because attachments in an encoded body are unsupported.
- On input, absence of `MIME-Version` selects `mePlainText`; its presence selects `meMIME`. The parser does not restore `meDefault`.
- Use `CharSet`, `ContentTransferEncoding` and part `ContentTransfer` for representation details; do not overload this enum with those decisions.

### Additional Technical Info
`TIdMessageEncoding` selects the message-level layout used by `TIdMessage`. Despite the name, it is not a character set and is not the per-body or per-part `Content-Transfer-Encoding`.

`meDefault` is stateful automatic selection during header generation: no message parts changes the message to `mePlainText`; any message part changes it to `meMIME`. The property no longer remains `meDefault` after that decision.

**Related Code Library entries**

- [TIdMessage.Encoding](../../Classes/Mail/TIdMessage/Properties/Encoding.md) - exact mutation and generation behavior.
- [TIdMessage.ContentTransferEncoding](../../Classes/Mail/TIdMessage/Properties/ContentTransferEncoding.md) - whole-body transfer encoding.
- [TIdMessagePart.ContentTransfer](../../Classes/Mail/TIdMessagePart/Properties/ContentTransfer.md) - per-part transfer encoding.

**External references**

- [RFC 2045 MIME format](https://www.rfc-editor.org/rfc/rfc2045) - MIME message and content-transfer framework.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal and enumeration semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration and ordinal concepts.

<small>Created 2026-07-15</small>
