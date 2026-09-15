---
title: TvxAuthType
description: Selects no authentication, Basic, bearer, provider OAuth, custom OAuth or Windows SSPI for Velox HTTP and transport clients.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, authentication, http, oauth, basic, bearer, windows]
---

```Delphi
TvxAuthType = (fatNone, fatBasic, fatBearer, fatMicrosoftOAuth, fatGoogleOAuth, fatNetsuiteOAuth, fatCustomOAuth, fatWindows)
```

### Example

```Delphi
procedure ConfigureBearer(Client: TvxHTTP; const Token: String);
begin
  Client.AuthType := fatBearer;
  Client.Password := Token;
end;
```

### Usage

`TvxAuthType` selects no authentication, Basic, bearer, provider OAuth, custom OAuth or Windows SSPI for Velox HTTP and transport clients.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| `fatNone` | 0 | Disable the local authentication callbacks and clear request credentials. |
| `fatBasic` | 1 | Use HTTP Basic authentication with Username and Password. |
| `fatBearer` | 2 | Use Velox's bearer handler; current `TvxHTTP` supplies Password as the bearer token. |
| `fatMicrosoftOAuth` | 3 | Acquire/use a Microsoft OAuth token through the Velox OAuth authenticator. |
| `fatGoogleOAuth` | 4 | Acquire/use a Google OAuth token. |
| `fatNetsuiteOAuth` | 5 | Acquire/use a NetSuite OAuth token, including its provider-specific client-assertion path. |
| `fatCustomOAuth` | 6 | Use caller-supplied OAuth endpoints and settings. |
| `fatWindows` | 7 | Use Windows SSPI/NTLM authentication and optional Domain. |

#### Behavior and boundaries

- `fatBasic` sends a reversible base64 credential representation and is safe only over authenticated TLS.
- `fatBearer` does not obtain a token; the current client passes `Password` to the bearer authentication object. Protect that property as a secret.
- Provider/custom OAuth members select bearer authentication but first call `TvxOAuth2Authenticator`; required Tenant, ClientId, Secret, Scope, endpoints and GrantType vary.
- `fatWindows` selects `TIdSSPINTLMAuthentication`. The Velox legacy `fatNTLM` is normalized to `fatWindows` in some product copy paths but is not script-visible.
- When `InProcessAuth` is false, Velox pre-creates authentication so credentials can go with the first request; when true, challenge handling controls the exchange.
- Authentication selection does not configure TLS. Set and verify transport security separately.

### Additional Technical Info
`TvxAuthType` selects the authentication handler used by `TvxHTTP` and related transports. The meaning of credential properties depends on the selected member.

The product's native enum contains a ninth trailing member, `fatNTLM`, labelled old. The PascalScript importer deliberately/accidentally stops at `fatWindows`; scripts cannot name `fatNTLM`. Shared members keep the same ordinals because the omission is trailing.

**Related Code Library entries**

- [TvxHTTP.AuthType](../../Classes/HTTP/TvxHTTP/Properties/AuthType.md) - direct selection property.
- [TvxHTTP.GrantType](../../Classes/HTTP/TvxHTTP/Properties/GrantType.md) - OAuth flow selection.
- [TvxHTTP.ClearAuthentication](../../Classes/HTTP/TvxHTTP/Methods/ClearAuthentication.md) - discard current authentication state.
- [TvxHTTP.SSLClientType](../../Classes/HTTP/TvxHTTP/Properties/SSLClientType.md) - separate TLS protocol setting.

**External references**

- [RFC 7617 Basic authentication](https://www.rfc-editor.org/rfc/rfc7617) - Basic authentication and security considerations.
- [RFC 6750 bearer tokens](https://www.rfc-editor.org/rfc/rfc6750) - bearer-token usage and protection.
- [RFC 6749 OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749) - OAuth authorization framework.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
