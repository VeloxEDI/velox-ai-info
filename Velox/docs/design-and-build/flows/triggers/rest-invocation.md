---
title: "Invoke a Flow through REST"
description: "Configure a Flow REST endpoint, request/response Definitions, OpenAPI metadata, status codes and deployment security boundaries."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [REST Flow, endpoint, request Definition, response Definition, OpenAPI]
---

A REST-triggered Flow maps an HTTP request into configured Flow data, executes the Flow and returns configured response data/status. Treat the core endpoint as an application service behind an approved authentication, TLS, request-limit and observability boundary.

## Endpoint settings

| Setting | Default | Effect and constraint |
| --- | --- | --- |
| **REST method** | GET | Metadata used by Designer/OpenAPI and the gateway. Current core dispatch has GET and POST execution branches and does not itself compare the request with this configured value; enforce/test the published method at the deployment boundary. |
| **REST endpoint** | Empty; new setup can propose `/api/{Flow FID}` | Route; the setter adds a leading `/` when absent. Use a stable, reviewed public route rather than exposing an internal FID route by accident. |
| **Groups** | Empty | OpenAPI grouping/tags. |
| **Summary** | Empty | Concise operation summary. |
| **Description** | Empty list | Detailed OpenAPI/client description. |
| **Documentation** | Empty | Additional documentation text/reference. |
| **Parameters** | Empty list | REST/OpenAPI parameter metadata; verify it matches runtime request handling. |
| **Allow anonymous** | Cleared | Intended access policy metadata. Enforcement was not found in the reviewed core dispatcher, so clearing this box is not an authentication control by itself. |
| **Success / client error / server error result** | `200` / `400` / `500` | HTTP status codes returned for the applicable outcomes. Preserve standard semantics unless the API contract explicitly differs. |
| **Request Definition** | None | Structured request data item/Definition. |
| **Response Definition** | None | Structured response data item/Definition. |

## Configure and deploy

1. Design and test request/response Definitions, including empty, invalid, repeated and maximum-size inputs.
2. Select REST execution, method, endpoint and status results; write accurate OpenAPI metadata.
3. Keep anonymous access disabled and configure the approved gateway/authentication policy independently.
4. Restart/resynchronise the API runtime after route changes because endpoint managers load configuration into runtime state.
5. Test GET/POST/method rejection, authentication, content type, validation, timeouts, concurrency and error responses through the real gateway.

REST execution uses a dedicated thread, assigns request/response context and returns problem-details-style `application/problem+json` log errors on failure. The configured per-Flow maximum thread count is copied into REST manager state, but the reviewed REST thread path does not wait on the ordinary per-Flow semaphore. Apply upstream concurrency/rate limits and load-test this route.

Do not expose the core service directly based only on OpenAPI or **Allow anonymous** metadata. See [API deployment](../../apis-and-openapi/api-deployment.md) and [runtime performance](../runtime/performance-considerations.md).
