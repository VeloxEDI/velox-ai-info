---
title: SaveToStream
description: Serializes headers and optional body/parts at the caller stream's current position without ownership or truncation, appending a dot terminator for full output.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, save, stream, serialization]
---

```Delphi
procedure SaveToStream(AStream: TStream;
  const AHeadersOnly: Boolean);
```

### Example

```Delphi
procedure SaveMessageStream(const Message: TIdMessage;
  const Destination: TStream);
begin
  Destination.Size := 0;
  Destination.Position := 0;
  Message.SaveToStream(Destination, False);
end;
```

### Usage

`SaveToStream` serializes headers and optional body/parts at the caller stream's current position without ownership or truncation, appending a dot terminator for full output.

### Additional Technical Info
`SaveToStream` wraps `AStream` as an Indy send stream, sets `FreeStreams=False`, serializes the message through `TIdMessageClient.SendMsg`, and frees only its temporary helper objects. The destination remains caller-owned and open.

Output begins at the current Position. The method neither seeks nor truncates. Reusing a longer seekable stream without clearing it can leave stale bytes after the newly written message; writing in the middle overwrites only the emitted range. Set Size/Position deliberately when replacement semantics are required, as shown in the example. That example assumes a resizable, seekable stream; fixed-size or forward-only streams can reject Size/Position access and must be prepared according to their own contract.

When NoEncode is false, SendMsg calls [`GenerateHeader`](GenerateHeader.md), writes generated headers and—unless headers-only—encodes Body and MessageParts. Header generation mutates Encoding, ContentType, boundaries, part transfer settings and generated-header state before/during output.

When NoEncode is true, SendMsg writes the raw registered-but-ungenerated Headers list, a blank separator and (for full output) the message-level Body through `WriteRFCStrings`. It does not serialize MessageParts. This branch is raw pass-through, not a guarantee that a previously decoded/edited message will retain all MIME content.

`AHeadersOnly=True` suppresses body/part output and the final marker, but normal header generation still runs unless NoEncode is true. With full output, the method appends a separate line containing `.` after SendMsg. That is SMTP/POP-style message termination rather than ordinary RFC 5322 content; [`LoadFromStream`](LoadFromStream.md) understands the framing.

Direct stream output uses normal generation mode, so Bcc is removed. [`SaveToFile`](SaveToFile.md) sets a private flag that includes Bcc before delegating here. Choose the route with that privacy difference in mind.

There is no method-level nil guard. The lower stream handler detects that no writable stream is connected and raises when the first nonempty write is attempted. Header generation may already have normalized the message before that failure. Require a real writable destination. Any write/encoding/attachment error can leave the stream partially changed and the message partly normalized; neither is rolled back.

Serialization is synchronous, potentially expensive and not thread-safe. The source-reviewed example establishes replacement position/size and passes the script-required Boolean; it was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessage.SaveToStream`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - borrowed-stream wrapper and final marker.
- [Indy upstream: `TIdMessageClient.SendMsg`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - NoEncode/generated and headers-only branches.
- [RFC 5321 section 4.5.2](https://www.rfc-editor.org/rfc/rfc5321.html#section-4.5.2) - dot transparency and termination.
- [Embarcadero DocWiki: `System.Classes.TStream.Position`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.Position) - current write position.
- [Embarcadero DocWiki: `System.Classes.TStream.Size`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.Size) - explicit truncation used by the example.
- [Free Pascal: `TStream`](https://www.freepascal.org/docs-html/rtl/classes/tstream.html) - compatible stream model context; Velox uses Delphi/Indy.

<small>Created 2026-07-15</small>
