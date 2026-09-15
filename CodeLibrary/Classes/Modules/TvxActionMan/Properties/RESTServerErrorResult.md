---
title: RESTServerErrorResult
description: Controls the HTTP status code selected when an assigned API action thread reports a fatal exception.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - api
  - http-status
---

```Delphi
property RESTServerErrorResult: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.RESTServerErrorResult;
end;
```

### Usage

`RESTServerErrorResult` controls the HTTP status code selected when an assigned API action thread reports a fatal exception.

**Behaviour**

Assignment changes the status code used after request processing completes. It does not create an exception, change log status, populate the response body or save configuration. Choose a valid 5xx value that does not disclose sensitive detail and accurately represents the server-side failure.

**Important usage notes**

- Only the fatal-thread-exception branch with an assigned action uses this configured field.
- Missing action, wait timeout and some infrastructure failures use fixed 500 instead.
- A normal script/action error maps to the client-error field in current GET/POST handling, even when its business cause might be server-side.
- Any Integer is accepted; invalid HTTP codes are not rejected here.

### Additional Technical Info
`RESTServerErrorResult` is the Integer status code used when the REST action thread reports a fatal exception and still has an assigned action manager.

The new-action default is `500` (Internal Server Error).

**Implementation**

The REST manager checks the thread's fatal-exception reference before normal log-status mapping. If an action object is assigned, it reads this field; if no action is assigned, it uses fixed 500. Ordinary completed flows with log error use [`RESTClientErrorResult`](RESTClientErrorResult.md), not this property.

The setter stores any Integer without HTTP-range or semantics validation.

**Performance and concurrency**

Access is constant-time. Concurrent writes can race with the REST manager's final read; prefer stable reviewed configuration.

**Related entries**

- [`RESTClientErrorResult`](RESTClientErrorResult.md) — completed log-error mapping.
- [`RESTSuccessResult`](RESTSuccessResult.md) — remaining successful/fall-through mapping.
- [`Response`](Response.md) — outgoing response object.

**External references**

- [IANA: HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)

<small>Created 2026-07-15</small>
