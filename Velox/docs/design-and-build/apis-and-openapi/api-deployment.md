---
title: "Deploy a Velox API safely"
description: "Apply an approved TLS, authentication, authorisation and refresh architecture"
sidebar_position: 60
slug: /apis/api-deployment
classification: public
status: approved
owner: Cam Hart
keywords: [api-deployment, tls, authentication]
---

Deploy Velox API Service only behind a reviewed gateway/front-end boundary. The core service executes configured GET/POST Flows but is not the complete untrusted-network security boundary. Reviewed source did not establish central authentication or `Allow anonymous` enforcement in the dispatcher; TLS/certificate behaviour must also be proven for the exact service build rather than assumed from a configured port.

## Required boundary

```text
Client -> TLS gateway/front end -> restricted upstream -> Velox API Service -> Flow -> data/external systems
```

The gateway authenticates the caller, authorises the exact operation, validates method/path/body limits, applies rate/concurrency controls and strips untrusted identity headers. The Flow still validates business data and authorisation context before causing side effects.

## Deployment gate

1. Approve the network diagram, trust boundaries, DNS, certificates and allowed callers.
2. Configure TLS termination and TLS-protected upstream traffic where required; do not silently downgrade HTTPS.
3. Implement managed, revocable authentication and endpoint-level authorisation at the gateway. Strip caller-supplied identity headers and inject trusted identity only on a protected upstream connection.
4. Restrict direct network access to Velox API Service.
5. Define payload, timeout, concurrency and rate limits from measured Flow/downstream capacity. Do not rely on the normal scheduled-Flow semaphore for REST execution.
6. Deploy matching configuration, REST Flows and validated OpenAPI JSON.
7. Restart or refresh components whose routes are loaded at startup.
8. Test authentication failure, authorisation, GET/POST and rejected methods, fixed/chunked bodies, size/time limits, headers, redirects, status mapping and log sanitisation.
9. Test retry/idempotency and partial-side-effect recovery for every mutating operation.
10. Monitor one controlled request before opening wider traffic.

Do not deploy when the selected front-end build lacks an approved credential lifecycle, route validation, document deployment workflow or safe upstream TLS/header policy.

Rollback by closing the gateway route, stopping new requests, preserving logs, restoring the coordinated configuration/document/build and reconciling any completed Flow side effects. A timeout or failed HTTP response does not prove that downstream work was not committed.

- [Use the API front end](api-front-end.md)
- [Control Velox services](../../administer-velox/service-control/index.md)
