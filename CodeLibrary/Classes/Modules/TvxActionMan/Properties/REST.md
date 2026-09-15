---
title: REST
description: Indicates that the current action manager is operating in Velox API request context.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - api
  - execution-context
---

```Delphi
property REST: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.REST;
end;
```

### Usage

`REST` indicates that the current action manager is operating in Velox API request context.

**Behaviour**

Read the flag to distinguish intended API execution behaviour. It does not create Request/Response objects, register [`RESTEndpoint`](RESTEndpoint.md), authenticate a caller, authorize a flow, make execution stateless or guarantee that the objects are non-nil.

Normal scripts should not change it. Setting true in a non-API execution can disable reprocessing and invoke final response handling without valid response context. Setting false during a real API execution can suppress response/log population while the outer REST manager still treats the call as HTTP work.

### Additional Technical Info
`REST` is the action manager's read/write API-execution context flag.

A new action defaults to false. The API action thread sets it true before running an HTTP-triggered flow.

**Implementation**

The property is a direct Boolean field. It is deliberately not cleared by the action's ordinary `Reset`, because the external caller controls API context around loading/execution.

True suppresses the flow's reprocess-until-error mode. At the end of a top-level execution, true also causes log-to-API-response processing through the current [`Response`](Response.md).

**Edge cases and quirks**

- Because Reset does not clear the field or API references, the host/caller must establish coherent context on a reused manager.
- A sub-action does not perform the top-level log-to-response step even if its flag is true.
- The current name is `REST`, but the implemented service currently handles configured API GET/POST routes; do not infer support for every HTTP method from this Boolean.
- It is not a security boundary and must never replace authentication/authorisation checks.

**Side effects**

Assignment changes execution mode used by later flow logic. It does not immediately perform network I/O or save configuration.

**Performance and concurrency**

Access is constant-time. The flag belongs to one borrowed manager's execution context and is not a process-wide or cross-thread API-state indicator.

**Related entries**

- [`Request`](Request.md) and [`Response`](Response.md) — borrowed live HTTP objects.
- [`RESTEndpoint`](RESTEndpoint.md) — configured route path.
- [`TvxActionMan`](../../TvxActionMan.md) — owning action manager.

<small>Created 2026-07-15</small>
