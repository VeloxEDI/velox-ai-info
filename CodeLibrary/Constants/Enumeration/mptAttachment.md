---
title: mptAttachment
description: Classifies an Indy message part as a base or attachment runtime class for counting and Velox file-download handling.
sidebar_position: 179
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, indy, attachment, message-part]
---

```Delphi
mptAttachment = 1
```

### Example

```Delphi
procedure InspectPart(Part: TIdMessagePart; var IsAttachment: Boolean);
begin
  IsAttachment := Part.PartType = mptAttachment;
end;
```

### Usage

`mptAttachment` classifies a Velox message part as a base or attachment runtime class for counting and Velox file-download handling.

### Additional Technical Info
`mptAttachment` is the attachment result of the virtual [`TIdMessagePart.PartType`](../../Classes/Mail/TIdMessagePart/Methods/PartType.md) method. `TIdAttachment` returns it explicitly; the base class also returns it, so custom descendants are classified as attachments unless they override the method.

The result is based on runtime class behavior, not `Content-Type`, filename or `Content-Disposition`. The example is source-reviewed and is not executed by the documentation workflow.

**Counting and structure**

[`TIdMessageParts.CountParts`](../../Classes/Mail/TIdMessageParts/Methods/CountParts.md) rescans the collection and increments its cached AttachmentCount for this result. A Content-ID independently increments RelatedPartCount, so one item can be both an attachment-class part and related content. Counts remain stale after collection mutation until another scan.

**Velox POP/IMAP behavior**

The automatic email-receive loops select only parts returning `mptAttachment`, then cast them to `TIdAttachmentFile`. That cast matches Indy's default receive behavior: without a custom attachment factory, the decoder creates file-backed attachments, and Velox does not install a custom factory.

After classification Velox still requires a matching configured filename pattern and a nonempty filename before saving. Unnamed inline/signature parts are skipped. Therefore `mptAttachment` means eligible runtime class, not that Velox will create an output file.

Custom code must not assume every custom subclass returning this value is `TIdAttachmentFile`; test/know the concrete class before a downcast. A part labelled `text/plain` can still return Attachment.

**Side effects, errors and performance**

Reading PartType is constant-time and has no I/O or mutation. Later casts, filename processing, attachment streams and file saves can fail. The borrowed part becomes invalid if its owning collection/message is destroyed; do not mutate the collection concurrently while iterating.

**Related entries**

- [`mptText`](mptText.md) identifies `TIdText` runtime parts.
- [`TIdMessagePartType`](../../Types/Enumerations/TIdMessagePartType.md) defines both results.
- [`TIdMessageParts.AttachmentCount`](../../Classes/Mail/TIdMessageParts/Properties/AttachmentCount.md) exposes the cached count.

**External references**

- [RFC 2045 MIME body parts](https://www.rfc-editor.org/rfc/rfc2045.html)
- [RFC 2046 media types](https://www.rfc-editor.org/rfc/rfc2046.html)

<small>Created 2026-07-15</small>
