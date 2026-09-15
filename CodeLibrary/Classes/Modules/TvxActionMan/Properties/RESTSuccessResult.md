---
title: RESTSuccessResult
description: Controls the HTTP status code selected for API outcomes not mapped to client or fatal server error.
sidebar_position: 15
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
property RESTSuccessResult: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.RESTSuccessResult;
end;
```

### Usage

`RESTSuccessResult` controls the HTTP status code selected for API outcomes not mapped to client or fatal server error.

**Behaviour**

The REST manager reads the live value after action execution and assigns it to the outgoing web response. Writing the property does not itself send the response, change the action log status, alter body content or persist configuration.

Choose a valid 2xx code whose semantics match the actual response (for example, whether work is complete and whether a body exists). The default 200 is not automatic proof that business processing succeeded.

### Additional Technical Info
`RESTSuccessResult` is the Integer status code selected when the REST manager's completed-action mapping does not choose a client-error code.

The new-action default is `200` (OK).

**Implementation**

For GET, only log error selects the client-error field; every other last-status type, including issue, falls through to this success field. For POST, issue and error select the client-error field; all other statuses fall through here. Fatal thread exceptions are handled earlier through [`RESTServerErrorResult`](RESTServerErrorResult.md).

The direct setter accepts any Integer and performs no HTTP validation.

**Edge cases and quirks**

- Warning, duplicate and cancelled statuses currently fall through to this property for both GET and POST.
- Issue falls through here for GET but maps to client error for POST.
- Timeout and missing-action responses use fixed 500 and do not consult this field.
- Any Integer is accepted; the implementation does not require a 2xx code.
- A script can change this status policy late in execution without changing the log classification that caused the branch.

**Performance and concurrency**

Access is constant-time. Avoid racing mutation and prefer reviewed stable API configuration.

**Related entries**

- [`RESTClientErrorResult`](RESTClientErrorResult.md) and [`RESTServerErrorResult`](RESTServerErrorResult.md) — other mappings.
- [`REST`](REST.md) — API execution context.
- [`Response`](Response.md) — object receiving client-visible output.

**External references**

- [IANA: HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)

<small>Created 2026-07-15</small>
