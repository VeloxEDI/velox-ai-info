---
title: Scope
description: Sets the OAuth scope string or allows Velox to substitute its provider-specific HTTP default.
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, oauth, scope, authorization]
---

```Delphi
property Scope: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.AuthType := fatCustomOAuth;
  Http.GrantType := gtClientCredentials;
  Http.Scope := 'orders.read orders.write';
  Value := Http.Scope;
end;
```

### Usage

Sets the OAuth scope string or allows Velox to substitute its provider-specific HTTP default.

### Additional Technical Info
`Scope` defaults to an empty string and is used only by OAuth modes. A nonempty value is copied verbatim to the authenticator. An empty value selects the reviewed provider table's HTTP default:

| `AuthType` | HTTP scope substituted for an empty property |
|---|---|
| `fatMicrosoftOAuth` | `https://graph.microsoft.com/.default` |
| `fatGoogleOAuth` | `https://mail.google.com/ openid` |
| `fatNetsuiteOAuth` | `restlets,rest_webservices,suite_analytics` |
| `fatCustomOAuth` | Empty |

The selected string is sent as `scope` by client-credentials, password and authorization-code branches. The authorization-code terminal includes a nonempty value once in Embarcadero's constructed URI and then adds it again to the REST request. For NetSuite client credentials it is also placed in the signed JWT claim. Velox does not split, normalize, validate or constrain scopes to least privilege.

Client-credentials and password request bodies concatenate this value without form percent-encoding. Spaces, commas, ampersands, plus signs and equals signs are therefore passed exactly as written and may be interpreted differently by providers. Provider defaults are also source constants rather than dynamically discovered metadata. Confirm the exact expected delimiter and grants in the provider's current documentation.

OAuth scope is authorization-relevant configuration. Request only the minimum operations and resources needed by the flow, and do not place credentials or personal data in it. RFC 6749 warns that scope and state can traverse or be stored in less protected locations.

Writing the property does not invalidate a retained access token. The existing token continues to carry the scopes issued with it until it expires; use a new `TvxHTTP` object when reducing or changing scope and do not assume a setter retroactively changes authorization.

**External references**

- [RFC 6749 section 3.3: Access-token scope](https://www.rfc-editor.org/rfc/rfc6749#section-3.3)
- [RFC 6749 section 10.8: Request confidentiality](https://www.rfc-editor.org/rfc/rfc6749#section-10.8)
- [Embarcadero `TOAuth2Authenticator` properties](https://docwiki.embarcadero.com/Libraries/Athens/en/REST.Authenticator.OAuth.TOAuth2Authenticator_Properties)

<small>Created 2026-07-15</small>
