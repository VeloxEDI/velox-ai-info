---
title: LoadFromStream
description: Clears the message and parses headers plus optional body/MIME parts from the caller stream's current position without owning or rewinding it.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, load, stream, parser]
---

```Delphi
procedure LoadFromStream(AStream: TStream;
  const AHeadersOnly: Boolean);
```

### Example

```Delphi
procedure LoadMessageStream(const Message: TIdMessage;
  const Source: TStream);
begin
  Source.Position := 0;
  Message.LoadFromStream(Source, False);
end;
```

### Usage

`LoadFromStream` clears the message and parses headers plus optional body/MIME parts from the caller stream's current position without owning or rewinding it.

### Additional Technical Info
`LoadFromStream` immediately calls [`Clear`](Clear.md), creates a temporary `TIdMessageClient`, and parses from `AStream`. The adapter sets `FreeStreams=False`: the stream is borrowed, remains open, and is the caller's responsibility.

Parsing begins at the stream's current Position. The method does not seek to zero or restore the original position. It reads in buffered chunks (up to 32 KiB at the stream-adapter layer), so headers-only parsing can advance the underlying Position beyond the logical blank-line boundary; unread bytes already buffered by the temporary adapter are not returned to the caller. Do not use the final Position as a precise body offset.

Headers are appended to the registered-but-ungenerated raw Headers list and always passed through [`ProcessHeaders`](ProcessHeaders.md). `AHeadersOnly=True` then skips ReceiveBody, leaving Body and MessageParts empty. False parses/decodes the body, MIME parts and attachments according to ContentType, transfer encoding, charset, boundaries, NoDecode and registered decoder behavior.

The message-stream adapter synthesizes a proper dot terminator after source EOF, adding missing CR/LF as needed. Conversely, Indy's RFC-line reader treats an actual unescaped line containing only `.` as message termination. A plain RFC 5322 file with such a body line can therefore stop early unless transport dot transparency has escaped it.

NoDecode and AttachmentTempDirectory survive the initial Clear and deliberately affect loading. NoDecode retains raw body handling; AttachmentTempDirectory controls received file-backed attachment storage. Other retained fields documented by Clear can also survive an otherwise replacement-style load.

There is no method-level nil guard, but the lower stream handler detects that no readable source is connected and raises before parsing a line. Because `Clear` has already run, a nil call still destroys the previous message. Pass a real readable stream and check it before the call.

The old message is already cleared when allocation, I/O, header conversion, decoding or attachment creation fails. The stream can be advanced and the new message partially populated; there is no rollback. Parsing is synchronous, potentially memory/disk intensive, and not thread-safe.

The source-reviewed example explicitly seeks because this method does not, passes the script-required Boolean, and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessage.LoadFromStream`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - clear/delegate/cleanup implementation.
- [Indy upstream: `TIdMessageClient.ProcessMessage`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - stream adapter, header/body and EOF framing behavior.
- [RFC 5321 section 4.5.2](https://www.rfc-editor.org/rfc/rfc5321.html#section-4.5.2) - dot transparency and end-of-mail framing.
- [Embarcadero DocWiki: `System.Classes.TStream.Position`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.Position) - caller-controlled stream position.
- [Free Pascal: `TStream.Position`](https://www.freepascal.org/docs-html/rtl/classes/tstream.position.html) - compatible stream-position context; Velox uses Delphi/Indy.

<small>Created 2026-07-15</small>
