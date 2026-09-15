---
title: RawPathInfo
description: Returns Indy's encoded request target after query separation, before the URI path is percent-decoded into PathInfo.
sidebar_position: 27
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, raw-path, uri, encoded]
---

```Delphi
property RawPathInfo: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.RawPathInfo
  else
    Value := '';
end;
```

### Usage

`RawPathInfo` returns Velox's encoded request target after query separation, before the URI path is percent-decoded into PathInfo.

### Additional Technical Info
`RawPathInfo` returns `TIdHTTPRequestInfo.URI`. Indy removes the query at `?` and stores the remaining request target before `TIdURI` percent-decodes components into [`PathInfo`](PathInfo.md). The property therefore preserves encoded path octets and excludes [`Query`](Query.md).

For the usual origin-form request it is a slash-led encoded path. HTTP also permits other request-target forms; an absolute-form target can leave more than a path in this stored value, and the asterisk form is `*`. Do not assume it always names a local route or begins with `/`.

Raw does not mean safe or byte-for-byte request line. Indy has already tokenised the request and separated the query, and Unicode string representation/transport handling has occurred. Do not use it as a filesystem path or open redirect target. If a signature protocol requires exact canonical request-target data, implement the protocol's specified canonicalisation at the correct server boundary.

Compare routing paths only after one controlled decoding/normalisation step and reject ambiguous encodings, encoded separators and dot traversal as appropriate. Avoid decoding both `RawPathInfo` and `PathInfo` in different layers. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.RawPathInfo`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.RawPathInfo)
- [RFC 9112 section 3.2: Request Target](https://www.rfc-editor.org/rfc/rfc9112#section-3.2)
- [RFC 3986 section 2.1: Percent-Encoding](https://www.rfc-editor.org/rfc/rfc3986#section-2.1)

<small>Created 2026-07-15</small>
