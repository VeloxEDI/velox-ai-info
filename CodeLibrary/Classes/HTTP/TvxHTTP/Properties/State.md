---
title: State
description: Supplies the OAuth authorization-request state value, which the current Velox flow sends but does not validate on return.
sidebar_position: 27
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, oauth, state, csrf]
---

```Delphi
property State: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.AuthType := fatCustomOAuth;
  Http.GrantType := gtAuthCode;
  Http.State := '<fresh-unpredictable-correlation-value>';
  Value := Http.State;
end;
```

### Usage

Supplies the OAuth authorisation-request state value, which the current Velox flow sends but does not validate on return.

### Additional Technical Info
`State` defaults to an empty string. OAuth configuration copies it to the Embarcadero authenticator's `LocalState`. A nonempty value is included once in Embarcadero's constructed authorization URI and then added a second time to the [`gtAuthCode`](GrantType.md) REST request, so the query can carry duplicate state values. Client-credentials and password grants ignore it.

In a standards-based authorization-code flow, the client generates an unguessable value bound to the initiating user-agent state, then requires the callback to return the exact same value. This protects the redirection endpoint against cross-site request forgery and response mix-up.

The current Velox branch does only the send half. It performs a synchronous GET, does not operate a callback listener, does not parse returned state and does not compare it with this property. Setting `State` therefore does not provide CSRF protection in the reviewed implementation, and it does not make the incomplete authorization-code flow safe for production.

If future product code completes the callback flow, generate a new high-entropy value for every attempt, bind it to that attempt, compare it exactly and consume it once. Do not put credentials, access tokens, personal data or other secrets in state; RFC 6749 notes that it may traverse or be stored in exposed locations.

Writing a value does not invalidate existing OAuth authentication or access tokens. It is retained as a plain string for the lifetime of the HTTP object.

**External references**

- [RFC 6749 section 4.1.1: Authorization request state](https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1)
- [RFC 6749 section 10.12: Cross-site request forgery](https://www.rfc-editor.org/rfc/rfc6749#section-10.12)
- [RFC 9700 section 4.7: Authorization-code injection](https://www.rfc-editor.org/rfc/rfc9700#section-4.7)

<small>Created 2026-07-15</small>
