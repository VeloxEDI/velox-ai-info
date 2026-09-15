---
title: Username
description: Stores the Basic or Windows account name and the resource-owner username used by the legacy OAuth password grant.
sidebar_position: 31
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, username, authentication, oauth]
---

```Delphi
property Username: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ClearAuthentication;
  Http.AuthType := fatBasic;
  Http.Username := 'integration-user';
  Http.Password := '<secret-from-approved-configuration>';
  Value := Http.Username;
end;
```

### Usage

Stores the Basic or Windows account name and the resource-owner username used by the legacy OAuth password grant.

### Additional Technical Info
`Username` defaults to an empty string. Its meaning depends on authentication mode:

- `fatBasic` supplies the Basic authentication user ID;
- `fatWindows` supplies the account name alongside [`Domain`](Domain.md) and [`Password`](Password.md);
- `fatBearer` assigns it to the authentication object, but Velox's bearer header uses only `Password`; and
- OAuth `gtPassword` sends it as the resource-owner username. Other OAuth grants retain it but do not normally send it.

The password-grant body is built by raw string concatenation and emits the name as capitalised `Username`, not RFC 6749's lowercase `username`. Velox does not percent-encode the value, so form-significant characters can change parsing. This branch is a legacy, high-trust credential flow and may be rejected by standards-conformant providers.

Writing the property does not update an existing compatible authentication object. For Basic or Windows, set all fields then call [`ClearAuthentication`](../Methods/ClearAuthentication.md) if the client was previously used. An unexpired OAuth token survives that clear, so use a new HTTP object after changing OAuth resource-owner or client identity.

Although usernames are often less sensitive than passwords, they are still account and personal data. They can enter Basic headers, token request bodies and raw HTTP logs. Use a dedicated least-privilege integration identity, do not derive it from untrusted content, and avoid returning or logging it unnecessarily.

**External references**

- [RFC 7617: The Basic HTTP Authentication Scheme](https://www.rfc-editor.org/rfc/rfc7617)
- [RFC 6749 section 4.3.2: Password-grant access-token request](https://www.rfc-editor.org/rfc/rfc6749#section-4.3.2)
- [RFC 9700 section 2.4: Resource-owner password credentials grant](https://www.rfc-editor.org/rfc/rfc9700#section-2.4)

<small>Created 2026-07-15</small>
