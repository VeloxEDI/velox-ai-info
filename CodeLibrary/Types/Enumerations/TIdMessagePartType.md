---
title: TIdMessagePartType
description: Classifies an Indy message part as text or attachment from its runtime part class.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, mail, mime, part, attachment, text]
---

```Delphi
TIdMessagePartType = (mptText, mptAttachment)
```

### Example

```Delphi
procedure CountPart(Part: TIdMessagePart; var TextCount: Integer);
begin
  if Part.PartType = mptText then
    TextCount := TextCount + 1;
end;
```

### Usage

`TIdMessagePartType` classifies a Velox message part as text or attachment from its runtime part class.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| [`mptText`](../../Constants/Enumeration/mptText.md) | 0 | A `TIdText` part; included in the message-parts text count. |
| [`mptAttachment`](../../Constants/Enumeration/mptAttachment.md) | 1 | A base or attachment part; included in the attachment count. |

#### Behavior and boundaries

- A part with a `text/...` MIME Content-Type is not necessarily `mptText`; runtime class controls this enum result.
- A text part can still have a Content-ID and participate in a related MIME layout. `PartType` and related-part counting are separate.
- The base-class default is attachment, so custom subclasses are counted as attachments unless they override `PartType`.
- `CountParts` scans the current collection and derives counts; do not treat an earlier result as live after mutation.
- Velox POP/IMAP attachment download branches on `mptAttachment` and then uses the default decoder's `TIdAttachmentFile`; custom subclasses need their own safe cast/handling.
- Automatic download still requires a matching, nonempty filename. `mptAttachment` alone does not guarantee a saved file, while `mptText` parts are not auto-downloaded.

### Additional Technical Info
`TIdMessagePartType` is returned by the virtual class function `TIdMessagePart.PartType`. It is a runtime-class classification used by `TIdMessageParts.CountParts`; it is not inferred from `Content-Type`, a filename or `Content-Disposition`.

The base `TIdMessagePart` returns `mptAttachment`. `TIdText` overrides it with `mptText`, and `TIdAttachment` explicitly returns `mptAttachment`.

**Related Code Library entries**

- [TIdMessagePart.PartType](../../Classes/Mail/TIdMessagePart/Methods/PartType.md) - exact virtual dispatch and return behavior.
- [TIdMessageParts.CountParts](../../Classes/Mail/TIdMessageParts/Methods/CountParts.md) - derived text/attachment/related counts.
- [TIdMessagePart.ContentType](../../Classes/Mail/TIdMessagePart/Properties/ContentType.md) - separate MIME media-type metadata.

**External references**

- [RFC 2045 MIME](https://www.rfc-editor.org/rfc/rfc2045) - MIME content and transfer structure.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
