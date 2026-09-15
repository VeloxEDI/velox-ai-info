---
title: RESTClientErrorResult
description: Controls the HTTP status code selected for configured client-error outcomes of an API flow.
sidebar_position: 12
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
property RESTClientErrorResult: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.RESTClientErrorResult;
end;
```

### Usage

`RESTClientErrorResult` controls the HTTP status code selected for configured client-error outcomes of an API flow.

**Behaviour**

A script assignment changes the live status policy that the waiting REST manager reads after execution. It does not immediately set [`Response`](Response.md), send an HTTP response, mark the log as error or persist configuration.

Use a valid 4xx code that accurately describes caller-correctable failure. Do not use this property to hide authentication/authorisation failures or unexpected Velox errors, and do not include sensitive diagnostics in the associated response body.

### Additional Technical Info
`RESTClientErrorResult` is the Integer status code the REST manager selects for action outcomes it classifies as client errors.

The new-action default is `400` (Bad Request). Loaded configuration or a script can supply another integer.

**Implementation**

After the action thread finishes without a fatal exception, the REST manager examines the action log's last status type. For POST, both issue and error select this property. For GET, only error selects it; issue falls through to [`RESTSuccessResult`](RESTSuccessResult.md).

The property is a direct field. Its setter does not validate the HTTP range, registered meaning or consistency with the outcome category.

**Edge cases and quirks**

- GET and POST deliberately differ for issue status in the current implementation.
- Warning, duplicate and cancelled statuses do not select this property; they fall through to success mapping.
- A fatal action-thread exception uses [`RESTServerErrorResult`](RESTServerErrorResult.md), not this field.
- Timeout or missing-action paths use a fixed 500 and do not consult the configured result fields.
- Any Integer is accepted by the action object; an invalid/unassigned HTTP code can fail or behave unexpectedly in the web layer.

**Performance and concurrency**

Access is constant-time. Change it only within the current bounded API execution or through reviewed configuration; concurrent mutation can race with the REST manager's post-execution read.

**Related entries**

- [`RESTSuccessResult`](RESTSuccessResult.md) and [`RESTServerErrorResult`](RESTServerErrorResult.md) — other outcome mappings.
- [`REST`](REST.md) — API context flag.
- [`Response`](Response.md) — outgoing object.

**External references**

- [IANA: HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)

<small>Created 2026-07-15</small>
