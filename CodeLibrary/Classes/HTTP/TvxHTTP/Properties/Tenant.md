---
title: Tenant
description: Supplies the Microsoft tenant path or NetSuite account identifier interpolated into built-in OAuth endpoints and JWT audience.
sidebar_position: 28
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, oauth, tenant, microsoft, netsuite]
---

```Delphi
property Tenant: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.AuthType := fatMicrosoftOAuth;
  Http.Tenant := '00000000-0000-0000-0000-000000000000';
  Http.ClientId := 'velox-integration-client';
  Http.Secret := '<secret-from-approved-configuration>';
  Value := Http.Tenant;
end;
```

### Usage

Supplies the Microsoft tenant path or NetSuite account identifier interpolated into built-in OAuth endpoints and JWT audience.

### Additional Technical Info
`Tenant` defaults to an empty string and affects built-in OAuth provider templates:

- Microsoft inserts it as the path segment in both `login.microsoftonline.com/<Tenant>/oauth2/v2.0/authorize` and `/token`.
- NetSuite inserts it into the account-specific authorization/token hostnames and into the JWT `aud` value.
- Google and custom provider defaults do not contain a tenant placeholder, so the property has no direct effect unless other configuration uses it.

Velox interpolates the value with string formatting. It does not trim, percent-encode or validate it as a Microsoft tenant identifier, NetSuite account ID, DNS label or safe URI component. Treat it as administrator-controlled configuration, not input from a message, API caller or partner file.

For NetSuite, the source builds token endpoints beneath `<Tenant>.suitetalk.api.netsuite.com` and the JWT audience from the same value. A malformed or wrong account identifier can cause token failure or direct requests toward an unintended constructed authority. Use the exact account-specific value and endpoint documented by Oracle.

Explicit [`AuthURL`](AuthURL.md) and [`TokenURL`](TokenURL.md) override their corresponding built-in templates, but NetSuite JWT audience construction remains fixed from `Tenant`; an endpoint override does not update that audience. This can create an intentional endpoint/audience mismatch that the property surface cannot resolve.

Writing a new tenant does not invalidate an unexpired OAuth access token or cached NetSuite private key. Create a new `TvxHTTP` object when moving between tenants and never reuse an authenticated client across security domains.

**External references**

- [Microsoft identity platform OAuth 2.0 client-credentials flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow)
- [Oracle NetSuite OAuth 2.0 client-credentials flow](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_162730264820.html)

<small>Created 2026-07-15</small>
