---
title: fatNetsuiteOAuth
description: Selects NetSuite OAuth client credentials using account-formatted endpoints and Velox's ES512 certificate assertion path.
sidebar_position: 49
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, authentication, oauth, netsuite, jwt, certificate]
---

```Delphi
fatNetsuiteOAuth = 5
```

### Example

```Delphi
procedure ConfigureNetSuiteOAuth(Client: TvxHTTP; const Account, CertificateFile: String);
begin
  Client.AuthType := fatNetsuiteOAuth;
  Client.Tenant := Account;
  Client.Certificate := CertificateFile;
  Client.GrantType := gtClientCredentials;
end;
```

### Usage

`fatNetsuiteOAuth` selects NetSuite OAuth client credentials using account-formatted endpoints and Velox's ES512 certificate assertion path.

### Additional Technical Info
`fatNetsuiteOAuth` is ordinal 5 of [`TvxAuthType`](../../Types/Enumerations/TvxAuthType.md). It selects the product's NetSuite-specific client-credentials implementation.

| Setting | Current source-defined default |
|---|---|
| Authorization endpoint | `https://%s.app.netsuite.com/app/login/oauth2/authorize.nl.` |
| Token endpoint | `https://%s.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token` |
| HTTP scope | `restlets,rest_webservices,suite_analytics` |
| SMTP/IMAP scope | blank |
| `gtAuto` provider grant | `gtClientCredentials` |

`Tenant` supplies the `%s` account value. The client-credentials branch does not send a normal client secret body for this member. It loads `Certificate` as ASCII signing material and creates an ES512 compact JWT with Issuer = ClientId, scope claim = Scope, audience = the account-specific token URL, issued-at = current local time, expiration = 59 minutes later, and key ID = ClientSecret. It then posts `client_assertion_type` plus the assertion.

#### Quirks and prerequisites

- In this path, `ClientSecret` is also used as the NetSuite certificate key ID. If Secret is blank, the generic configuration code falls back to Password, so document which property carries the key ID in the deployed configuration.
- Certificate is a file path loaded when the assertion is first needed. File existence, format, key algorithm and access rights are not validated when the constant is assigned.
- System clock accuracy matters because JWT issue/expiry claims are time based.
- The default scope is comma-separated source text. Confirm it matches the account's integration record and the exact NetSuite service being called.
- Tokens, certificate private material, key IDs and account identifiers must be protected. Do not embed a production path/secret in reusable script examples.
- Nonblank TokenURL/Scope overrides the preset, but the JWT audience is independently constructed from Tenant in `CreateNetsuiteJWTToken`; overriding TokenURL can therefore create an audience/endpoint mismatch. This is a material implementation quirk.

The example only configures fields and was source-reviewed; no certificate read, JWT signing, NetSuite, network or image-function test was executed.

**External references**

- [RFC 7523: JWT profiles for OAuth 2.0 client authentication](https://www.rfc-editor.org/rfc/rfc7523) - client-assertion model.
- [RFC 7518: JSON Web Algorithms](https://www.rfc-editor.org/rfc/rfc7518) - ES512 identifier and signing requirements.

<small>Created 2026-07-15</small>
