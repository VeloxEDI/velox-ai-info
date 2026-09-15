---
title: fatBasic
description: Selects username-and-password authentication, including HTTP Basic and the basic login paths exposed by supported Velox transports.
sidebar_position: 44
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, authentication, basic, username, password, tls]
---

```Delphi
fatBasic = 1
```

### Example

```Delphi
procedure ConfigureBasic(Client: TvxHTTP; const UserName, Password: String);
begin
  Client.AuthType := fatBasic;
  Client.Username := UserName;
  Client.Password := Password;
end;
```

### Usage

`fatBasic` selects username-and-password authentication, including HTTP Basic and the basic login paths exposed by supported Velox transports.

### Additional Technical Info
`fatBasic` is ordinal 1 of [`TvxAuthType`](../../Types/Enumerations/TvxAuthType.md). It selects a username/password authentication path; it does not encrypt the credentials and does not enable TLS.

For [`TvxHTTP`](../../Classes/HTTP/TvxHTTP.md), Velox selects Indy's `TIdBasicAuthentication`, copies `Username` and `Password` into the authentication object, and either waits for a challenge or pre-creates authentication according to `InProcessAuth`. HTTP Basic encodes the credential pair with Base64, which is reversible. Use it only through an authenticated TLS connection and never log the password or resulting Authorization header.

Transport behavior is surface-specific:

- FTP copies processed Username and Password only when `AuthType = fatBasic`.
- POP and IMAP use their direct user/password mode when Basic is selected and `UseSASL` is false; with SASL enabled, the provider table selects Login for SMTP and Plain for the other mail clients.
- Selecting the constant does not prove that a server permits the selected mechanism or that the configured transport exposes every related option.

The constant is a read-only value. Assignment changes the receiving object's authentication configuration; merely reading or comparing it has no side effect. Credential expansion, connection, challenge handling and failure logging occur later in the receiving client/transport.

#### Operational guidance and quirks

- Treat both Username and Password as secrets even when the username is not independently sensitive.
- Configure and validate TLS separately. Basic authentication over plaintext exposes reusable credentials.
- `fatBasic` is not OAuth password grant, API-key authentication or form fields. Some HTTP multipart code may add username/password form fields when `fatNone` is selected; that is application payload behavior, not HTTP Basic.
- Clear or destroy the client after a credential context changes. [`ClearAuthentication`](../../Classes/HTTP/TvxHTTP/Methods/ClearAuthentication.md) releases the current HTTP authentication object but does not erase every caller-held String copy.
- Do not persist ordinal 1 as an external protocol. Persist the name and validate it against the current product version.

The example only configures an object and was source-reviewed; no credential, server, network or image-function test was executed.

**Related Code Library entries**

- [`TvxHTTP.AuthType`](../../Classes/HTTP/TvxHTTP/Properties/AuthType.md) - receiving HTTP property and authentication timing.
- [`fatNone`](fatNone.md), [`fatBearer`](fatBearer.md) and [`fatWindows`](fatWindows.md) - anonymous, token and integrated alternatives.

**External references**

- [RFC 7617: The Basic HTTP Authentication Scheme](https://www.rfc-editor.org/rfc/rfc7617) - wire format and security considerations.

<small>Created 2026-07-15</small>
