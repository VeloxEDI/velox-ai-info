---
title: HandleRedirects
description: Controls whether the HTTP client automatically follows redirect responses and documents its fixed limit, method handling and trust implications.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, redirects, location, security]
---

```Delphi
property HandleRedirects: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.HandleRedirects := False;
  Http.Get('https://api.example.invalid/v1/status');

  if (Http.Response.ResponseCode >= 300) and
     (Http.Response.ResponseCode < 400) then
    Value := Http.Response.Header['Location']
  else
    Value := Http.Response.ResponseCode;
end;
```

### Usage

Set `HandleRedirects := True` when the HTTP client may safely follow redirect responses automatically; new `TvxHTTP` instances default to this behaviour. Set it to `False` when the script must inspect and authorise the returned `Location` before sending another request.

Disable automatic redirects for authenticated requests, uploads, webhooks or externally influenced URLs unless every possible target is trusted. A redirect can change host or scheme and can replay credentials or a non-idempotent request body. The fixed redirect limit is 15 and is not script-configurable.

### Additional Technical Info
`HandleRedirects` maps directly to Indy's redirect switch. Although Indy itself defaults the switch to `False`, a new `TvxHTTP` explicitly sets it to `True`. The value persists for the lifetime of the HTTP object.

When enabled, current Indy treats 3xx responses other than 304 as redirects when they contain `Location`. It increments an internal count and follows while the count is below its fixed `RedirectMaximum` of 15. Scripts cannot change that maximum or intercept the redirect event. In practice, the fifteenth redirect response is retained rather than followed.

For 303, Indy discards the request source and changes the next request to GET. It would do the same for 302 only with `hoTreat302Like303`, which Velox does not enable. Other redirect statuses preserve the current method and source, so a POST/PUT/PATCH/custom body may be sent again to the redirect target. The response stream is truncated back to its starting position between followed responses; the final response is what [`Response`](Response.md) exposes.

Automatic redirect handling expands the outbound trust boundary. A permitted starting URL can redirect to another host, port, scheme or internal address, and scripts have no redirect-policy callback. Current Indy retains the request authentication object while changing the URL, so a Basic header, bearer/OAuth token or negotiated authentication state can be emitted to the redirected authority. It can also replay a non-idempotent request body. For authentication, uploads, webhooks or any externally influenced URL, set this property to `False`, inspect and validate `Location`, clear/reconfigure authentication, and issue a separately authorised request only when the target is allowlisted.

The [`URL`](URL.md) property and raw-wire log key remain the original URL supplied to the verb; internal redirect destinations do not replace that Velox field. This can make audit entries appear associated with the original endpoint even when later network messages were sent elsewhere.

When disabled, a redirect is normally returned for inspection rather than raising because Velox enables `hoNoProtocolErrorException`. A malformed redirect response or operational network failure can still raise.

**External references**

- [RFC 9110 section 15.4: Redirection responses](https://www.rfc-editor.org/rfc/rfc9110#section-15.4)
- [RFC 9110 section 10.2.2: Location](https://www.rfc-editor.org/rfc/rfc9110#section-10.2.2)

<small>Created 2026-07-15</small>
