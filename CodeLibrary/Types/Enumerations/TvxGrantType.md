---
title: TvxGrantType
description: Selects automatic, authorization-code, client-credentials or resource-owner-password OAuth token acquisition.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, oauth, grant, token, authentication]
---

```Delphi
TvxGrantType = (gtAuto, gtAuthCode, gtClientCredentials, gtPassword)
```

### Example

```Delphi
procedure ConfigureServiceOAuth(Client: TvxHTTP);
begin
  Client.GrantType := gtClientCredentials;
end;
```

### Usage

`TvxGrantType` selects automatic, authorisation-code, client-credentials or resource-owner-password OAuth token acquisition.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| [`gtAuto`](../../Constants/Enumeration/gtAuto.md) | 0 | Substitute the local provider-table default. Unresolved Auto falls through to the client-credentials routine. |
| [`gtAuthCode`](../../Constants/Enumeration/gtAuthCode.md) | 1 | Run Velox's direct authorization-endpoint GET branch; this is not currently a complete authorization-code flow. |
| [`gtClientCredentials`](../../Constants/Enumeration/gtClientCredentials.md) | 2 | Request a token using the client identity/secret or the NetSuite certificate-assertion branch. |
| [`gtPassword`](../../Constants/Enumeration/gtPassword.md) | 3 | Send resource-owner credentials using the prohibited legacy password-grant branch. |

#### Behavior and boundaries

- If a refresh token exists and the access token is expired, refresh is attempted before the selected branch. However, every call to `Configure` clears the refresh token, so reconfiguration discards it.
- `gtAuto` is not discovery from an OAuth server. It is a local provider-table choice; unresolved Auto calls the client-credentials routine, which does not reject the stored Auto value solely for being Auto.
- The current `gtAuthCode` routine directly GETs the authorization endpoint and expects tokens in a 200 response. It does not run a user-agent redirect/callback/code exchange, validate returned state or use PKCE. Do not treat it as a standards-complete authorization-code client.
- The client-credentials and password bodies are assembled without percent-encoding field values. Reserved characters can corrupt the request. The password branch also sends capitalized `Username`/`Password` names and masks detailed failures.
- `gtClientCredentials` represents the client, not an end user. Do not use it when user delegation is required. The NetSuite path uses an ES512 client assertion built from the configured certificate.
- `gtPassword` must not be used under current OAuth security guidance. Its presence is legacy compatibility metadata, not a recommendation.

### Additional Technical Info
`TvxGrantType` controls which token-acquisition branch `TvxOAuth2Authenticator` uses after any usable refresh token has been tried. It applies only to OAuth-capable authentication types.

`gtAuto` is resolved from the selected provider's `SASLProviders` entry during configuration. Microsoft, Google and NetSuite currently default to client credentials; a custom OAuth provider's configured default remains `gtAuto`.

**Related Code Library entries**

- [TvxHTTP.GrantType](../../Classes/HTTP/TvxHTTP/Properties/GrantType.md) - direct OAuth flow property.
- [TvxHTTP.AuthType](../../Classes/HTTP/TvxHTTP/Properties/AuthType.md) - provider/authentication selection.
- [TvxHTTP.ClientId](../../Classes/HTTP/TvxHTTP/Properties/ClientId.md) - client identity input.
- [TvxHTTP.Secret](../../Classes/HTTP/TvxHTTP/Properties/Secret.md) - client secret input.

**External references**

- [RFC 6749 grant types](https://www.rfc-editor.org/rfc/rfc6749#section-1.3) - OAuth 2.0 grant model.
- [RFC 9700 OAuth security BCP](https://www.rfc-editor.org/rfc/rfc9700) - current security guidance, including password-grant prohibition.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
