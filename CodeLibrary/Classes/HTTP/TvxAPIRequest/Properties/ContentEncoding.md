---
title: ContentEncoding
description: Returns Indy's parsed Content-Encoding field text without decoding or decompressing the request body.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, content-encoding, compression]
---

```Delphi
property ContentEncoding: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.ContentEncoding
  else
    Value := '';
end;
```

### Usage

`ContentEncoding` returns Velox's parsed Content-Encoding field text without decoding or decompressing the request body.

### Additional Technical Info
`ContentEncoding` returns Indy's stored value derived from the inbound `Content-Encoding` header. It is metadata describing content codings such as compression applied to the representation; it is not the character set used to turn text bytes into characters.

Reading this property does not decode or decompress [`Content`](Content.md), [`RawContent`](RawContent.md) or [`ContentString`](ContentString.md). In particular, `ContentString` passes the still-coded raw bytes directly to a character decoder. If a request can be content-coded, the endpoint must either reject unsupported codings or use an approved bounded decompression stage before text/format parsing.

Treat coding names and order as untrusted. Multiple codings are ordered, and safe processing applies them in reverse order. Enforce limits on compressed size, expanded size, ratio, nesting and processing time to prevent resource-exhaustion attacks. An empty value normally means no coding was selected; it does not validate the body.

The property is read-only live request state and may reflect only the first header value selected by Indy. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil` and do not use this value as evidence that decoding already occurred.

**External references**

- [Embarcadero DocWiki: `TWebRequest.ContentEncoding`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.ContentEncoding)
- [RFC 9110 section 8.4: Content-Encoding](https://www.rfc-editor.org/rfc/rfc9110#section-8.4)

<small>Created 2026-07-15</small>
