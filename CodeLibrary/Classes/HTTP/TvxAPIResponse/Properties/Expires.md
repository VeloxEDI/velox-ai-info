---
title: Expires
description: Gets or sets a UTC absolute response-expiry time, omitting the Expires field when the converted native value is nonpositive.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, expires, cache, utc]
---

```Delphi
property Expires: TDateTime read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    { Default: omit the legacy absolute expiry field. }
    Response.Expires := -1;
    Value := Response.Expires;
  end;
end;
```

### Usage

Gets or sets a UTC absolute response-expiry time, omitting the Expires field when the converted Velox value is nonpositive.

### Additional Technical Info
`Expires` supplies an absolute HTTP cache-expiry time. The valid response constructor initialises it to `-1`.

The script-facing value follows this bridge's UTC convention: the setter converts UTC to the server's local time for Indy, and the getter converts the stored local time back to UTC. `TDateTime` carries no timezone identity. The special `-1` value is preserved.

Indy emits `Expires` only when its stored local value is greater than zero. The default `-1` reliably omits the field; other values, including zero, are converted to local time first and zero can become positive east of UTC, producing an ancient 1899 field. Unlike [`Date`](Date.md), a non-emitted value is not replaced with the current time. To make a representation immediately stale, use a deliberate valid historical UTC time or, preferably, explicit current `Cache-Control` directives through [`SetCustomHeader`](../Methods/SetCustomHeader.md).

The property does not calculate freshness, create validators, inspect request cache directives or prevent an intermediary/client from storing a response. Conflicting `Cache-Control` and `Expires` values follow HTTP precedence rules, not Velox business logic. Choose cache policy deliberately, especially for personalised or sensitive data.

Assignment accepts any representable value and performs no I/O. Local/UTC conversion can be ambiguous around daylight-saving transitions. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.Expires`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.Expires)
- [RFC 9111 section 5.3: Expires](https://www.rfc-editor.org/rfc/rfc9111#section-5.3)
- [RFC 9111 section 5.2: Cache-Control](https://www.rfc-editor.org/rfc/rfc9111#section-5.2)

<small>Created 2026-07-15</small>
