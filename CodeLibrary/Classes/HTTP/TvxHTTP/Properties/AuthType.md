---
title: AuthType
description: Selects the authentication scheme that the Velox HTTP client applies to requests, including Basic, bearer, OAuth and Windows SSPI modes.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, authentication, oauth, bearer]
---

```Delphi
property AuthType: TvxAuthType read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ClearAuthentication;
  Http.AuthType := fatBasic;
  Http.Username := 'integration-user';
  Http.Password := '<secret-from-approved-configuration>';
  Http.Get('https://api.example.invalid/v1/status');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`AuthType` selects the authentication scheme that the Velox HTTP client applies to requests, including Basic, bearer, OAuth and Windows SSPI modes.

### Additional Technical Info
`AuthType` selects the authentication class and credential flow used before or during a request. A new `TvxHTTP` starts with `fatNone`. The script-facing [`TvxAuthType`](../../../../Types/Enumerations/TvxAuthType.md) has exactly these values:

| Value | Current HTTP behavior |
|---|---|
| `fatNone` | Removes Velox's authorization callbacks and current authentication object and clears Indy's current request username and password. |
| `fatBasic` | Uses HTTP Basic authentication with [`Username`](Username.md) and [`Password`](Password.md). Basic is an encoding scheme, not encryption. |
| `fatBearer` | Uses Velox's bearer class and emits `Authorization: Bearer <Password>`. `Username` is assigned internally but is not used to form the header. |
| `fatMicrosoftOAuth` | Acquires an OAuth access token using Microsoft defaults, then sends it as a bearer token. |
| `fatGoogleOAuth` | Acquires an OAuth access token using Google defaults, then sends it as a bearer token. |
| `fatNetsuiteOAuth` | Builds a NetSuite ES512 client assertion, obtains an access token and sends it as a bearer token. |
| `fatCustomOAuth` | Uses the supplied OAuth endpoints and options, then sends the resulting access token as a bearer token. |
| `fatWindows` | Uses Indy's Windows SSPI/NTLM authentication class with username, password and optional [`Domain`](Domain.md). |

The native product enum also contains `fatNTLM`, but Pascal Script does not register that value. Do not use it in scripts. Server `WWW-Authenticate` alternatives do not choose the scheme while Velox local authentication is enabled: Velox explicitly selects the class from `AuthType`.

With the default [`InProcessAuth`](InProcessAuth.md) value of `False`, Velox attempts to prepare authentication before the first resource request. With `True`, the endpoint must first return 401 before the handler supplies credentials or obtains an OAuth token. OAuth acquisition uses [`GrantType`](GrantType.md), client/tenant/endpoint fields and the shared authenticator described on those property pages.

Writing this property only changes a Velox field. It does not reset `FAuthed`, discard a compatible existing authentication object or invalidate an unexpired OAuth access token. In particular, `fatBearer` and every OAuth value use the same bearer authentication class, so switching among them does not itself force object replacement. Set all authentication fields before first use. For Basic, bearer and Windows changes, call [`ClearAuthentication`](../Methods/ClearAuthentication.md) before the next request. For changed OAuth identity, endpoints or secrets, create a fresh HTTP client where possible: `ClearAuthentication` does not clear the retained OAuth access token.

`fatNone` disables Velox-managed resource authentication; it is not a policy that forbids every authorization header. A script can still set `Header['Authorization']`, and URL userinfo is parsed after Velox clears Indy's username/password. If a server then challenges, Indy can select a supported authentication class using that URL-supplied credential. Reject URL userinfo and explicit authorization headers when the intended policy is no authentication.

Automatic redirects retain Indy's request authentication object. The same Basic, bearer/OAuth or negotiated authentication can therefore be emitted to a redirected authority. Disable [`HandleRedirects`](HandleRedirects.md) for authenticated calls unless every possible target is within the same approved trust boundary.

When a host injects an HTTP transport and disables local authentication, `ConfigureAuthentication` returns before using these fields; the host transport's configuration is then authoritative. The normal script-created/helper-owned local client uses the behavior above.

Basic, bearer tokens and password-based authentication require a correctly authenticated TLS channel. The reviewed local SSL setup does not enable certificate-chain or server-identity verification, so these modes must not be treated as securely protected merely because the URL begins with `https`.

**External references**

- [RFC 7617: The Basic HTTP Authentication Scheme](https://www.rfc-editor.org/rfc/rfc7617)
- [RFC 6750 section 2.1: Bearer authentication request header](https://www.rfc-editor.org/rfc/rfc6750#section-2.1)
- [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)

<small>Created 2026-07-15</small>
