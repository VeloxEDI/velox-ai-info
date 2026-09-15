---
title: ClientId
description: Sets the OAuth client identifier used in token requests, authorization requests and NetSuite client-assertion claims.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, oauth, client-id]
---

```Delphi
property ClientId: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.AuthType := fatCustomOAuth;
  Http.GrantType := gtClientCredentials;
  Http.ClientId := 'velox-integration-client';
  Http.Secret := '<secret-from-approved-configuration>';
  Value := Http.ClientId;
end;
```

### Usage

`ClientId` sets the OAuth client identifier used in token requests, authorisation requests and NetSuite client-assertion claims.

### Additional Technical Info
`ClientId` defaults to an empty string and is copied to the OAuth authenticator whenever Velox prepares an OAuth bearer token. It has no effect for `fatNone`, `fatBasic`, `fatBearer` or `fatWindows`.

Its exact placement depends on [`GrantType`](GrantType.md):

- client credentials sends `client_id=<ClientId>` in the raw form body, except the NetSuite branch, where it becomes the JWT `iss` claim;
- password sends it in the raw token-request body;
- authorization code includes it in Embarcadero's constructed URI and then adds it again as a REST request parameter, producing duplicate nonempty values; and
- refresh-token and code-exchange routines also send it, although the normal `TvxHTTP` configuration clears refresh tokens and does not invoke the code-exchange routine.

The client-credentials branch explicitly rejects a blank client ID before it sends the token request. The authorization-code branch also rejects blank. The password branch performs no equivalent local validation and lets the token endpoint decide.

Velox constructs client-credentials and password bodies by string concatenation, without percent-encoding this value. An identifier containing `&`, `=`, `+`, `%` or other form-significant data can alter the request. Use the exact provider-issued value and validate interoperability outside production.

OAuth defines a client identifier as public rather than secret, but it is still security-relevant configuration: an attacker-controlled identifier can select another registered integration or influence auditing. Do not confuse it with [`Secret`](Secret.md). Writing it does not invalidate an unexpired cached access token, so create a new HTTP client when changing OAuth client identity.

**External references**

- [RFC 6749 section 2.2: Client identifier](https://www.rfc-editor.org/rfc/rfc6749#section-2.2)
- [RFC 6749 section 4.4.2: Client-credentials access-token request](https://www.rfc-editor.org/rfc/rfc6749#section-4.4.2)
- [Embarcadero `TOAuth2Authenticator` properties](https://docwiki.embarcadero.com/Libraries/Athens/en/REST.Authenticator.OAuth.TOAuth2Authenticator_Properties)

<small>Created 2026-07-15</small>
