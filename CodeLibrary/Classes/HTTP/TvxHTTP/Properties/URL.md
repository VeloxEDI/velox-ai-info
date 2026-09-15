---
title: URL
description: Retains the starting URL assigned by the most recent HTTP verb without itself sending a request or tracking redirects.
sidebar_position: 30
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, url, destination, logging]
---

```Delphi
property URL: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.HandleRedirects := False;
  Http.Get('https://api.example.invalid/v1/status');
  Value := Http.URL;
end;
```

### Usage

Retains the starting URL assigned by the most recent HTTP verb without itself sending a request or tracking redirects.

### Additional Technical Info
`URL` is the Velox field holding the request's starting destination. It defaults to an empty string. Every public request method assigns its `aURL` argument before entering the shared pipeline, so directly setting this property does not send anything and the next [`Get`](../Methods/Get.md), `Post` or other verb overwrites it.

The string is passed to Indy without a Velox scheme, host, port, path, query, fragment, address-range or length allowlist. Indy parses it during request preparation. A URL userinfo component replaces request username/password values after Velox's authentication setup. Even with `AuthType = fatNone`, a later server challenge can make Indy select an authentication class and use those URL-supplied credentials. Query and userinfo values are also transmitted and logged as part of the target. Reject userinfo and do not embed credentials or tokens in the URL.

Requests execute with the Velox process's network reach. Externally influenced values can therefore create server-side request forgery, access loopback/private services or exfiltrate data in query strings and bodies. Parse and allowlist scheme, canonical host and port outside this helper; resolve or block prohibited address ranges according to the deployment boundary.

[`HandleRedirects`](HandleRedirects.md) is `True` by default. Indy updates its internal request URL while following a redirect, but this Velox property remains the original starting string. It also retains the request authentication object, so credentials or a bearer token can cross to the redirect target. The intercept uses `FURL` as the log key, so raw messages from redirected authorities can be recorded against the original URL. Disable redirects when each destination must be authorised independently.

Every completed request disconnects. The property nevertheless remains set after success, HTTP error, operational exception or authentication preflight failure, so it records an attempted starting destination rather than proof that a request reached that endpoint. Use [`Response`](Response.md) and workflow logs to assess outcome, while remembering that response metadata can be stale after an early failure.

**External references**

- [RFC 3986: Uniform Resource Identifier syntax](https://www.rfc-editor.org/rfc/rfc3986)
- [RFC 9110 section 4.2: HTTP-related URI schemes](https://www.rfc-editor.org/rfc/rfc9110#section-4.2)

<small>Created 2026-07-15</small>
