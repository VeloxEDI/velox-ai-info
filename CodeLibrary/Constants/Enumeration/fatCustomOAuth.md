---
title: fatCustomOAuth
description: Selects Velox OAuth token acquisition with caller-supplied provider endpoints, scope and grant settings.
sidebar_position: 46
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, authentication, oauth, custom, endpoints, grant]
---

```Delphi
fatCustomOAuth = 6
```

### Example

```Delphi
procedure ConfigureCustomOAuth(Client: TvxHTTP);
begin
  Client.AuthType := fatCustomOAuth;
  Client.GrantType := gtClientCredentials;
  Client.AuthURL := 'https://identity.example.test/oauth2/authorize';
  Client.TokenURL := 'https://identity.example.test/oauth2/token';
  Client.Scope := 'orders.read';
end;
```

### Usage

`fatCustomOAuth` selects Velox OAuth token acquisition with caller-supplied provider endpoints, scope and grant settings.

### Additional Technical Info
`fatCustomOAuth` is ordinal 6 of [`TvxAuthType`](../../Types/Enumerations/TvxAuthType.md). It selects the OAuth acquisition branch but contributes no built-in authorization endpoint, token endpoint, logout endpoint or default scope. The caller must configure the provider contract on the receiving object.

When authentication runs, Velox configures `TvxOAuth2Authenticator` from AuthType, GrantType, Tenant, ClientId, Secret (falling back to Password when Secret is blank), Username, Password, Certificate, Scope, State, AuthURL, TokenURL and CallbackURL. Nonblank caller endpoints/scope override provider defaults; for this member the defaults are blank. `gtAuto` also remains `gtAuto` in the provider table, and `Authorize` then falls back to its client-credentials implementation. Set an explicit grant when interoperability matters.

The acquired access token is assigned to an HTTP bearer authentication object. The member itself does not mean that arbitrary provider extensions are supported: the current token bodies and response parsing are Velox implementations for authorization-code, client-credentials, password and refresh-token paths.

#### Configuration checklist and quirks

- Provide a TokenURL for non-interactive grants. AuthURL and CallbackURL are additionally relevant to authorization-code flow.
- Set ClientId and Secret/Password according to the provider. Empty required values fail at authorization time, not when this constant is assigned.
- Set Scope explicitly; blank is passed through because the custom provider has no default.
- Confirm the provider accepts Velox's form fields and casing. The password branch currently sends `Username` and `Password` field names with capitals, which is a compatibility quirk for strict servers.
- Treat returned access/refresh/ID tokens and all client credentials as secrets. A successful HTTP response is parsed for `access_token`, `refresh_token`, `id_token`, `token_type` and `expires_in`.
- Custom endpoints expand the trust boundary. Require HTTPS, validate server certificates, constrain redirects and never interpolate untrusted endpoint text.

The example uses reserved `.test` URLs and is illustrative only. No OAuth, credential, browser, callback, network or image-function test was executed.

**Related Code Library entries**

- [`TvxHTTP.AuthType`](../../Classes/HTTP/TvxHTTP/Properties/AuthType.md), [`GrantType`](../../Classes/HTTP/TvxHTTP/Properties/GrantType.md), [`AuthURL`](../../Classes/HTTP/TvxHTTP/Properties/AuthURL.md) and [`TokenURL`](../../Classes/HTTP/TvxHTTP/Properties/TokenURL.md).
- [`fatBearer`](fatBearer.md) - use when the token is already available and Velox must not acquire it.

**External references**

- [RFC 6749: OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749) - grant, endpoint and token-response contracts.

<small>Created 2026-07-15</small>
