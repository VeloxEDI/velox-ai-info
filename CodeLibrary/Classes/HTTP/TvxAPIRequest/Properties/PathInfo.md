---
title: PathInfo
description: Returns Indy's percent-decoded request-target path without the query, but without canonicalisation or filesystem safety.
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, path, uri, decoding, security]
---

```Delphi
property PathInfo: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.PathInfo
  else
    Value := '';
end;
```

### Usage

`PathInfo` returns Velox's percent-decoded request-target path without the query, but without canonicalisation or filesystem safety.

### Additional Technical Info
`PathInfo` returns Indy's `Document`. The HTTP server separates the query at `?`, parses the remaining request target as a `TIdURI`, URL-decodes its path and document components, and concatenates them. The asterisk-form target is preserved as `*`.

This is the decoded routing path, not the raw wire text. Percent-encoded octets can therefore become separators or other characters before the property is read. [`RawPathInfo`](RawPathInfo.md) returns Indy's encoded target path, while [`Query`](Query.md) contains the separate encoded query.

Decoding is not a security canonicalisation. Indy's decoder leaves `+` unchanged in a path and accepts the nonstandard `%uXXXX` form. More critically, it catches conversion errors for malformed/incomplete percent escapes and silently contributes no bytes for that escape instead of rejecting the request; two distinct raw paths can therefore collapse toward the same decoded text. Compare [`RawPathInfo`](RawPathInfo.md) when enforcing an encoding policy.

Do not concatenate `PathInfo` into a Windows path, SQL statement, module name, URL or redirect. Reject NUL/control characters and malformed/unexpected encodings upstream, normalise once under the target subsystem's rules, resolve dot segments where appropriate, and enforce an allow-listed route/root after normalisation. Avoid decoding the value a second time.

The property can differ from generic WebBroker deployment expectations and is not guaranteed to contain a script/application prefix. Velox API routing should rely on configured routes and explicit parameters, not ad hoc substring tests. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.PathInfo`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.PathInfo)
- [RFC 9110 section 7.1: Determining the target resource](https://www.rfc-editor.org/rfc/rfc9110#section-7.1)
- [RFC 3986 section 3.3: Path](https://www.rfc-editor.org/rfc/rfc3986#section-3.3)

<small>Created 2026-07-15</small>
