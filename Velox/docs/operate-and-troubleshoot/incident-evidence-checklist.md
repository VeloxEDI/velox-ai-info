---
title: "Collect Velox incident evidence"
description: "Capture safe, correlated evidence before changing Velox runtime or configuration state."
sidebar_position: 130
classification: public
status: approved
owner: Cam Hart
keywords: [incident evidence, escalation, correlation, sanitisation]
---

Capture evidence before restarting services, retrying work, clearing caches or changing configuration. Use organisational incident policy and store evidence according to its sensitivity.

## Context and timeline

- Velox release/build and documentation/Code Library version where relevant.
- Host, exact Windows service/process instance, service identity and production/test system connection.
- Local timezone plus local and UTC start/end times; first detection and last known-good time.
- Change/release/incident identifier and recent relevant configuration, binary, certificate, credential or infrastructure change.

## Correlation

- Module name and FID, Flow log number, Transport-log number, file name/hash or API/gateway correlation ID.
- Trigger type, executor, test flag, status, attempts/next-attempt time and first causal message.
- Sanitised external business key/receiver acknowledgement sufficient to detect duplicates or missing work.

## Platform evidence

- Intended versus actual Windows service state and Velox processing state.
- First relevant Velox Flow/system/Transport log item and Windows Application Event Log entry.
- Queue/backlog age/count, View Processes state, disk/resource/dependency health and effective runtime-account access.
- For APIs: method/path/status, gateway/front-end log, OpenAPI/version and upstream Flow log.

## Actions and current state

- Every action attempted, by whom/when, observed result and whether it changed state.
- Work disabled/held, backlog scope, external effects completed/absent/ambiguous and receiver verification owner.
- Proposed next action, approval needed, rollback source and success criteria.

## Sanitise before sharing

Remove passwords, tokens, private keys, connection strings, cookies, raw personal/customer data and unnecessary payload/file content. Redact consistently while retaining identifiers needed for correlation. Do not attach whole `.CFG` packages, communication dumps or database backups to a general support channel.

Continue with [diagnostics](diagnostics.md) or the subsystem-specific troubleshooting page. A useful escalation packet states what is known, unknown and already changed; it does not guess the cause.
