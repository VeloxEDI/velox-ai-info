---
title: CookieFields
description: Returns the host-owned cached mutable list of Name=Value pairs reconstructed from Indy's parsed request cookies.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, cookies, string-list, security]
---

```Delphi
property CookieFields: TStrings read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if (Request <> nil) and (Request.CookieFields <> nil) then
    Value := Request.CookieFields.Values['Preference']
  else
    Value := '';
end;
```

### Usage

`CookieFields` returns the Velox-provided cached mutable list of Name=Value pairs reconstructed from Velox's parsed request cookies.

### Additional Technical Info
`CookieFields` returns the live `TStringList` cached inside the inherited WebBroker request. During native construction, the generic lazy getter initially tries to parse [`Cookie`](Cookie.md), which is hard-coded empty in this bridge. The constructor then enumerates Indy's already parsed cookie collection and appends each cookie's reconstructed `Name=Value` (`ClientCookie`) string.

The list is normally created once and remains attached to the request until destruction. It is host-owned: do not free or retain it. Although the property is read-only, the returned `TStrings` object is mutable. Adding, deleting or changing lines alters only this cached list; it does not rewrite Indy's raw headers/cookie collection or instruct the client to set a response cookie.

Indy extracts all physical `Cookie` fields, splits them into cookie pairs and reconstructs each stored name/value without cookie attributes. Order and duplicate names can matter. `Values['name']` is convenient but can hide later duplicates; enumerate/count entries when duplicate handling must be explicit. Do not assume percent/URL decoding, JSON decoding or cryptographic verification occurred.

Every cookie name/value is untrusted and often sensitive. Validate the expected name, maximum length and syntax; verify a signed/encrypted session token through the approved authentication mechanism; and avoid logging or ordinary persistence. Cookie presence does not authenticate a caller. Changes to this cached list are shared with later request consumers and are not thread-safe.

Test [`Request`](../../../../Variables/Helpers/Request.md) and `CookieFields` for `nil`. The list exists only for the current request execution.

**External references**

- [Embarcadero DocWiki: `TWebRequest.CookieFields`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.CookieFields)
- [Embarcadero DocWiki: `System.Classes.TStrings.Values`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStrings.Values)
- [RFC 6265 section 4.2: Cookie header](https://www.rfc-editor.org/rfc/rfc6265#section-4.2)

<small>Created 2026-07-15</small>
