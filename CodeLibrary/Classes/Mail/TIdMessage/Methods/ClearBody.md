---
title: ClearBody
description: Destroys every owned MIME message part and then clears the separate preamble/body string list without changing header properties.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, clear-body, message-parts]
---

```Delphi
procedure ClearBody;
```

### Example

```Delphi
procedure RemoveMessageContent(const Message: TIdMessage);
begin
  Message.ClearBody;
end;
```

### Usage

`ClearBody` destroys every owned MIME message part and then clears the separate preamble/body string list without changing header properties.

### Additional Technical Info
`ClearBody` first calls [`MessageParts`](../Properties/MessageParts.md)`.Clear`, then calls [`Body`](../Properties/Body.md)`.Clear`. MessageParts owns its items, so all text parts and attachments are destroyed. Any borrowed part/body assumptions must be discarded; received temporary attachment cleanup can also occur during destruction.

The Body list is the message-level plain body or MIME preamble, not the collection of `TIdText` bodies. Clearing one without the other would not remove all message content, which is why this method clears both.

Header and configuration state is not changed. ContentType, ContentTransferEncoding, Encoding, raw Headers, recipients and MIMEBoundary can therefore describe content that no longer exists until the caller resets or regenerates them. Use [`Clear`](Clear.md) when both header and body state must be reset.

The message-parts cached AttachmentCount/TextPartCount fields are not maintained by `TCollection.Clear`; they can remain stale even though `Count=0`. Call `MessageParts.CountParts` before reading those properties, or rely on [`GenerateHeader`](GenerateHeader.md), which recounts first.

The two clears are non-transactional: a destruction exception can prevent Body from being cleared. Cost is proportional to part cleanup plus body size, and concurrent access is unsupported. The source-reviewed example was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessage.ClearBody`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - exact two-step implementation.
- [Embarcadero DocWiki: `System.Classes.TCollection.Clear`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.Clear) - owned item destruction.
- [Free Pascal: `TStrings.Clear`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.clear.html) - compatible list clearing context; Velox uses Delphi.

<small>Created 2026-07-15</small>
