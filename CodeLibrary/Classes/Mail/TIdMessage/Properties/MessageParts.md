---
title: MessageParts
description: Returns the live message-owned collection of MIME text and attachment parts whose items can be created, reordered, normalized and destroyed in place.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, mime, parts, attachments, ownership]
---

```Delphi
property MessageParts: TIdMessageParts read;
```

### Example

```Delphi
procedure ReportPartCount(var Value: Variant);
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Value := Msg.MessageParts.Count;
end;
```

### Usage

`MessageParts` returns the live message-owned collection of MIME text and attachment parts whose items can be created, reordered, normalised and destroyed in place.

### Additional Technical Info
`MessageParts` returns the live [`TIdMessageParts`](../../TIdMessageParts.md) collection created and owned by the message. The property reference is read-only, but the returned collection and its items are mutable. Do not free the collection, and do not retain it or any item beyond the owning message/action lifetime.

The collection represents MIME text parts, file/stream attachments and multipart markers. Use the documented concrete classes such as [`TIdText`](../../TIdText.md) and [`TIdAttachmentFile`](../../TIdAttachmentFile.md) to add items with this collection as owner. Calling the collection's inherited-looking `Add` is a trap: its override deliberately returns nil rather than creating an abstract base part.

#### Mutation and cached metadata

Adding, deleting or editing an item changes the live message immediately. `AttachmentCount` and `TextPartCount` are cached classifications, not continuously maintained values; call `CountParts` before depending on them. [`GenerateHeader`](../Methods/GenerateHeader.md) recounts automatically, then may normalize each part's transfer encoding, infer message content type and regenerate boundaries.

Full normal output can also mutate parts by filling empty attachment content fields. With [`ConvertPreamble`](ConvertPreamble.md) true, it can permanently append a new text part copied from Body. These side effects mean repeated save/send operations on the same message can produce different state or output.

#### Clearing, loading and temporary files

[`ClearBody`](../Methods/ClearBody.md) calls `MessageParts.Clear` before clearing Body. Destruction of collection items closes their resources and can delete decoded temporary attachment files. [`LoadFromStream`](../Methods/LoadFromStream.md) is clear-first and then repopulates this same owned collection unless [`NoDecode`](NoDecode.md) suppresses MIME decoding.

Do not modify the collection while it is being generated, sent, saved, cleared or destroyed. Validate untrusted message sizes and part counts before expensive downstream processing. The example is a source-reviewed observation only and did not parse or send mail.

**External references**

- [Indy upstream: `IdMessageParts.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - collection ownership, nil `Add` and cached counts.
- [Indy upstream: `IdMessageClient.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - parsing and serialization side effects.
- [Embarcadero DocWiki: `System.Classes.TOwnedCollection`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TOwnedCollection) - Delphi ownership base.
- [Free Pascal: `TOwnedCollection`](https://www.freepascal.org/docs-html/rtl/classes/townedcollection.html) - compatible collection reference; Velox uses Delphi/Indy.
- [RFC 2046, multipart media type](https://www.rfc-editor.org/rfc/rfc2046#section-5.1) - MIME multipart model.

<small>Created 2026-07-15</small>
