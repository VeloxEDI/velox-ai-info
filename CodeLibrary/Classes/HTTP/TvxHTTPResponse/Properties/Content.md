---
title: Content
description: Returns the response-owned live memory stream containing the fully buffered terminal HTTP body.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, body, stream]
---

```Delphi
property Content: TMemoryStream read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Body: TMemoryStream;
begin
  Http.Get('https://api.example.invalid/v1/export');
  Body := Http.Response.Content;  // Borrowed; do not free.
  Value := Body.Size;
  Body.Position := 0;
end;
```

### Usage

`Content` returns the response-owned live memory stream containing the fully buffered Velox HTTP body.

### Additional Technical Info
`Content` returns the live `TMemoryStream` owned by the [`TvxHTTPResponse`](../../TvxHTTPResponse.md) facade. The property reference is read-only, but the returned stream is mutable. Do not free it. Changing its bytes, size or position immediately affects every `ContentAs...` view and can change what later workflow steps observe.

After proxy, intercept and local SSL object initialisation, Velox clears this stream immediately before request authentication and header application. A failure during those earlier initialisers can leave the preceding body intact; a later setup failure sees an empty stream. Indy then buffers the response body into it. On a normally completed request Velox rewinds the stream to position zero. A text getter subsequently reads the complete `Size` and leaves `Position` at the end; a text setter rewrites from offset zero and returns the position to zero.

The stream normally contains the terminal representation. Bodies received during in-process authentication or a redirect that Indy follows are discarded. HTTP 4xx and 5xx representations are retained because Velox enables protocol-error content. HEAD responses and the status classes that prohibit content can leave the stream empty even when metadata reports a declared length. Transfer or decoding errors can leave partial data or raise.

Content is fully buffered in memory; this class offers no streaming limit. Validate expected size and type before processing data supplied by an untrusted or variable endpoint. [`ContentLength`](ContentLength.md) is the declared wire metadata, not a reliable substitute for `Content.Size`.

Once the initialisers complete, only this stream is cleared. If later setup fails before Indy receives a new response, `Content.Size` is zero but response code, text and headers can remain from the previous attempt. If an earlier initialiser raises, even the body can remain stale. Keep the body and metadata together only after confirming that the current request reached its intended terminal.

Ordinary Velox construction installs no response decompressor. A `Content-Encoding: gzip` or `deflate` response therefore normally leaves encoded bytes in this stream. Host-injected Indy clients can behave differently if they supply a ready compressor; consult [`ContentEncoding`](ContentEncoding.md).

**External references**

- [Embarcadero `TMemoryStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream) and [`TStream.Position`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Position)
- [Free Pascal `TMemoryStream`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.html) and [`TStream.Position`](https://www.freepascal.org/docs-html/rtl/classes/tstream.position.html) - compatible stream context; Velox executes Delphi and Indy implementations.
- [RFC 9110 section 6.4: Content](https://www.rfc-editor.org/rfc/rfc9110#section-6.4)

<small>Created 2026-07-20</small>
