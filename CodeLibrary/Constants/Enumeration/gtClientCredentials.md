---
title: gtClientCredentials
description: Requests an OAuth token for the client itself using Velox's form-body or NetSuite certificate-assertion branch.
sidebar_position: 143
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, oauth, client-credentials, token, service-account]
---

```Delphi
gtClientCredentials = 2
```

### Example

```Delphi
procedure ConfigureServiceGrant(Client: TvxHTTP);
begin
  Client.GrantType := gtClientCredentials;
end;
```

### Usage

`gtClientCredentials` requests an OAuth token for the client itself using Velox's form-body or NetSuite certificate-assertion branch.

### Additional Technical Info
`gtClientCredentials` is ordinal 2 of [`TvxGrantType`](../../Types/Enumerations/TvxGrantType.md). It selects a non-interactive token request in which the OAuth client acts on its own behalf, not as an interactive end user. It is also the current provider-table default for Microsoft, Google, NetSuite, Windows and legacy NTLM entries, although endpoint support and provider configuration remain decisive.

#### Standard form branch

The routine requires non-empty ClientId and ClientSecret. If the configured Secret is empty, Velox previously substitutes Password as ClientSecret. It posts an `application/x-www-form-urlencoded` body containing:

```text
grant_type=client_credentials&client_id=<ClientId>&client_secret=<ClientSecret>&scope=<Scope>
```

Velox constructs that body by direct string concatenation. It does not percent-encode ClientId, ClientSecret or Scope at this point. Reserved characters such as `&`, `=`, `+` or `%` can therefore change the form data received by the server. Use values known to be safe for this implementation or treat the configuration as incompatible until the product encodes each field correctly.

#### NetSuite certificate branch

For `fatNetsuiteOAuth`, Velox does not send client ID/secret/scope fields in the form. It loads the configured Certificate file as ASCII, creates an ES512-signed JWT with issuer ClientId, scope, a NetSuite tenant token-endpoint audience, issue time and an expiry 59 minutes later, and places ClientSecret in the JWT `kid` header as the NetSuite certificate ID. The form contains `grant_type=client_credentials`, the JWT-bearer assertion type and the compact assertion.

The assertion audience is built from Tenant using Velox's fixed NetSuite URL pattern even when a custom TokenURL overrides the endpoint used for the HTTP POST. If those URLs differ, the token service can reject the assertion for an audience mismatch.

Certificate path access, private-key protection, tenant/account value, certificate ID, clock accuracy and NetSuite registration must all be correct. The generated assertion is cached only indirectly through loaded certificate data; token and certificate rotation still require operational care.

#### Response and lifecycle

On a successful JSON response, Velox stores `access_token`, optional `refresh_token`, `id_token`, `token_type` and `expires_in`. Missing or invalid expiry becomes zero, so the next authorization check treats the token as expired and requests again. Error JSON uses `error_description` when parseable. The access token is later supplied as a Bearer credential by the HTTP/transport path.

Do not use client credentials where user delegation or per-user consent is required. Grant only the scopes needed by the integration, keep secrets/private keys out of scripts and logs, and require validated TLS and server identity independently.

The example only selects the branch and was source-reviewed; no OAuth, token-endpoint, certificate, network, credential, runtime or image test ran.

**Related Code Library entries**

- [`gtAuto`](gtAuto.md) - provider-default selection and fallback behavior.
- [`gtAuthCode`](gtAuthCode.md) - current direct authorization-endpoint branch.
- [`TvxHTTP.ClientId`](../../Classes/HTTP/TvxHTTP/Properties/ClientId.md) - client identity.
- [`TvxHTTP.Secret`](../../Classes/HTTP/TvxHTTP/Properties/Secret.md) - preferred client secret input.

**External references**

- [RFC 6749 client-credentials grant](https://www.rfc-editor.org/rfc/rfc6749#section-4.4).

<small>Created 2026-07-15</small>
