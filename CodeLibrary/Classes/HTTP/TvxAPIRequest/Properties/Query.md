---
title: Query
description: Returns the encoded query substring after the first question mark, excluding the question mark and without parsing fields.
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, query, uri, encoded]
---

```Delphi
property Query: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.Query
  else
    Value := '';
end;
```

### Usage

Returns the encoded query substring after the first question mark, excluding the question mark and without parsing fields.

### Additional Technical Info
`Query` returns `TIdHTTPRequestInfo.QueryParams`. Indy separates the request target at the first `?`; the value after it is retained without the question mark, while the path continues through URI parsing. If there is no `?`, the result is empty.

The string remains percent-encoded. It is not split into names/values and should not be concatenated directly into another URI, SQL, logs or signatures. The exact distinction between empty query and no query marker is lost because both return `''`.

Use [`QueryFields`](QueryFields.md) for the bridge's mutable decoded list, while reading its duplicate, decoding and partial-cache caveats. For cryptographic verification or a protocol that needs exact request-target bytes, note that this property is only the stored query component and that normalisation/reconstruction can change meaning.

Treat the value as untrusted, length-bound input. Define accepted parameter names/counts/sizes, reject unexpected duplicates and decode exactly once. Secrets in query strings are easily exposed through logs, browser history and intermediaries; prefer protected headers/body fields. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Query`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Query)
- [RFC 3986 section 3.4: Query](https://www.rfc-editor.org/rfc/rfc3986#section-3.4)

<small>Created 2026-07-15</small>
