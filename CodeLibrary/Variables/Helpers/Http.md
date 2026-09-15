---
title: "Http"
description: "Returns the current stateful Velox HTTP client, creating one or exposing an injected transport client as required by context."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - http
---

```Delphi
function Http: TvxHTTP;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Accessing the helper creates/returns the client but sends no request. }
  Value := Http.URL;
end;
```

### Usage

`Http` provides the current Velox HTTP client. Configure its URL, authentication, headers and request content, then call `Get`, `Post`, `Put`, `Patch`, `Delete`, `Options`, `Head`, `Trace` or `CustomRequest` to make a network request and inspect the response properties afterward.

The client retains settings and response state between calls. Clear or replace headers, credentials and content before an unrelated request so values are not reused accidentally. During custom HTTP transport processing, it can represent the transport's current client, so changes can also affect that surrounding transport operation. Do not free the object.

### Additional Technical Info
`Http` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TvxHTTP` |
| Ownership | Scripter-owned when created; externally owned when injected |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

Restrict outbound schemes/hosts/ports to prevent SSRF, require appropriate TLS/certificate policy, set timeouts and size limits, and never log passwords, secrets, tokens or sensitive bodies. Clear authentication/state before unrelated destinations. Treat response codes, headers and content as untrusted; handle network exceptions and partial remote effects.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TvxHTTP`](../../Classes/HTTP/TvxHTTP.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) defines method and response semantics; `TvxHTTP` supplies the actual Velox behaviour.

<small>Created 2026-07-15</small>
