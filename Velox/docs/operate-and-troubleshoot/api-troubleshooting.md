---
title: "Troubleshoot Velox API requests"
description: "Diagnose route, authentication, status, timeout and proxy failures"
sidebar_position: 110
slug: /apis/api-troubleshooting
classification: public
status: approved
owner: Cam Hart
keywords: [api, troubleshooting, http-status]
---

Capture the UTC/local timestamp, gateway correlation identifier, route and method, sanitised request metadata, response status, front-end log and Velox Flow execution log. Never collect bearer credentials or unredacted bodies.

| Symptom | Checks | Safe action |
| --- | --- | --- |
| 404/document missing | Published route, API/Flow active state, OpenAPI filename and deployed JSON | Correct and redeploy the coordinated route/document set; restart if routes load at startup |
| 401 or 403 | Gateway credential validity, expiry/scope and endpoint policy | Correct the managed credential or policy; do not bypass authentication |
| 405 or wrong Flow | Actual method, configured metadata and gateway mapping | Publish only verified GET/POST mappings and remove route conflicts |
| 500/503 | Flow/service availability, first causal execution-log error and dependency health | Disable traffic, correct the cause and test one request |
| Timeout | Gateway and Flow timeouts, long step and external-system state | Reconcile side effects before retry; do not assume cancellation |
| Empty/truncated body | Content type/length or chunked forwarding and request Definition | Test the approved gateway with representative body modes and sizes |
| Request reaches unexpected operation | Duplicate/path ordering, gateway route inventory and actual incoming method | Remove conflict, restart route-loading components and retest the exact method/path |
| Duplicate side effect after retry | Client/gateway retry policy, Flow idempotency and prior target state | Stop retries and reconcile the business key before controlled recovery |

## Velox-specific boundaries

- The core dispatcher currently branches on actual GET/POST requests only; it does not visibly compare the incoming method with configured **REST Method** metadata.
- **Allow anonymous** is stored but central enforcement was not found in the reviewed dispatcher. Authentication/authorisation evidence comes from the gateway and Flow logic.
- OpenAPI `X-ApiKey` and bearer declarations do not activate credential enforcement.
- An endpoint not found can return 500 in the core implementation; a disabled REST item returns 503. The gateway may intentionally normalise the public contract.
- Flow failures can return `application/problem+json` containing error descriptions/exception details and a log instance number. Apply the approved error-disclosure policy.
- A timeout does not prove cancellation and REST execution does not visibly use the normal per-Flow semaphore. Check downstream state/capacity before retry.

Verify recovery through the same public boundary, then confirm response, execution status and external state. Escalation evidence should identify versions, route/method, timestamps, sanitised headers/statuses and relevant log IDs.

- [REST Flow configuration](../design-and-build/apis-and-openapi/rest-flows.md)
- [API deployment](../design-and-build/apis-and-openapi/api-deployment.md)
- [Execution Logs](execution-logs.md)
