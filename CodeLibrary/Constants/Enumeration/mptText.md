---
title: mptText
description: Classifies an Indy message part as a TIdText runtime object for text counting and script body handling.
sidebar_position: 180
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, indy, text, message-part]
---

```Delphi
mptText = 0
```

### Example

```Delphi
procedure InspectTextPart(Part: TIdMessagePart; var IsPlainText: Boolean);
begin
  IsPlainText :=
    (Part.PartType = mptText) and
    (Part.ContentType = 'text/plain');
end;
```

### Usage

`mptText` classifies a Velox message part as a TIdText runtime object for text counting and script body handling.

### Additional Technical Info
`mptText` is returned by `TIdText.PartType`. It identifies the concrete text-part class and allows code to use `TIdText.Body` after an appropriate cast. It is not inferred from MIME `Content-Type`.

The example checks the runtime classification before applying a separate media-type rule. It is source-reviewed and is not executed by the documentation workflow.

**Class versus headers**

- A `TIdText` still returns `mptText` if its ContentType is blank or misleading.
- An attachment labelled `text/plain` still returns [`mptAttachment`](mptAttachment.md).
- Content-ID/related membership is independent; a text part with Content-ID contributes to both cached TextPartCount and RelatedPartCount.
- Custom descendants must override PartType to join the text classification; the base default is Attachment.

This distinction matters for safe casts and for message layout. Check PartType before treating a part as `TIdText`, then inspect ContentType/CharSet/ContentTransfer to decide how to interpret its body.

**Counting and Velox behavior**

`TIdMessageParts.CountParts` increments its cached TextPartCount for each current item returning this value. The count is a snapshot from the last scan rather than a live collection invariant.

Velox POP/IMAP automatic attachment download ignores `mptText` parts. Generated custom-script guidance handles them separately and distinguishes `text/plain` from `text/html`. Text bodies needed by a flow must therefore be handled in script or message-level processing rather than expected as downloaded attachment files.

**Side effects, errors and performance**

PartType is constant-time and side-effect free. Body interpretation or conversion can still fail because of malformed transfer data or charset metadata. Keep the owner alive and do not mutate the collection concurrently during iteration.

**Related entries**

- [`mptAttachment`](mptAttachment.md) identifies attachment/base runtime parts.
- [`TIdText`](../../Classes/Mail/TIdText.md) documents the text class.
- [`TIdMessageParts.TextPartCount`](../../Classes/Mail/TIdMessageParts/Properties/TextPartCount.md) exposes the cached count.

**External references**

- [RFC 2045 MIME body parts](https://www.rfc-editor.org/rfc/rfc2045.html)
- [RFC 2046 text media type](https://www.rfc-editor.org/rfc/rfc2046.html#section-4.1)

<small>Created 2026-07-15</small>
