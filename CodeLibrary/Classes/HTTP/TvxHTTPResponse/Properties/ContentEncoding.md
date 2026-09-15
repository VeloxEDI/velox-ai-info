---
title: ContentEncoding
description: Returns the response content-coding metadata, which does not guarantee the buffered body has been decoded.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, content-encoding, compression]
---

```Delphi
property ContentEncoding: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://api.example.invalid/v1/export');
  if Http.Response.ContentEncoding = '' then
    Value := Http.Response.Content.Size
  else
    Value := 'Encoded as ' + Http.Response.ContentEncoding;
end;
```

### Usage

`ContentEncoding` returns the response content-coding metadata, which does not guarantee the buffered body has been decoded.

### Additional Technical Info
`ContentEncoding` returns the parsed first `Content-Encoding` response-field value. It identifies content codings such as `gzip` or `deflate`; it is not a character set and does not select a `ContentAs...` decoder. An absent or empty field returns `''`.

Ordinary locally constructed [`TVxHTTP`](../../TvxHTTP.md) clients do not attach an Indy compressor. In that normal path, a gzip- or deflate-coded representation remains encoded in [`Content`](Content.md), and reading it as text produces compressed-data noise or a decoding failure. The script-visible response class has no built-in decompression method.

A host can inject/configure the underlying Indy client outside this class. If that client has a ready compressor, Indy can decode supported content into `Content` while this property and [`ContentLength`](ContentLength.md) still describe the wire representation. Consequently, neither the property alone nor a comparison between declared and captured sizes proves whether decompression occurred; know the client construction path.

Named lookup uses the first matching field. Raw fields and trailers remain available through the header APIs, but typed metadata is not recalculated from trailers. The value is untrusted and can remain stale if request setup fails before a new response terminal.

**External references**

- [RFC 9110 section 8.4: Content-Encoding](https://www.rfc-editor.org/rfc/rfc9110#section-8.4)
- [IANA HTTP Content Coding Registry](https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#content-coding)

<small>Created 2026-07-20</small>
