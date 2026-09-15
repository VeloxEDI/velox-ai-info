---
title: "Response"
description: "Returns the current externally assigned Velox API response object, which may be nil outside an API context."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - response
---

```Delphi
function Response: TvxAPIResponse;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
    Value := Response.StatusCode
  else
    Value := -1;
end;
```

### Usage

`Response` returns the current Velox API response, or `nil` outside an API execution. Check for `nil` before using it.

Set its status, headers, content metadata and response content or stream to control what the API caller receives. Changes remain part of the live response. Reading `Response` does not send or finalise the response and does not retain a response from a previous execution.

### Additional Technical Info
`Response` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TvxAPIResponse` |
| Ownership | Execution context/action reference; not owned by the scripter |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

Always test for `nil`. Set status and content type deliberately, avoid contradictory content-length/encoding/header state, prevent header injection, and do not expose stack traces, secrets or internal paths. Streaming and ownership flags require the class contract; never free or retain the response.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TvxAPIResponse`](../../Classes/HTTP/TvxAPIResponse.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) defines status and response semantics; the Velox class defines output behaviour.

<small>Created 2026-07-15</small>
