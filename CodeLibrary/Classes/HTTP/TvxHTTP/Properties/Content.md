---
title: Content
description: Exposes the client-owned request-body memory stream and copies assigned streams into that retained one-shot buffer.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, body, stream]
---

```Delphi
property Content: TMemoryStream read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamUTF8('{"reference":"DEMO-1001"}', Buffer);
    Http.Content := Buffer;  // Copies the bytes; Http does not take ownership.
  finally
    Buffer.Free;
  end;

  Http.Header['Content-Type'] := 'application/json; charset=utf-8';
  Http.Post('https://api.example.invalid/v1/messages');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`Content` exposes the client-owned request-body memory stream and copies assigned streams into that retained one-shot buffer.

### Additional Technical Info
`Content` is the retained request-body buffer owned by the [`TVxHTTP`](../../TvxHTTP.md) client. A newly created client contains an empty `TMemoryStream`. Reading the property returns that same live stream; assigning another stream copies bytes into it rather than replacing the object or transferring ownership.

The setter first clears the internal stream, returns for a zero-sized source, otherwise rewinds the source and copies exactly `aValue.Size` bytes. The source and internal stream are both left at their ends after a non-empty copy. A caller can free an independently supplied source after assignment, as in the example. Do not free the stream returned by `Http.Content`; the HTTP client frees it.

The setter is not safe for `nil` or self-assignment. `Http.Content := nil` clears the queued body and then raises while reading the nil source. `Http.Content := Http.Content` clears the shared object before measuring it and therefore silently leaves an empty body. To inspect or edit the live buffer, use the returned stream directly; to copy it, use a distinct stream.

[`Put`](../Methods/Put.md), [`Post`](../Methods/Post.md), [`Patch`](../Methods/Patch.md) and [`CustomRequest`](../Methods/CustomRequest.md) can pass a non-empty body to Indy. Other built-in verbs ignore the queued body, but normal terminal cleanup still clears it. Indy derives `Content-Length` from the complete stream `Size` and rewinds the source before writing, so the current `Position` does not limit the transmitted range.

The buffer is normally one-shot. After control reaches the actual HTTP operation, a `finally` block clears it on success or exception and disconnects. A failure or early return before that block—for example during proxy, SSL or authentication preparation—can leave the body queued for a later call. The native class's `Clear` method is not registered for scripts and does not clear `Content` in any case. Call [`Http.Content.Clear`](../../../Stream/TMemoryStream/Methods/Clear.md) explicitly when abandoning a prepared body.

No content type or character set is inferred from the bytes. Set [`Header`](Header.md)`['Content-Type']` to match the payload. The content and headers run with Velox process network authority, and raw request logging can capture both, so do not place unapproved secrets or personal data in the buffer.

For text bodies, the `ContentAs...` properties use the same stream. Their setters do not truncate an older longer payload, whereas this stream setter does clear before copying. For unambiguous replacement semantics, assign a distinct prepared stream, call `Content.Clear` before a text setter, or load a fresh byte array through [`LoadFromBytes`](../Methods/LoadFromBytes.md).

**External references**

- [Embarcadero `TMemoryStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream) and [`TStream.CopyFrom`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.CopyFrom)
- [Free Pascal `TMemoryStream`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.html) and [`TStream.CopyFrom`](https://www.freepascal.org/docs-html/rtl/classes/tstream.copyfrom.html) - compatible stream context; Velox executes Delphi and Indy implementations.
- [RFC 9110 section 6: Message abstraction](https://www.rfc-editor.org/rfc/rfc9110#section-6)

<small>Created 2026-07-15</small>
