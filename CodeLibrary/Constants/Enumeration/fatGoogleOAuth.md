---
title: fatGoogleOAuth
description: Selects Google OAuth using Velox's built-in Google endpoints and mail/openid scope defaults.
sidebar_position: 47
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, authentication, oauth, google, scope, token]
---

```Delphi
fatGoogleOAuth = 4
```

### Example

```Delphi
procedure ConfigureGoogleOAuth(Client: TvxHTTP);
begin
  Client.AuthType := fatGoogleOAuth;
  Client.GrantType := gtAuthCode;
  Client.Scope := 'https://www.googleapis.com/auth/userinfo.email openid';
end;
```

### Usage

`fatGoogleOAuth` selects Google OAuth using Velox's built-in Google endpoints and mail/openid scope defaults.

#### Important compatibility boundary

With `gtAuto`, Velox selects client credentials for Google. Google user-data and mail access commonly requires an interactive or user-authorised flow instead. Do not assume that the Velox default is accepted by the chosen Google API or Workspace policy. Select and test the provider-approved grant, consent, account and scope configuration; an explicit `gtAuthCode` is shown only as a configuration example, not as a universal prescription.

Velox does not validate consent configuration when this member is assigned. Missing ClientId/Secret, a rejected grant, scope mismatch, callback mismatch or provider policy failure appears during authorization. Tokens and credentials are secrets, and HTTPS/certificate validation remains a separate transport responsibility.

`fatGoogleOAuth` is a provider preset, not a guarantee that every Google API is supported. The default HTTP scope is mail/openid-oriented, so override it for a different resource and verify the returned token's audience and scopes.

### Additional Technical Info
`fatGoogleOAuth` is ordinal 4 of [`TvxAuthType`](../../Types/Enumerations/TvxAuthType.md). Velox supplies these current defaults when the corresponding property is blank:

| Setting | Source-defined default |
|---|---|
| Authorization endpoint | `https://accounts.google.com/o/oauth2/auth` |
| Token endpoint | `https://accounts.google.com/o/oauth2/token` |
| Logout endpoint | `https://www.google.com/accounts/Logout` |
| SMTP/IMAP/POP/HTTP scope | `https://mail.google.com/ openid` |
| `gtAuto` provider grant | `gtClientCredentials` |
| Mail SASL mechanism | XOAUTH2 |

Nonblank AuthURL, TokenURL and Scope override the table. After acquisition Velox supplies the access token to bearer/XOAuth2 authentication.

**Related Code Library entries**

- [`TvxHTTP.GrantType`](../../Classes/HTTP/TvxHTTP/Properties/GrantType.md), [`Scope`](../../Classes/HTTP/TvxHTTP/Properties/Scope.md) and [`CallbackURL`](../../Classes/HTTP/TvxHTTP/Properties/CallbackURL.md).
- [`fatCustomOAuth`](fatCustomOAuth.md) - explicit provider contract without Google defaults.

**External references**

- [Google OAuth 2.0 for web-server applications](https://developers.google.com/identity/protocols/oauth2/web-server) - provider flow and consent requirements.
- [RFC 6749: OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749) - protocol framework.

<small>Created 2026-07-15</small>
