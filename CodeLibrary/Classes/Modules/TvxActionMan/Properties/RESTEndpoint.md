---
title: RESTEndpoint
description: Returns the configured route path used to register this Velox API flow.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - api
  - endpoint
---

```Delphi
property RESTEndpoint: String read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.RESTEndpoint;
end;
```

### Usage

`RESTEndpoint` returns the configured route path used to register this Velox API flow.

**Behaviour**

Reading is informational and has no I/O. An empty value can occur in new/design/partially loaded state. A non-empty path does not prove that the REST service is running, the action is active, the route is unique/reachable or the caller is authorised.

Velox API flows can handle configured GET and POST requests; the supported request method is configured separately from this path string.

**Important usage notes**

- The generated default contains the flow FID and therefore changes when configuration identity changes.
- Path matching/configuration uses the configured string; case, duplicates and reverse-proxy routing must be verified in the deployed service rather than inferred from this property.
- Query strings are request data and are not part of this configured route value.
- Scripts cannot repair an endpoint by assigning this read-only property.

### Additional Technical Info
`RESTEndpoint` is the read-only scripting view of the action's configured API route path.

The value is a path such as `/api/<flow-identifier>`, not a complete URL. It does not include scheme, host, port or authentication policy.

**Implementation**

A new unsaved action starts with an empty endpoint. Before the action is first added/saved, Velox supplies `/api/` followed by its brace-free FID when no endpoint was configured. The native configuration setter adds a leading slash to any non-empty value that lacks one. That setter is not exposed to scripts.

The REST manager uses the exact stored path as its endpoint dictionary key and to synchronise loaded API flow registrations. API documentation generation also uses the value as the operation path/identifier context.

**Performance and concurrency**

Access is constant-time string retrieval. Treat the result as a loaded configuration snapshot for the current manager.

**Related entries**

- [`REST`](REST.md) — current API execution flag.
- [`Request`](Request.md) and [`Response`](Response.md) — live request/response objects.
- [`TvxActionMan`](../../TvxActionMan.md) — owning configured flow.

<small>Created 2026-07-15</small>
