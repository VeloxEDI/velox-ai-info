---
title: ContentType
description: Gets or sets the response media type while Indy extracts and retains its charset separately for text encoding.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, content-type, media-type, charset]
---

```Delphi
property ContentType: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    Response.ContentType := 'application/json; charset=utf-8';
    Response.ContentString := '{"value":42}';
    Value := Response.ContentType;
  end;
end;
```

### Usage

`ContentType` gets or sets the response media type while Velox extracts and retains its charset separately for text encoding.

### Additional Technical Info
`ContentType` supplies the media type and optional parameters for the response. The bridge passes the value to Indy and also caches the original assigned string. A subsequent script read therefore normally returns the original spelling/parameters, while Indy has separately removed the `charset` parameter into its `CharSet` field for encoding and wire-header reconstruction.

Important state behavior follows from that split:

- assigning a value with `charset=...` changes Indy's encoding charset;
- assigning another nonempty value without a charset does **not** necessarily clear the previous charset;
- when no charset has ever been set, Indy applies legacy defaults for `text/*` (`ISO-8859-1`, or US-ASCII for XML text types); and
- assigning the empty string clears the media type and charset together.

To change from text to binary safely after a previous charset, clear the property first and then set the binary type. Otherwise an old charset can be reattached to a later `application/octet-stream` or image response. For response text, specify the intended charset explicitly before assigning [`ContentString`](ContentString.md).

If body text/stream exists and the underlying media type is still empty, current automatic sending sets `text/html; charset=UTF-8`. This fallback does not inspect the bytes and can mislabel JSON, XML, files or binary content. Set the correct registered media type deliberately.

The property does not convert a stream, validate that content matches the declared type, perform content negotiation or apply [`ContentEncoding`](ContentEncoding.md). Treat user-supplied type text as untrusted; do not allow control characters or arbitrary response-header injection. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.ContentType`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.ContentType)
- [RFC 9110 section 8.3: Content-Type](https://www.rfc-editor.org/rfc/rfc9110#section-8.3)
- [RFC 6838: Media Type Specifications and Registration Procedures](https://www.rfc-editor.org/rfc/rfc6838)

<small>Created 2026-07-15</small>
