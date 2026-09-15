---
title: Secret
description: Stores the OAuth client secret or NetSuite certificate key identifier used during access-token acquisition.
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, oauth, client-secret, netsuite]
---

```Delphi
property Secret: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.AuthType := fatCustomOAuth;
  Http.GrantType := gtClientCredentials;
  Http.ClientId := 'velox-integration-client';
  Http.Secret := '<secret-from-approved-configuration>';
  Http.TokenURL := 'https://identity.example.invalid/oauth2/token';
end;
```

### Usage

Stores the OAuth client secret or NetSuite certificate key identifier used during access-token acquisition.

### Additional Technical Info
`Secret` defaults to an empty string and is used only by OAuth modes. For Microsoft, Google and custom OAuth it becomes the authenticator's `ClientSecret`. If it is empty, Velox silently substitutes [`Password`](Password.md), so a password or bearer-style credential can acquire a second meaning.

The client-credentials and password branches place the effective client secret in a raw `application/x-www-form-urlencoded` body assembled by string concatenation. Velox does not percent-encode it. A secret containing `&`, `=`, `+`, `%` or similar characters can be misparsed or alter adjacent parameters.

For `fatNetsuiteOAuth`, this property has a different meaning: it is written to the JWT header as `kid`, the certificate identifier assigned by NetSuite. The actual private signing key comes from [`Certificate`](Certificate.md). The client-credentials branch still requires the effective `ClientSecret` to be nonblank before it generates the assertion, so the NetSuite certificate ID is also used to satisfy that check.

Writing a new secret does not clear the current authentication object or a still-valid OAuth access token. Even [`ClearAuthentication`](../Methods/ClearAuthentication.md) retains the OAuth token. Create a new `TvxHTTP` object after rotating the client secret, NetSuite certificate ID or OAuth identity.

The value is an ordinary managed string with no masking, encryption or explicit zeroing. It may enter raw HTTP communication logs during token acquisition. Load it from approved protected configuration, grant it only the required OAuth client permissions, never return or log it, and rotate it according to provider policy.

**External references**

- [RFC 6749 section 2.3.1: Client password](https://www.rfc-editor.org/rfc/rfc6749#section-2.3.1)
- [RFC 6749 section 10.1: Client authentication](https://www.rfc-editor.org/rfc/rfc6749#section-10.1)
- [Oracle NetSuite client-credentials setup and certificate requirements](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_162730264820.html)

<small>Created 2026-07-15</small>
