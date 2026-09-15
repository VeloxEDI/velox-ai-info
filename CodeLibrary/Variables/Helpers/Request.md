---
title: "Request"
description: "Returns the current externally assigned Velox API request object, which may be nil outside an API context."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - request
---

```Delphi
function Request: TvxAPIRequest;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.URL
  else
    Value := '';
end;
```

### Usage

`Request` returns the current Velox API request, or `nil` outside an API execution. Check for `nil` before using it.

Use it to inspect the HTTP method, URL, path, query, headers, content, connection and caller/network information. Writable members change the live request seen by later processing. Reading `Request` does not parse or validate the business payload automatically and does not retain a request from a previous execution.

### Additional Technical Info
`Request` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TvxAPIRequest` |
| Ownership | Execution context/action reference; not owned by the scripter |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

Always test for `nil`. Treat all request fields and content as untrusted. Authentication/authorisation must come from the configured security boundary, not `From`, host, IP, headers or query values alone. Apply body/field size limits, safe decoding and explicit content-type handling; never free or retain the request.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TvxAPIRequest`](../../Classes/HTTP/TvxAPIRequest.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) defines protocol semantics; the Velox request class defines the exposed representation.

<small>Created 2026-07-15</small>
