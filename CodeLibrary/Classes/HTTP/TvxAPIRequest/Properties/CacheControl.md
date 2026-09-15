---
title: CacheControl
description: Returns the first unparsed Cache-Control request-header value without applying any caching policy.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, cache-control, caching]
---

```Delphi
property CacheControl: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.CacheControl
  else
    Value := '';
end;
```

### Usage

`CacheControl` returns the first unparsed Cache-Control request-header value without applying any caching policy.

### Additional Technical Info
`CacheControl` looks up `Cache-Control` in Indy's raw request headers and returns the first selected field value as text. Header-name matching is case-insensitive and folded continuation lines are unfolded, but Velox does not parse directives or combine duplicate physical fields.

The property is observational. It does not enable, disable or configure caching in Velox, the API response, a proxy or the client. Request directives are input to a standards-compliant cache; they are not commands that an application must blindly obey, and they do not override endpoint security or data-freshness requirements.

If a flow genuinely varies behavior by request cache directives, parse comma-separated directives and quoted values with a bounded HTTP parser. Treat unknown extensions conservatively and distinguish directives such as `no-cache` from `no-store`; substring matching is not sufficient. An empty result can mean absent or unavailable.

The value is untrusted live request data. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil` and do not use this property as an authentication, replay-prevention or freshness guarantee.

**External references**

- [Embarcadero DocWiki: `TWebRequest.CacheControl`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.CacheControl)
- [RFC 9111 section 5.2: Cache-Control](https://www.rfc-editor.org/rfc/rfc9111#section-5.2)

<small>Created 2026-07-15</small>
