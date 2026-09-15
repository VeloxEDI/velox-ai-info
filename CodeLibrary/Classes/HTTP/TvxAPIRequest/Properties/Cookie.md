---
title: Cookie
description: Always returns an empty string because the active Indy WebBroker bridge does not expose the raw Cookie header here.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, cookie, empty, quirk]
---

```Delphi
property Cookie: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Use CookieFields for parsed cookie pairs; Cookie is always empty. }
  if Request <> nil then
    Value := Request.CookieFields.Count
  else
    Value := 0;
end;
```

### Usage

Always returns an empty string because the active Velox WebBroker bridge does not expose the raw Cookie header here.

### Additional Technical Info
In the active `TIdHTTPAppRequest` bridge, the `Cookie` string-variable case is hard-coded to `''` with an implementation comment that it is not available. It does not return Indy's raw `Cookie` header, even when cookies were supplied and [`CookieFields`](CookieFields.md) contains entries.

Consequently, empty is the only normal result and cannot distinguish no cookie header from one or many cookies. Do not parse this property, test it to decide whether a session exists, or treat its emptiness as evidence that no credentials/state arrived.

Use `CookieFields` for the bridge's parsed `Name=Value` pairs. Even then, use an approved session/authentication layer rather than accepting a cookie value as a trusted identity. Cookies are attacker-controlled secrets until validated for name, integrity, expiry, scope and application-specific meaning.

The Embarcadero page describes the intended generic WebBroker property, not this bridge behavior. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`; never log cookie material from any alternative source.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Cookie`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Cookie)
- [RFC 6265 section 4.2: Cookie header](https://www.rfc-editor.org/rfc/rfc6265#section-4.2)

<small>Created 2026-07-15</small>
