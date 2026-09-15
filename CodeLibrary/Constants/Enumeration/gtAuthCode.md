---
title: gtAuthCode
description: Selects Velox's direct authorization-endpoint request branch, which does not currently implement a complete OAuth authorization-code flow.
sidebar_position: 141
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, oauth, authorization-code, pkce, security]
---

```Delphi
gtAuthCode = 1
```

### Example

```Delphi
procedure SelectAuthorizationCodeBranch(Client: TvxHTTP);
begin
  Client.GrantType := gtAuthCode;
end;
```

### Usage

`gtAuthCode` selects Velox's direct authorisation-endpoint request branch, which does not currently implement a complete OAuth authorisation-code flow.

### Additional Technical Info
`gtAuthCode` is ordinal 1 of [`TvxGrantType`](../../Types/Enumerations/TvxGrantType.md). It selects `TvxOAuth2Authenticator.AuthorizeAuthCodeCredentials` after an expired/missing access token and the absence of a usable in-memory refresh token.

#### Current Velox implementation

The selected routine requires both ClientId and ClientSecret, sends an HTTP GET to the configured authorization endpoint with `response_type`, `client_id`, `redirect_uri`, `scope` and `state`, and accepts only an HTTP 200 response. It then looks directly in that response for `access_token`, `refresh_token`, `id_token`, `token_type` and `expires_in`.

The request parameters are currently added twice: ancestor property `AuthorizationRequestURI` first builds them into the client URL, then `AuthorizeAuthCodeCredentials` adds the same names as GET parameters on the request. Providers can reject or interpret duplicate security parameters inconsistently.

This is not the authorization-code sequence defined by OAuth 2.0. The current branch does not:

- open or redirect a resource owner's user agent;
- receive and validate an authorization response at CallbackURL;
- compare returned state with the locally supplied State;
- exchange a returned authorization code at TokenURL; or
- send PKCE `code_challenge`/`code_verifier` values.

The class contains a separate public `AuthCodeToAccessToken` method, but it is not a Code Library surface and the current product has no production call to it. That helper also omits `redirect_uri` and PKCE from its token request. Do not assume the presence of this constant means Velox provides a complete or current authorization-code implementation.

#### Configuration and failure behavior

AuthURL, TokenURL and CallbackURL feed separate authenticator properties, but this selected branch uses the authorization endpoint only. A non-200 response raises its `error_description` when available, otherwise a generic OAuth exception. A 200 response without an access token does not itself raise here; the calling HTTP authentication path later treats a blank access token as an error.

Use this value only for an endpoint deliberately compatible with this non-standard direct-response behavior and only after a security review. For ordinary machine-to-machine access, use [`gtClientCredentials`](gtClientCredentials.md) when the provider supports it. A standards-compliant interactive authorization-code flow needs product implementation work and validation, including user-agent redirection, exact redirect handling, state/issuer checks and PKCE.

The example only selects the branch and was source-reviewed; no OAuth, browser, network, credential, runtime or image test ran.

**Related Code Library entries**

- [`gtAuto`](gtAuto.md) - provider-table selection and unresolved fallback.
- [`gtClientCredentials`](gtClientCredentials.md) - non-interactive client grant branch.
- [`TvxHTTP.GrantType`](../../Classes/HTTP/TvxHTTP/Properties/GrantType.md) - HTTP configuration property.

**External references**

- [RFC 6749 authorization-code grant](https://www.rfc-editor.org/rfc/rfc6749#section-4.1).
- [RFC 9700 authorization-code and PKCE guidance](https://www.rfc-editor.org/rfc/rfc9700#section-2.1.1).

<small>Created 2026-07-15</small>
