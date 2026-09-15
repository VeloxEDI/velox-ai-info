---
title: Password
description: Stores the credential whose meaning changes between HTTP password, bearer token, OAuth fallback secret and resource-owner password modes.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, password, bearer-token, oauth, secret]
---

```Delphi
property Password: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ClearAuthentication;
  Http.AuthType := fatBearer;
  Http.Password := '<bearer-token-from-approved-secret-store>';
  Http.Get('https://api.example.invalid/v1/status');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

Stores the credential whose meaning changes between HTTP password, bearer token, OAuth fallback secret and resource-owner password modes.

### Additional Technical Info
`Password` defaults to an empty string and is retained in memory as an ordinary Delphi string. Its meaning depends on [`AuthType`](AuthType.md) and [`GrantType`](GrantType.md):

| Mode | Meaning and use |
|---|---|
| `fatBasic` | Password used by HTTP Basic authentication. |
| `fatBearer` | Complete bearer access token; Velox emits `Authorization: Bearer ` followed by this value. |
| `fatWindows` | Password supplied to Indy's SSPI/NTLM object alongside username and domain. |
| OAuth with blank [`Secret`](Secret.md) | Fallback OAuth `ClientSecret`. This fallback applies even when the same value also has another role. |
| OAuth `gtPassword` | Resource-owner password sent to the token endpoint, as well as the fallback client secret when `Secret` is blank. |

The OAuth password-grant body is built by direct concatenation. This value is not percent-encoded, and the parameter is emitted as capitalised `Password` rather than RFC 6749's lowercase `password`. Characters such as `&`, `=`, `+` and `%` can change parsing. The grant also places client and resource-owner credentials in the request body and should be treated as legacy compatibility, not a preferred design.

Writing a new value does not update a compatible authentication object that already exists. Call [`ClearAuthentication`](../Methods/ClearAuthentication.md) before applying a changed Basic, bearer or Windows credential. For OAuth, that method does not invalidate an unexpired cached token; use a fresh `TvxHTTP` object when rotating identity or secret material.

The property does not encrypt, mask or zero the value. It can also appear in the raw intercepted request when HTTP communication logging is enabled. Never embed a real credential in script source, log it, return it through `Value` or send it over an unauthenticated channel. The reviewed local HTTPS handler does not validate the peer certificate, so it does not presently provide the server-authentication guarantee required for transmitting these credentials.

**External references**

- [RFC 7617: The Basic HTTP Authentication Scheme](https://www.rfc-editor.org/rfc/rfc7617)
- [RFC 6750 section 2.1: Authorization request header](https://www.rfc-editor.org/rfc/rfc6750#section-2.1)
- [RFC 6749 section 4.3: Resource-owner password credentials](https://www.rfc-editor.org/rfc/rfc6749#section-4.3)
- [RFC 9700 section 2.4: Resource-owner password credentials grant](https://www.rfc-editor.org/rfc/rfc9700#section-2.4)

<small>Created 2026-07-15</small>
