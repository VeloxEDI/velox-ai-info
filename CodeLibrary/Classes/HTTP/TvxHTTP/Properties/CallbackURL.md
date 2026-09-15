---
title: CallbackURL
description: Sets the redirect URI sent by the Velox HTTP client's OAuth authorization-code request.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, oauth, redirect-uri, callback]
---

```Delphi
property CallbackURL: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.AuthType := fatCustomOAuth;
  Http.GrantType := gtAuthCode;
  Http.CallbackURL := 'https://client.example.invalid/oauth/callback';
  Value := Http.CallbackURL;
end;
```

### Usage

`CallbackURL` sets the redirect URI sent by the Velox HTTP client's OAuth authorisation-code request.

### Additional Technical Info
`CallbackURL` is copied to the OAuth authenticator's `RedirectionEndpoint`. It defaults to an empty string and is used only by the [`gtAuthCode`](GrantType.md) branch. A nonempty value is added once while Embarcadero builds `AuthorizationRequestURI` and a second time when Velox adds `redirect_uri` to the REST request, so the final query can contain two values. Client-credentials and password grants ignore it.

This property does not create an HTTP listener, register a route, open a browser or receive a provider callback. The reviewed authorization-code terminal performs its own synchronous GET and expects token fields in a 200 response. It does not parse an authorization code from this callback URL, compare a returned [`State`](State.md) or call its code-to-token exchange method. Setting a valid registered redirect URI therefore does not complete a standards-based authorization-code flow in the current implementation.

OAuth providers normally require an exact match with a pre-registered redirect URI. Use a fixed, provider-approved HTTPS URI and never derive it from request headers or other untrusted input. Do not put credentials, tokens or personal data in it; endpoint URLs can be logged by surrounding infrastructure.

Writing a new value does not clear the active request authentication or retained access token. Configure all OAuth fields before the first request and use a new `TvxHTTP` object when changing OAuth client identity or authority.

**External references**

- [RFC 6749 section 3.1.2: Redirection endpoint](https://www.rfc-editor.org/rfc/rfc6749#section-3.1.2)
- [RFC 6749 section 4.1.1: Authorization request](https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1)
- [RFC 6749 section 10.6: Authorization-code redirect URI manipulation](https://www.rfc-editor.org/rfc/rfc6749#section-10.6)
- [Embarcadero `TOAuth2Authenticator` properties](https://docwiki.embarcadero.com/Libraries/Athens/en/REST.Authenticator.OAuth.TOAuth2Authenticator_Properties)

<small>Created 2026-07-15</small>
