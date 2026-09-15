---
title: AttachmentEncoding
description: Selects the message-parts encoder registry entry used for attachment layout, with Encoding assignments able to overwrite the selection.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, attachment, encoding, mime, uue]
---

```Delphi
property AttachmentEncoding: string read write;
```

### Example

```Delphi
procedure UseMIMEAttachmentEncoding;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.Encoding := meMIME;
  Msg.AttachmentEncoding := 'MIME';
end;
```

### Usage

`AttachmentEncoding` selects the message-parts encoder registry entry used for attachment layout, with Encoding assignments able to overwrite the selection.

### Additional Technical Info
`AttachmentEncoding` is a forwarding property over the `AttachmentEncoding` property of [`MessageParts`](MessageParts.md); the message does not keep a second attachment-encoding value. Reading it returns the selected Indy message-encoder registry name. A new parts collection initially selects `MIME`.

Assignment performs a process-wide encoder-registry lookup before storing the name. Unknown or unregistered values raise `EIdException`, and lookup-before-store leaves the previous encoder selection intact. This property is therefore not an arbitrary `Content-Transfer-Encoding` header.

#### Interaction with Encoding

Assigning [`Encoding`](Encoding.md) also assigns this property:

- `meMIME` selects `MIME`;
- `meDefault` or `mePlainText` selects `UUE`.

Set `Encoding` first and apply a deliberate attachment override afterwards. During plain-text layout, an attachment with an empty `ContentTransfer` uses this preference only when it is `UUE` or `XXE`; otherwise that path falls back to `UUE`. MIME output normally defaults an attachment's empty transfer encoding to `base64` while it writes the part.

Changing this property selects encoder metadata for later generation. It does not traverse or re-encode existing parts, refresh cached part counts, or update each part's `ContentTransfer`. [`GenerateHeader`](../Methods/GenerateHeader.md) and send/save processing can subsequently normalize or fill part encodings.

The registry and message are shared mutable state without script-level synchronization. Configure the message before another operation starts serializing it. The example is source-reviewed only and was not sent or executed.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - forwarding property and `Encoding` coupling.
- [Indy upstream: `IdMessageParts.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - registry lookup and selected encoder storage.
- [RFC 2045, Content-Transfer-Encoding](https://www.rfc-editor.org/rfc/rfc2045#section-6) - wire-level transfer encodings, which are distinct from this registry selector.

<small>Created 2026-07-15</small>
