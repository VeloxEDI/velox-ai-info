---
title: fatNone
description: Disables Velox's local authentication handler for the receiving client while leaving transport security and application-level credentials separate.
sidebar_position: 50
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, authentication, none, anonymous, http]
---

```Delphi
fatNone = 0
```

### Example

```Delphi
procedure ConfigureAnonymous(Client: TvxHTTP);
begin
  Client.AuthType := fatNone;
  Client.ClearAuthentication;
end;
```

### Usage

`fatNone` disables Velox's local authentication handler for the receiving client while leaving transport security and application-level credentials separate.

### Additional Technical Info
`fatNone` is ordinal 0 of [`TvxAuthType`](../../Types/Enumerations/TvxAuthType.md) and is the default for new HTTP/transport objects. For [`TvxHTTP`](../../Classes/HTTP/TvxHTTP.md), configuration removes authorization callbacks, frees the current request Authentication object and clears the request Username/Password fields.

It means “do not use this Velox authentication mechanism,” not “the complete request contains no credentials.” Caller-supplied headers, cookies, client certificates, URL query values and request-body/form fields remain separate. In particular, outbound multipart HTTP code can add configured username/password as form fields in its `fatNone` branch; those are application data rather than an Authorization scheme.

#### Behavior and boundaries

- Assigning the constant changes only the receiver's selection. Cleanup occurs when authentication is configured or [`ClearAuthentication`](../../Classes/HTTP/TvxHTTP/Methods/ClearAuthentication.md) is called.
- It does not turn TLS on or off and does not weaken/strengthen certificate validation by itself.
- A server may still challenge and reject the request. Velox has no selected local handler to satisfy it.
- Do not assume that switching from another member erases every String copy held by configuration, logs or caller variables.
- Provider-table placeholders for `fatNone` contain Login/Plain classes, but HTTP explicitly selects no authentication and common transports have their own branching. Read the selected surface's documentation rather than treating the provider table as universal behavior.
- If a custom Authorization header is deliberately supplied, document that separately so reviewers do not infer anonymous access from `fatNone`.

The constant is safe to read/compare and has no effect until assigned/consumed. The example performs no request and was source-reviewed; no anonymous endpoint, credential, network or image-function test was executed.

**Related Code Library entries**

- [`fatBasic`](fatBasic.md), [`fatBearer`](fatBearer.md) and [`fatWindows`](fatWindows.md) - explicit authentication selections.
- [`TvxHTTP.ClearAuthentication`](../../Classes/HTTP/TvxHTTP/Methods/ClearAuthentication.md) - release current HTTP authentication state.

<small>Created 2026-07-15</small>
