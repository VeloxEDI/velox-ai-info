---
title: fatMicrosoftOAuth
description: Selects Microsoft OAuth with tenant-formatted v2 endpoints, XOAUTH2 for mail and surface-specific default scopes.
sidebar_position: 48
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, authentication, oauth, microsoft, tenant, graph, mail]
---

```Delphi
fatMicrosoftOAuth = 3
```

### Example

```Delphi
procedure ConfigureMicrosoftOAuth(Client: TvxHTTP; const Tenant: String);
begin
  Client.AuthType := fatMicrosoftOAuth;
  Client.Tenant := Tenant;
  Client.GrantType := gtClientCredentials;
end;
```

### Usage

`fatMicrosoftOAuth` selects Microsoft OAuth with tenant-formatted v2 endpoints, XOAUTH2 for mail and surface-specific default scopes.

### Additional Technical Info
`fatMicrosoftOAuth` is ordinal 3 of [`TvxAuthType`](../../Types/Enumerations/TvxAuthType.md). It selects Microsoft provider defaults and XOAUTH2 for supported mail surfaces.

| Setting | Current source-defined default |
|---|---|
| Authorization endpoint | `https://login.microsoftonline.com/%s/oauth2/v2.0/authorize` |
| Token endpoint | `https://login.microsoftonline.com/%s/oauth2/v2.0/token` |
| Logout endpoint | `https://login.microsoftonline.net/%s/oauth2/v2.0/logout` |
| SMTP/IMAP/POP scope | `https://outlook.office365.com/.default` |
| HTTP scope | `https://graph.microsoft.com/.default` |
| `gtAuto` provider grant | `gtClientCredentials` |
| Mail SASL mechanism | XOAUTH2 |

Velox substitutes `Tenant` into every `%s` endpoint. A blank or wrong tenant therefore produces a malformed/wrong authority URL rather than a configuration-time error. Nonblank AuthURL, TokenURL and Scope override the preset. POP also disables SASL initial response for this member as a source-level Microsoft interoperability workaround.

#### Configuration and security boundaries

- Client-credentials tokens represent an application, not an interactive user. Ensure the target API/mail protocol and tenant permissions support application access.
- The `.default` scopes request statically configured application permissions. They do not grant permission by themselves; administrator consent and service-side policy remain external prerequisites.
- For delegated access, explicitly select the required grant, callback and delegated scopes. Do not rely on the `gtAuto` default.
- ClientId, Secret/Password, Tenant, tokens and certificate material are sensitive. Avoid logging them and rotate them under the tenant's policy.
- Authentication does not configure TLS, validate the target resource URL or verify that a returned token's audience matches the eventual request.

The constant only selects configuration. Token acquisition occurs on authentication and can be retried/refreshed according to the authenticator state. The example was source-reviewed; no tenant, mail, Graph, network or image-function test was executed.

**Related Code Library entries**

- [`TvxHTTP.Tenant`](../../Classes/HTTP/TvxHTTP/Properties/Tenant.md), [`ClientId`](../../Classes/HTTP/TvxHTTP/Properties/ClientId.md), [`Secret`](../../Classes/HTTP/TvxHTTP/Properties/Secret.md), [`GrantType`](../../Classes/HTTP/TvxHTTP/Properties/GrantType.md) and [`Scope`](../../Classes/HTTP/TvxHTTP/Properties/Scope.md).

**External references**

- [Microsoft identity platform client-credentials flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow) - application-token and `.default` behavior.
- [RFC 6749: OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749) - protocol framework.

<small>Created 2026-07-15</small>
