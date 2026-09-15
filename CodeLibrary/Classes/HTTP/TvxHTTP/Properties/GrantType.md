---
title: GrantType
description: Selects the OAuth grant branch used to acquire a bearer token and exposes important provider defaults and implementation limitations.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, oauth, grant-type, client-credentials]
---

```Delphi
property GrantType: TvxGrantType read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.AuthType := fatCustomOAuth;
  Http.GrantType := gtClientCredentials;
  Http.ClientId := 'velox-integration-client';
  Http.Secret := '<secret-from-approved-configuration>';
  Http.TokenURL := 'https://identity.example.invalid/oauth2/token';
  Http.Get('https://api.example.invalid/v1/status');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

Set `GrantType` to choose how `TvxHTTP` acquires an OAuth bearer token. Use `gtClientCredentials` for normal service-to-service authentication and configure `ClientId`, `Secret`, `TokenURL` and any required scope. `gtAuto` uses the provider default and currently falls back to client credentials for custom OAuth.

Treat `gtPassword` as legacy provider compatibility only. Do not use `gtAuthCode` for a normal interactive authorization-code flow because current Velox does not complete the browser, callback and code-exchange sequence. Use a fresh HTTP object after changing OAuth settings so an earlier token is not reused.

### Additional Technical Info
`GrantType` selects how an OAuth `AuthType` obtains an access token. A new HTTP client uses `gtAuto`. The script-facing [`TvxGrantType`](../../../../Types/Enumerations/TvxGrantType.md) has four values:

| Value | Current behavior |
|---|---|
| `gtAuto` | Replaced during configuration with the provider table's default. Microsoft, Google and NetSuite select client credentials. Custom OAuth remains `gtAuto`, then `Authorize` falls through to client credentials. |
| `gtClientCredentials` | Posts a client-credentials request to [`TokenURL`](TokenURL.md). NetSuite instead creates an ES512 JWT client assertion. |
| `gtPassword` | Posts client ID, client secret, resource-owner username/password and scope to the token endpoint. |
| `gtAuthCode` | Calls the configured authorization URL synchronously and expects token JSON directly; it does not implement the normal browser, callback and code-exchange sequence. |

For ordinary client credentials, Velox requires nonblank [`ClientId`](ClientId.md) and effective client secret. [`Secret`](Secret.md) is the client secret when nonblank; otherwise [`Password`](Password.md) is silently used. It constructs the UTF-8 `application/x-www-form-urlencoded` body by concatenating strings without percent-encoding field values. Reserved characters can therefore corrupt or inject parameters.

The password branch similarly concatenates raw values and sends parameter names `Username` and `Password` with uppercase first letters, whereas RFC 6749 defines lowercase `username` and `password`. Its exception handler also replaces the provider's detailed parse or response error with a generic authentication error. Treat this legacy grant as compatibility-only and test it against a non-production provider before use.

The authorization-code branch is materially incomplete. Embarcadero's constructed URI already contains `response_type` and every nonempty client ID, redirect URI, scope and state value; Velox then adds all five parameters again to the REST request, so nonempty values can be duplicated. It performs a direct `TRESTClient` GET and expects a 200 JSON body containing tokens. It does not drive a user agent, receive [`CallbackURL`](CallbackURL.md), validate [`State`](State.md), capture an authorization code or call the implemented code-to-token exchange. A standards-compliant provider will normally return a login/consent page or redirect instead.

The authenticator persists across requests. Every configuration clears `RefreshToken` but retains `AccessToken` and `AccessTokenExpiry`. Consequently, a still-valid token can survive changed OAuth settings, while a received refresh token is cleared before the next authorization attempt and is not used for renewal through this `TvxHTTP` path. When the token expires, Velox repeats the selected original grant. If a token response supplies a future `expires_in` but no access token, later attempts skip acquisition until that expiry and continue failing with a blank token. Conversely, a missing/invalid `expires_in` becomes zero and makes the original grant run again on the next request. Use a fresh HTTP object after changing configuration or entering either inconsistent state.

OAuth acquisition exceptions are logged and re-raised inside `DoOAuthAuthorisation`, but `HTTPAuthorization` catches them and reports authentication as unhandled. With default pre-emptive setup, the outer request commonly returns before contacting the resource rather than delivering that exception to the script. Inspect Velox errors as well as the response state when diagnosing authentication.

OAuth endpoints and credentials require TLS with server authentication. The nested `TvxHTTP` used by client-credentials and password grants has the same reviewed certificate-validation gap as the outer helper; do not assume the acquisition channel is authenticated merely because `TokenURL` uses `https`.

**External references**

- [RFC 6749 section 4.1: Authorization code grant](https://www.rfc-editor.org/rfc/rfc6749#section-4.1)
- [RFC 6749 section 4.3: Resource-owner password credentials grant](https://www.rfc-editor.org/rfc/rfc6749#section-4.3)
- [RFC 6749 section 4.4: Client-credentials grant](https://www.rfc-editor.org/rfc/rfc6749#section-4.4)
- [RFC 6749 appendix B: Form encoding](https://www.rfc-editor.org/rfc/rfc6749#appendix-B)
- [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700)

<small>Created 2026-07-15</small>
