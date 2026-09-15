---
title: "Configure a REST-enabled Flow"
description: "Define a REST endpoint, request data and response behaviour"
sidebar_position: 30
slug: /apis/rest-flows
classification: public
status: approved
owner: Cam Hart
keywords: [rest, flow, endpoint]
---

Configure and test a Flow before adding it to an API module. Current core runtime execution supports GET and POST request branches; do not publish other configured method metadata. The reviewed dispatcher selects its branch from the incoming method and does not compare it with the Flow's configured **REST Method** value.

## REST properties

| Setting | Default or format | Runtime effect and guidance |
| --- | --- | --- |
| **REST Endpoint** | Empty; when created, `/api/<Flow FID>` may be assigned | Route key loaded by the REST manager. A leading `/` is added when omitted. Replace the FID-based default with a governed, stable path before publication. Paths must be unique. |
| **REST Method** | GET | Used by Designer and OpenAPI. Designer may initially select GET for a database source and POST for a file source. The current core dispatcher handles the actual incoming GET/POST method without visibly enforcing this configured value. |
| **Groups** | Empty, semicolon-separated | OpenAPI tag/group metadata. Use group names declared on the API module. |
| **Summary** | Empty | Short OpenAPI operation summary. |
| **Description** | Empty | Detailed operation behaviour, validation and side-effect description. |
| **Documentation URL** | Empty | External operation documentation reference. Use only a stable, approved URL. |
| **Parameters** | None | Query/path/header metadata included in the generated contract. It does not provide business validation automatically. |
| **Success result** | `200` | Status returned when execution completes without an error Flow-log state. |
| **Client error result** | `400` | Status used for Flow error/issue outcomes according to the execution branch. Verify the exact mapping in contract tests. |
| **Server error result** | `500` | Status used for fatal execution exceptions. |
| **Allow anonymous** | Off | Stored and exposed in Designer, but central enforcement was not found in the reviewed core dispatcher. Do not use it as an access-control mechanism. |
| **Request Definition** | None | Optional structured request body Definition used by runtime binding and OpenAPI schema generation. |
| **Response Definition** | None | Optional structured response Definition used by runtime binding and OpenAPI schema generation. |

## Request and response processing

- GET query fields are copied into Flow locals. Request headers, including any deployment-specific identity header, are also available to the runtime.
- POST exposes the request body through the API request object and also supplies query fields and headers.
- The response Definition supplies the structured response where configured. The selected Definition's MIME type is used in the generated OpenAPI document.
- A failed Flow can return `application/problem+json`; verify its real payload and status through the deployed gateway.
- An unknown endpoint returns HTTP 500 in the reviewed core implementation, and a disabled REST manager returns HTTP 503. Treat these as current implementation behaviour, not an ideal public contract.
- Unsupported methods have no explicit response behaviour in the reviewed handler. Reject them at the gateway.

## Configure the Flow

1. Build and manually test the Flow's data and steps in the test context.
2. Select REST execution and enter a unique, stable **REST Endpoint**.
3. Select GET for query-driven retrieval or POST when the Flow consumes a request body. Confirm the deployed gateway maps the same method.
4. Add a clear summary, description and parameter metadata.
5. Select request and response Definitions where structured bodies are required.
6. Configure success, client-error and server-error status values according to the reviewed API contract.
7. Set a timeout that accounts for the Flow and gateway; do not imply that timeout cancels every external side effect.
8. Save and resynchronise or restart the API runtime as required, then test through the approved boundary.

## Verify

Test valid, missing, malformed, oversized, duplicate and boundary input. Confirm response body, content type, status, execution log, idempotency behaviour and external state. Repeat tests for the actual incoming method because configured method metadata is not sufficient. Endpoint metadata, anonymous flags and OpenAPI security entries do not replace gateway authentication or Flow-level authorisation.

REST execution runs in a dedicated action thread. The reviewed path copies the Flow concurrency value but does not use the normal per-Flow semaphore. Protect constrained downstream systems through the gateway, Flow design and operational capacity controls; do not assume the standard scheduled-Flow concurrency gate applies.

If a test fails, disable the route at the gateway or Flow, retain the request correlation and log evidence, restore the previous configuration and verify before reopening traffic.

- [Generate OpenAPI](openapi.md)
- [Deploy safely](api-deployment.md)
- [Troubleshoot requests](../../operate-and-troubleshoot/api-troubleshooting.md)
