---
title: InProcessAuth
description: Chooses challenge-first rather than pre-emptive authentication for the Velox HTTP request pipeline.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, authentication, challenge, preemptive]
---

```Delphi
property InProcessAuth: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ClearAuthentication;
  Http.AuthType := fatBasic;
  Http.InProcessAuth := True;
  Http.Username := 'integration-user';
  Http.Password := '<secret-from-approved-configuration>';
  Http.Get('https://api.example.invalid/v1/protected');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`InProcessAuth` chooses challenge-first rather than pre-emptive authentication for the Velox HTTP request pipeline.

### Additional Technical Info
`InProcessAuth` defaults to `False` and determines when local authentication is attempted:

- `False` makes Velox select and create the configured authentication object before the resource request. Basic, bearer and Windows credentials—or an acquired OAuth access token—can therefore be sent on the first request.
- `True` defers credential/token supply until the server returns 401 and Indy invokes Velox's authorization handler. The initial resource request is unauthenticated.

Challenge-first mode can avoid sending credentials to an endpoint that never asks for them, but it adds a round trip and depends on a 401 challenge. OAuth-protected APIs often return a different error for a missing bearer token; in that case Velox never acquires a token and the response remains unauthenticated.

There is an implementation quirk in the false branch: both branches add Indy's `hoInProcessAuth` option, but the false branch also manually creates and populates authentication before sending. Once added, the option is never removed when the Boolean changes. The observable distinction is therefore the manual preflight, not a clean toggling of the underlying Indy option.

When `False`, OAuth acquisition failure can leave `FAuthed` false. `SendRequest` then exits before applying headers and before entering its normal request finaliser, so pending [`Content`](Content.md), connection/intercept state and earlier response metadata can remain. The acquisition routine logs and re-raises internally, but the surrounding `HTTPAuthorization` handler catches that exception and marks authentication unhandled; the script-facing request commonly returns early rather than receiving the acquisition exception. Configuration failures raised before that inner catch can still escape.

Writing this property does not clear an existing authentication object. Set it before first use and call [`ClearAuthentication`](../Methods/ClearAuthentication.md) when changing Basic, bearer or Windows behavior. A fresh client remains the safe boundary for OAuth changes because an unexpired access token survives that clear.

**External references**

- [RFC 9110 section 11: HTTP authentication](https://www.rfc-editor.org/rfc/rfc9110#section-11)
- [RFC 6750 section 3: Bearer-token error response](https://www.rfc-editor.org/rfc/rfc6750#section-3)

<small>Created 2026-07-15</small>
