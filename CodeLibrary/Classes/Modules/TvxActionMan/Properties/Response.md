---
title: Response
description: Provides the API response object assigned to the current flow execution.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - api
  - response
---

```Delphi
property Response: TvxAPIResponse read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.Response <> nil;
end;
```

### Usage

Provides the API response object assigned to the current flow execution.

**Behaviour**

Changing documented [`TvxAPIResponse`](../../../HTTP/TvxAPIResponse.md) members changes the outgoing response. Make all required changes before the flow finishes. The property may be `nil` when the script is not running as part of an API request.

Do not replace the response or set the property to `nil` in normal scripts. Use the supplied object and change only the members needed for the response.

**Usage notes**

Never call `Free` on the response. Avoid including secrets, detailed Velox errors or unvalidated request data in client-visible output.

### Additional Technical Info
`Response` is the live `TvxAPIResponse` supplied for the current API/web execution.

It can be nil outside API context. The object belongs to the waiting web-response lifecycle, not to the action or script.

**Implementation**

The API action thread creates/assigns response stream context and gives the object to the flow before execution. The action setter stores the same reference and, when a response definition exists, propagates it to that definition's underlying source object. The action never frees the response and ordinary reset deliberately does not clear it.

At the end of a top-level execution with `REST = True`, the action asks its log to populate API response information through this reference. After the thread completes, the REST manager selects the final HTTP status code separately.

**Edge cases and quirks**

- The reference can survive action reset; non-nil does not by itself prove a new/current API call on a reused manager.
- Setting [`REST`](REST.md) true without a valid response can lead final response handling to dereference missing context.
- Body/content-stream position and ownership can be shared with the web server; do not free or replace the stream unless its member contract explicitly permits it.
- Final status-code selection can overwrite a status according to the action's configured success/client/server result properties.

**Side effects**

Member writes can change response headers, body/content, content type and other client-visible output. Replacing the object can disconnect downstream processing. Reading the reference alone has no network send; the web layer sends after execution returns.

**Performance and concurrency**

Reference access is constant-time; body operations scale with response size. The object is valid only for the bounded waiting request and must not be retained for asynchronous/background use.

**Related entries**

- [`TvxAPIResponse`](../../../HTTP/TvxAPIResponse.md) — response member reference.
- [`Request`](Request.md) — paired incoming object.
- [`RESTSuccessResult`](RESTSuccessResult.md), [`RESTClientErrorResult`](RESTClientErrorResult.md) and [`RESTServerErrorResult`](RESTServerErrorResult.md) — final status policies.

<small>Created 2026-07-15</small>
