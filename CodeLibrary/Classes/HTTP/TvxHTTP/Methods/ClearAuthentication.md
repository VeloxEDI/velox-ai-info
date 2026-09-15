---
title: ClearAuthentication
description: Marks the HTTP client unauthenticated and destroys its current Indy authentication object without erasing configured credentials or authentication mode.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, authentication, credentials, state]
---

```Delphi
procedure ClearAuthentication;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ClearAuthentication;
  Http.Username := 'service-account';
  Http.Password := 'replacement-secret';
  Value := 'Authentication state will be rebuilt on the next request';
end;
```

### Usage

`ClearAuthentication` marks the HTTP client unauthenticated and destroys its current Velox authentication object without erasing configured credentials or authentication mode.

### Additional Technical Info
`ClearAuthentication` sets the client's internal authenticated flag to false and frees `FHTTP.Request.Authentication` when one exists. It performs no network operation.

The method does **not** clear [`AuthType`](../Properties/AuthType.md), [`Username`](../Properties/Username.md), [`Password`](../Properties/Password.md), [`Domain`](../Properties/Domain.md), OAuth client/secret/token settings, request `Username`/`Password`, cookies, headers or an OAuth authenticator/access-token cache. On the next request, authentication configuration can immediately create another Indy authentication object from those retained fields.

Use it when credential or scheme settings have changed and the next call must rebuild the per-request authentication state. To remove authentication, also set `AuthType := fatNone` and clear sensitive configuration fields that should no longer remain in memory.

Calling the method repeatedly is safe with respect to the authentication object. It is not synchronised; never call it while the same [`TvxHTTP`](../../TvxHTTP.md) instance is executing a request in another thread.

The standard [`Http`](../../../../Variables/Helpers/Http.md) object remains host/scripter-owned. Clearing its authentication state does not transfer ownership and is not equivalent to freeing the client.

**External references**

- [RFC 9110 section 11: HTTP Authentication](https://www.rfc-editor.org/rfc/rfc9110#section-11)

<small>Created 2026-07-15</small>
