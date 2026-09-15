---
title: ProtocolVersion
description: Returns the HTTP-version token Indy extracted from the request line, such as HTTP/1.1, as unvalidated text.
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, protocol-version, request-line]
---

```Delphi
property ProtocolVersion: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.ProtocolVersion
  else
    Value := '';
end;
```

### Usage

`ProtocolVersion` returns the HTTP-version token Velox extracted from the request line, such as HTTP/1.1, as unvalidated text.

### Additional Technical Info
`ProtocolVersion` returns `TIdHTTPRequestInfo.Version`. Indy takes the text after the final space in the request line and separately attempts to parse major/minor numbers for its own server behavior. Velox exposes only the stored text, normally `HTTP/1.0` or `HTTP/1.1` for this bridge.

Reading the property does not negotiate, upgrade or downgrade the connection. The surrounding server/adapter has already parsed and accepted enough of the request to invoke the action. HTTP/2 or HTTP/3 can also be translated by a front proxy into an HTTP/1.x hop, so this value need not be the originating client's protocol version.

Do not select business semantics, authentication or response security solely from this string. If diagnostics need it, length-bound and treat it as transport metadata. Compare exact supported values only; malformed or extension text can be present if it reached this layer.

The value belongs to the live request and is read-only. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.ProtocolVersion`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.ProtocolVersion)
- [RFC 9112 section 2.3: HTTP Version](https://www.rfc-editor.org/rfc/rfc9112#section-2.3)

<small>Created 2026-07-15</small>
