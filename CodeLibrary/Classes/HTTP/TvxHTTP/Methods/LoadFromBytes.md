---
title: LoadFromBytes
description: Replaces the pending HTTP request body with the complete supplied byte array, leaving the reusable internal stream positioned after the written bytes.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, bytes, request-body, stream]
---

```Delphi
procedure LoadFromBytes(const aBytes: TBytes);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var Body: TBytes;
begin
  Body := Base64DecodeBytes('eyJzdGF0dXMiOiJvayJ9');
  Http.LoadFromBytes(Body);
  Http.Header['Content-Type'] := 'application/json';
  Http.Post('https://api.example.invalid/events');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`LoadFromBytes` replaces the pending HTTP request body with the complete supplied byte array. After the call, the request-content position is at the end; reset it before any operation that reads from the current position.

### Additional Technical Info
`LoadFromBytes` clears the client's internal pending-request [`Content`](../Properties/Content.md) stream and writes all elements of `aBytes` beginning at position zero. An empty array leaves a genuinely empty body.

The bytes are copied; the caller retains the array and can change or release it afterward. For nonempty input, the internal stream finishes positioned at its end. Indy later rewinds the complete stream when a body-capable request is sent.

[`Post`](Post.md), [`Put`](Put.md), [`Patch`](Patch.md) and [`CustomRequest`](CustomRequest.md) supply the pending stream only when its size is positive. GET, DELETE, OPTIONS, HEAD and TRACE do not send it. After an actual request attempt enters the shared `try/finally`, Velox clears the pending stream even if the network operation raises, making the body normally one-shot. An authentication preflight exit can preserve it.

The method does not set `Content-Type`, `Content-Encoding`, length semantics or any schema metadata. Set the appropriate [`Header`](../Properties/Header.md) fields separately. It also performs no compression, encryption or text encoding beyond whatever produced the input bytes.

The complete array is duplicated in memory. A write/allocation exception occurs after the old content has been cleared and can leave partial new content. The client is mutable and unsynchronised.

**External references**

- [Embarcadero DocWiki: `TBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TBytes)
- [Embarcadero DocWiki: `TStream.Write`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Write)
- [Free Pascal: `TStream.Write`](https://www.freepascal.org/docs-html/rtl/classes/tstream.write.html)

<small>Created 2026-07-15</small>
