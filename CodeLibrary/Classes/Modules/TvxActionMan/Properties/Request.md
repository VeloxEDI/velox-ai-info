---
title: Request
description: Provides the borrowed API request object assigned to the current flow execution.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - api
  - request
---

```Delphi
property Request: TvxAPIRequest read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.Request <> nil;
end;
```

### Usage

Provides the borrowed API request object assigned to the current flow execution.

**Behaviour**

Members of the returned object expose live request fields, query/header/body data and stream state according to [`TvxAPIRequest`](../../../HTTP/TvxAPIRequest.md). Reads can contain untrusted and sensitive caller input. Validation, authentication and authorisation are responsibilities of the API/design surrounding the script; object availability is not proof that input is trusted.

Assigning another object changes what the action and configured request definition see, but does not change ownership or the API thread's original request variable. Assigning nil can break later request-dependent processing.

**Usage notes**

Never call `Free` on the request. Prefer the host-provided `Request` variable/property and mutate only documented members required by the flow.

### Additional Technical Info
`Request` is the `TvxAPIRequest` supplied by the waiting API/web execution when one exists.

The reference can be nil outside an API request or when the caller has not assigned request context. Treat it as borrowed and normally read the reference rather than replacing it.

**Implementation**

The API action thread assigns its request before executing the flow. The native setter stores that same object reference. When a source manager and configured request definition are both available, it also assigns the reference to the underlying request definition's source object so file/data handling can read it.

The action does not construct or free this object. Its reset/destruction code deliberately does not clear/free the reference because ownership remains with the external request lifecycle.

**Edge cases and quirks**

- The reference is not cleared by ordinary action reset, so non-nil alone is not a definitive current-invocation test on a reused manager. Consider [`REST`](REST.md) and the documented host context as well.
- An API request can contain large streams or malformed text; avoid unnecessary copies and apply size/format limits before parsing.
- Request members can share cursor/stream position with other consumers.
- Replacing the reference can make action-level and outer web-thread views diverge.

**Side effects**

Reading the reference has no I/O. Reading members can consume/advance streams; writing members or replacing the reference can alter downstream mapping and file-engine behaviour.

**Performance and concurrency**

Reference access is constant-time, but body operations can be proportional to request size. The web thread waits while the action thread executes; this borrowed object is valid for that bounded lifecycle, not for background retention or cross-thread use after return.

**Related entries**

- [`TvxAPIRequest`](../../../HTTP/TvxAPIRequest.md) — request member reference.
- [`Response`](Response.md) — paired outgoing object.
- [`REST`](REST.md) — API-execution context flag.
- [`TvxActionMan`](../../TvxActionMan.md) — borrowed-reference holder.

<small>Created 2026-07-15</small>
