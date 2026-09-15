---
title: PathTranslated
description: Returns the same decoded Indy Document as PathInfo and does not translate it to a server filesystem path.
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, path-translated, path, filesystem, quirk]
---

```Delphi
property PathTranslated: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.PathTranslated
  else
    Value := '';
end;
```

### Usage

`PathTranslated` returns the same decoded Velox Document as PathInfo and does not translate it to a server filesystem path.

### Additional Technical Info
In this Indy bridge, `PathTranslated` is assigned `FRequestInfo.Document`, exactly like [`PathInfo`](PathInfo.md). The source explicitly notes that it cannot translate the URI to a path. The result is therefore the percent-decoded request-target path (without query), **not** a fully qualified Windows filesystem location.

Do not pass it directly to file functions or use it as proof that a resource resides beneath a web root. It can contain caller-controlled separators, dot segments or names that acquire special meaning in Windows/filesystem APIs. Indy's same decoder silently drops malformed percent escapes instead of rejecting them, so raw encodings can collapse to an unexpected decoded path. If an endpoint intentionally maps a route value to storage, validate the raw encoding, perform one well-defined decode/normalisation, join it to an approved root using filesystem-aware operations, resolve the final path and verify containment before access.

This behavior materially differs from the generic Embarcadero description, which reflects other WebBroker server adapters. In Velox, `PathTranslated = PathInfo` for the same live request. Use [`RawPathInfo`](RawPathInfo.md) when exact encoded input matters, but do not treat raw text as automatically safer.

Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`. Reading the property performs no filesystem lookup and does not establish that a path exists.

**External references**

- [Embarcadero DocWiki: `TWebRequest.PathTranslated`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.PathTranslated)
- [RFC 3986 section 6: Normalization and comparison](https://www.rfc-editor.org/rfc/rfc3986#section-6)

<small>Created 2026-07-15</small>
