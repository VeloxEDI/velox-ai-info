---
title: Expires
description: Parses the first Expires request-header value, returning -1 when absent even though current Expires semantics concern responses.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, expires, caching, date]
---

```Delphi
property Expires: TDateTime read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if (Request <> nil) and (Request.Expires >= 0) then
    Value := Request.Expires
  else
    Value := 0;
end;
```

### Usage

Parses the first Expires request-header value, returning -1 when absent even though current Expires semantics concern responses.

### Additional Technical Info
`Expires` looks up the first inbound `Expires` field and uses the same bridge parser as [`Date`](Date.md). Empty returns `-1`; invalid nonempty syntax can raise. Standard weekday-leading HTTP-date text becomes a timezone-free `TDateTime` representing UTC, while numeric-leading legacy forms follow WebBroker's older parser without timezone conversion.

Current HTTP defines `Expires` as response metadata used to calculate freshness. Its presence on a request does not make the request expire, configure a Velox cache, set an action timeout or authorise processing. Treat this request-side property as legacy/untrusted metadata unless a documented application protocol assigns it a separate meaning.

Do not compare directly without first distinguishing the `-1` sentinel and deciding the timezone convention. For a real request deadline, define a signed field and explicit skew/replay policy, or enforce server-side timeouts independent of caller data. A remote caller can choose this value.

Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`. Reading the property has no cache or response side effect.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Expires`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Expires)
- [Embarcadero DocWiki: `Web.HTTPApp.ParseDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.ParseDate)
- [RFC 9111 section 5.3: Expires](https://www.rfc-editor.org/rfc/rfc9111#section-5.3)

<small>Created 2026-07-15</small>
