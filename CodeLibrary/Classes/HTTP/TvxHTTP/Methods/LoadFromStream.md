---
title: LoadFromStream
description: Copies an entire source stream from position zero into the pending request stream at its current position without clearing or truncating existing content.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, stream, request-body, position, quirk]
---

```Delphi
procedure LoadFromStream(const aStream: TStream);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var Body: TMemoryStream;
begin
  Body := TMemoryStream.Create;
  try
    StringToStreamUTF8('{"status":"ok"}', Body);
    Http.Content.Clear;
    Http.LoadFromStream(Body);
    Http.Header['Content-Type'] := 'application/json';
    Http.Put('https://api.example.invalid/resources/example-123');
    Value := Http.Response.ResponseCode;
  finally
    Body.Free;
  end;
end;
```

### Usage

`LoadFromStream` copies an entire source stream from position zero into the pending request stream at its current position without clearing or truncating existing content.

### Additional Technical Info
`LoadFromStream` is not a replacement operation. For a nonempty source it sets `aStream.Position := 0`, then calls `FContent.CopyFrom(aStream, aStream.Size)` at the pending [`Content`](../Properties/Content.md) stream's **current** position. It neither clears nor truncates the destination.

Consequences:

- an empty source returns immediately and preserves all prior pending content;
- a normally end-positioned destination receives the source as an append;
- a destination positioned inside existing content is overwritten from that point, but any longer old tail remains;
- the source is left at its end after a successful copy; and
- `nil`, non-seekable or inaccurate-size streams can raise before/during copying.

Clear the pending stream explicitly, as in the example, when replacement is intended. This differs from [`LoadFromBytes`](LoadFromBytes.md) and [`LoadFromFile`](LoadFromFile.md), both of which clear after reaching their respective write/open stages.

The source remains caller-owned and is not freed. A copy error can leave partial destination content and a partially consumed source. The complete source is duplicated in memory.

Body-capable HTTP methods later ask Indy to send the complete pending stream; Indy rewinds it for writing. The request `finally` normally clears the destination after use, but an early authentication preflight exit can preserve it. No media type or content coding is inferred.

**External references**

- [Embarcadero DocWiki: `TStream.CopyFrom`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.CopyFrom)
- [Embarcadero DocWiki: `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Position)
- [Free Pascal: `TStream.CopyFrom`](https://www.freepascal.org/docs-html/rtl/classes/tstream.copyfrom.html)
- [Free Pascal: `TStream.Position`](https://www.freepascal.org/docs-html/rtl/classes/tstream.position.html)

<small>Created 2026-07-15</small>
