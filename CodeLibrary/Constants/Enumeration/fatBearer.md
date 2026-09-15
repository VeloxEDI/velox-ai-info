---
title: fatBearer
description: Selects direct bearer-token authentication using a token already supplied by the caller rather than acquiring one through Velox OAuth.
sidebar_position: 45
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, authentication, bearer, token, http, secret]
---

```Delphi
fatBearer = 2
```

### Example

```Delphi
procedure ConfigureBearer(Client: TvxHTTP; const AccessToken: String);
begin
  Client.AuthType := fatBearer;
  Client.Password := AccessToken;
end;
```

### Usage

`fatBearer` selects direct bearer-token authentication using a token already supplied by the caller rather than acquiring one through Velox OAuth.

### Additional Technical Info
`fatBearer` is ordinal 2 of [`TvxAuthType`](../../Types/Enumerations/TvxAuthType.md). In the current HTTP implementation it selects Indy's `TIdBearerAuthentication` and treats the configured `Password` value as the bearer credential. It does **not** call the Velox OAuth authenticator, discover endpoints, refresh a token or validate its expiry.

This makes the member appropriate when another trusted process has already acquired the exact token required by the target resource. The receiving client copies Username and Password into the authentication object; for bearer use, the significant value is Password. The token is applied during later request authentication, not when the enum is assigned.

#### Boundaries and safe use

- A bearer token grants its holder the token's authority. Protect it like a password in configuration, memory, logs, diagnostics and error reports.
- Validate the token's audience, scope, issuer and expiry in the system that obtains it. Velox does not parse those claims in this direct branch.
- Configure HTTPS separately. The authentication enum does not select TLS, validate certificates or prevent a token being sent to the wrong URL.
- Refresh and rotation remain the caller's responsibility. Reusing a `TvxHTTP` instance after changing the token may require [`ClearAuthentication`](../../Classes/HTTP/TvxHTTP/Methods/ClearAuthentication.md) so an existing authentication object cannot retain older state.
- Do not confuse this member with [`fatMicrosoftOAuth`](fatMicrosoftOAuth.md), [`fatGoogleOAuth`](fatGoogleOAuth.md), [`fatNetsuiteOAuth`](fatNetsuiteOAuth.md) or [`fatCustomOAuth`](fatCustomOAuth.md). Those branches acquire a token before supplying it to the same bearer handler.
- Mail provider-table entries for this member are Login/Plain rather than an OAuth SASL class. Treat direct bearer behavior as HTTP-specific unless the selected module's own documentation explicitly states otherwise.

The constant is read-only and constant-time to read/compare. Side effects arise only when a receiver configures or performs authentication. The example was source-reviewed and no token, network, OAuth or image-function test was executed.

**Related Code Library entries**

- [`TvxHTTP.AuthType`](../../Classes/HTTP/TvxHTTP/Properties/AuthType.md) - selects the authentication branch.
- [`TvxHTTP.Password`](../../Classes/HTTP/TvxHTTP/Properties/Password.md) - current bearer-token carrier.
- [`fatNone`](fatNone.md) and [`fatBasic`](fatBasic.md) - no-authentication and password alternatives.

**External references**

- [RFC 6750: OAuth 2.0 Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750) - token transport and protection requirements.

<small>Created 2026-07-15</small>
