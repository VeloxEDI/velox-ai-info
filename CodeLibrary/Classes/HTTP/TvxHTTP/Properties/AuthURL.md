---
title: AuthURL
description: Overrides the OAuth authorization endpoint used by the Velox HTTP client's authorization-code branch.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, oauth, authorization-endpoint]
---

```Delphi
property AuthURL: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.AuthType := fatCustomOAuth;
  Http.GrantType := gtAuthCode;
  Http.AuthURL := 'https://identity.example.invalid/oauth2/authorize';
  Http.TokenURL := 'https://identity.example.invalid/oauth2/token';
  Http.CallbackURL := 'https://client.example.invalid/oauth/callback';
  Value := Http.AuthURL;
end;
```

### Usage

`AuthURL` overrides the OAuth authorisation endpoint used by the Velox HTTP client's authorisation-code branch.

### Additional Technical Info
`AuthURL` supplies an explicit OAuth authorization endpoint. It defaults to an empty string. During OAuth configuration, a nonempty value is copied verbatim to the Embarcadero authenticator's `AuthorizationEndpoint`; an empty value selects the product's provider default:

| `AuthType` | Empty-value default in the reviewed source |
|---|---|
| `fatMicrosoftOAuth` | `https://login.microsoftonline.com/<Tenant>/oauth2/v2.0/authorize` |
| `fatGoogleOAuth` | `https://accounts.google.com/o/oauth2/auth` |
| `fatNetsuiteOAuth` | `https://<Tenant>.app.netsuite.com/app/login/oauth2/authorize.nl.` |
| `fatCustomOAuth` | Empty; a usable custom endpoint must be supplied for `gtAuthCode`. |

The NetSuite default is reproduced exactly: it has a trailing period after `authorize.nl`, unlike Oracle's published endpoint. Override it with the provider-approved account-specific URL rather than assuming the built-in string is valid.

Only [`gtAuthCode`](GrantType.md) reads the authorization endpoint. Client-credentials and password grants go directly to [`TokenURL`](TokenURL.md). The current `gtAuthCode` implementation is not a conventional interactive authorization-code flow: it performs a synchronous `TRESTClient` GET, expects a 200 response containing token JSON, and does not open a browser, receive a callback, validate returned state or execute its otherwise-present code-exchange method. It first obtains Embarcadero's `AuthorizationRequestURI`, which already contains response type and every nonempty client/redirect/scope/state parameter, then adds all five parameters again to the REST request. The resulting query can contain duplicate values. Providers that correctly return a login page or redirect are therefore unlikely to work through this branch without product changes.

Writing the property does not send a request and does not invalidate a retained OAuth token. An unexpired token can continue to be used after the URL changes. Configure a new `TvxHTTP` instance when changing OAuth authority, and never switch an existing authenticated client between security domains.

The endpoint is an unrestricted outbound destination reached with the Velox process's network authority. Treat it as trusted configuration, require `https`, allowlist the authority outside the script and protect it from user-controlled substitution. OAuth requires both TLS and server authentication; an endpoint string alone provides neither.

**External references**

- [RFC 6749 section 3.1: Authorization endpoint](https://www.rfc-editor.org/rfc/rfc6749#section-3.1)
- [RFC 6749 section 4.1: Authorization code grant](https://www.rfc-editor.org/rfc/rfc6749#section-4.1)
- [Embarcadero `TOAuth2Authenticator` properties](https://docwiki.embarcadero.com/Libraries/Athens/en/REST.Authenticator.OAuth.TOAuth2Authenticator_Properties)
- [Oracle NetSuite OAuth 2.0 authorization-code flow](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_158074210415.html)

<small>Created 2026-07-15</small>
