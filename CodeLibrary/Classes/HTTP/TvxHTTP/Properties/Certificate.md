---
title: Certificate
description: Names the private-key file used to sign NetSuite OAuth client assertions, despite the property's certificate-oriented name.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, oauth, netsuite, private-key, certificate]
---

```Delphi
property Certificate: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.AuthType := fatNetsuiteOAuth;
  Http.GrantType := gtClientCredentials;
  Http.Certificate := 'C:\ProgramData\Velox\Secrets\netsuite-private-key.pem';
  Value := Http.Certificate;
end;
```

### Usage

Names the private-key file used to sign NetSuite OAuth client assertions, despite the property's certificate-oriented name.

### Additional Technical Info
`Certificate` defaults to an empty string and is consulted only by the NetSuite OAuth client-credentials path. Despite its name, the value is a filename from which Velox loads the private signing key. The matching public certificate is what an administrator uploads to NetSuite.

When the first NetSuite assertion is needed, the authenticator reads the entire file as ASCII and caches the resulting key text. It then creates a JWT with:

- `iss` set to [`ClientId`](ClientId.md);
- `scope` set to [`Scope`](Scope.md);
- `aud` fixed from [`Tenant`](Tenant.md) as the NetSuite token endpoint;
- issue time `Now` and expiry 59 minutes later;
- `kid` set from [`Secret`](Secret.md); and
- an ES512 signature made with the cached file content.

The cache is not keyed by filename. Changing `Certificate` after the first assertion does not clear the cached key, and [`ClearAuthentication`](../Methods/ClearAuthentication.md) does not clear it either. Use a new `TvxHTTP` object after rotating or changing the key file.

The file is opened using the Velox process account and can therefore expose any readable file if the path is untrusted. Keep it outside script/source repositories, restrict its ACL to the service identity and administrators, and obtain the path from approved protected configuration. The key is retained as a managed string and is not explicitly zeroed. Missing, unreadable or malformed key material raises during authentication before the resource request.

This property does not configure the TLS client certificate used for HTTPS, and it does not repair the HTTP helper's absent server-certificate validation. It is solely NetSuite JWT signing material.

**External references**

- [RFC 7523 section 2.2: JWTs for OAuth client authentication](https://www.rfc-editor.org/rfc/rfc7523#section-2.2)
- [Oracle NetSuite OAuth 2.0 client-credentials flow](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_162730264820.html)
- [Oracle NetSuite example for creating and exchanging the signed JWT](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_0907012935.html)

<small>Created 2026-07-15</small>
