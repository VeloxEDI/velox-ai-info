---
title: TokenURL
description: Overrides the OAuth token endpoint used by client-credentials, password and dormant exchange or refresh branches.
sidebar_position: 29
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, oauth, token-endpoint, access-token]
---

```Delphi
property TokenURL: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.AuthType := fatCustomOAuth;
  Http.GrantType := gtClientCredentials;
  Http.TokenURL := 'https://identity.example.invalid/oauth2/token';
  Http.ClientId := 'velox-integration-client';
  Http.Secret := '<secret-from-approved-configuration>';
  Value := Http.TokenURL;
end;
```

### Usage

`TokenURL` overrides the OAuth token endpoint used by client-credentials, password and dormant exchange or refresh branches.

### Additional Technical Info
`TokenURL` supplies an explicit OAuth access-token endpoint. It defaults to empty. A nonempty value is copied verbatim; empty selects the provider table's current default:

| `AuthType` | Empty-value default in the reviewed source |
|---|---|
| `fatMicrosoftOAuth` | `https://login.microsoftonline.com/<Tenant>/oauth2/v2.0/token` |
| `fatGoogleOAuth` | `https://accounts.google.com/o/oauth2/token` |
| `fatNetsuiteOAuth` | `https://<Tenant>.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token` |
| `fatCustomOAuth` | Empty; supply a usable endpoint. |

[`gtClientCredentials`](GrantType.md) and `gtPassword` post directly to this endpoint using a newly created nested `TvxHTTP`. The ordinary branch concatenates form values without percent-encoding; the NetSuite branch posts a signed JWT assertion. The nested HTTP client performs no automatic authentication but has the same local TLS certificate-validation gap as this class.

The OAuth class also contains refresh-token and authorization-code exchange routines that use Embarcadero `TRESTClient`. In the normal `TvxHTTP` path, every call to `Configure` clears `RefreshToken`, and the selected authorization-code routine never calls the exchange method. Those branches therefore do not provide a working refresh/code-exchange lifecycle here. Token responses without a valid `expires_in` are assigned expiry zero and trigger another original-grant acquisition next time; a future expiry paired with a blank token instead suppresses another attempt until the expiry passes.

Changing `TokenURL` does not clear the cached `AccessToken` or expiry. A still-valid token can continue to be sent after the endpoint changes. Use a new `TvxHTTP` object when changing provider, tenant, token endpoint or client identity.

This is an unrestricted outbound destination reached with the Velox process's network authority and supplied with high-value credentials. Require a fixed allowlisted HTTPS endpoint under the expected provider authority. OAuth explicitly requires TLS with authenticated server identity; the reviewed nested Velox helper does not currently meet that verification requirement.

**External references**

- [RFC 6749 section 3.2: Token endpoint](https://www.rfc-editor.org/rfc/rfc6749#section-3.2)
- [RFC 6749 section 10.9: Ensuring endpoint authenticity](https://www.rfc-editor.org/rfc/rfc6749#section-10.9)
- [Embarcadero `TOAuth2Authenticator` properties](https://docwiki.embarcadero.com/Libraries/Athens/en/REST.Authenticator.OAuth.TOAuth2Authenticator_Properties)
- [Oracle NetSuite access-token request example](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_0907012935.html)

<small>Created 2026-07-15</small>
