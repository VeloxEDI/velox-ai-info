---
title: ContentString
description: Gets or sets Unicode response text that takes precedence over the response stream and is encoded using Indy's current charset.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, content, string, charset]
---

```Delphi
property ContentString: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    Response.ContentType := 'application/json; charset=utf-8';
    Response.ContentString := '{"status":"ok"}';
    Value := Response.ContentString;
  end;
end;
```

### Usage

`ContentString` gets or sets Unicode response text that takes precedence over the response stream and is encoded using Velox's current charset.

### Additional Technical Info
`ContentString` is Velox's script name for the inherited WebBroker `Content: string`; it maps to Indy's `ContentText`. It is separate from the stream exposed as [`Content`](Content.md).

The setter stores Unicode text and sets the provisional [`ContentLength`](ContentLength.md) to `Length(Value)`, which is a character count. Normal automatic sending later resets that length to `-1` and calculates the encoded byte count using the current Indy charset from [`ContentType`](ContentType.md).

In this bridge, any nonempty `ContentString` takes wire priority over an assigned content stream. This is the reverse of the generic `TWebResponse.ContentStream` documentation and follows the actual `TIdHTTPResponseInfo.WriteHeader`/`WriteContent` order. Set `ContentString := ''` when a stream must be sent. An empty string is not an explicit empty-body marker: for an ordinary body-bearing status with no stream, Indy generates a small HTML status body. HEAD, 1xx, 204 and 304 responses suppress body bytes.

Always set a suitable content type and explicit charset before text. `text/*` without a charset can cause Indy's legacy ISO-8859-1 default; a completely absent type is changed to `text/html; charset=UTF-8` for current automatic sending when content exists. For JSON, use `application/json; charset=utf-8` in this implementation so the encoder choice is explicit.

The property does not JSON/XML/HTML-encode, escape, validate or compress the text. Never concatenate untrusted text into JSON or HTML without the format's correct encoder, and do not return secrets, internal exception details or paths. Large values consume memory for both the Unicode string and encoded bytes. Reads return mutable pre-send state; sending later clears Indy's text.

Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`. Assignment can raise on allocation, invalid object state or later charset encoding.

**External references**

- [Embarcadero DocWiki: `TWebResponse.Content`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.Content)
- [Embarcadero DocWiki: `TWebResponse.ContentType`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.ContentType)
- [RFC 9110 section 8.3: Content-Type](https://www.rfc-editor.org/rfc/rfc9110#section-8.3)
- [RFC 8259 section 8.1: JSON Character Encoding](https://www.rfc-editor.org/rfc/rfc8259#section-8.1)

<small>Created 2026-07-15</small>
