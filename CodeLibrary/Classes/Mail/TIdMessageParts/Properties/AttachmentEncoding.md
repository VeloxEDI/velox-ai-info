---
title: AttachmentEncoding
description: Selects a globally registered Indy message encoder by name, defaulting to MIME and rejecting unknown names before changing stored state.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message-parts, attachment-encoding, mime]
---

```Delphi
property AttachmentEncoding: string read write;
```

### Example

```Delphi
procedure UseMIMEAttachments(const Parts: TIdMessageParts);
begin
  Parts.AttachmentEncoding := 'MIME';
end;
```

### Usage

Set `AttachmentEncoding` to the encoder name that should be used when attachments are subsequently encoded. `MIME` is the normal default; an unknown name raises an error and leaves the previous selection unchanged.

Changing this property does not re-encode attachment parts that already exist. Treat the value as an encoder selection, not as arbitrary MIME header text.

### Additional Technical Info
`AttachmentEncoding` is the registry name of the Indy message encoder selected for attachments. A newly constructed collection sets this property to `MIME`, which resolves the matching encoder information from Indy's process-wide `TIdMessageEncoderList`.

The setter first calls `TIdMessageEncoderList.ByName(value)` and only then stores the string. An unknown or unregistered name raises `EIdException`; because lookup happens first, the previous encoder pointer and name remain in place. Use a name registered in the running Velox process rather than treating this as an arbitrary MIME transfer-encoding header.

Changing the property selects encoder metadata for later message encoding. It does not traverse, convert or immediately re-encode existing [`Items`](Items.md), and it does not refresh the cached part counts.

Registry lookup uses Indy's global string-list-backed encoder registry. That introduces shared process state; registration and selection should not be changed concurrently. The source-reviewed example selects the normal constructor default explicitly and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessageParts.SetAttachmentEncoding`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - lookup-before-store setter and constructor default.
- [Indy upstream: `TIdMessageEncoderList`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageCoder.pas) - encoder registry and `ByName` failure contract.
- [Embarcadero DocWiki: `System.Classes.TStringList`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList) - underlying Delphi list behavior.
- [Free Pascal: `TStringList`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.html) - compatible core list reference; Velox uses Delphi/Indy.

<small>Created 2026-07-15</small>
