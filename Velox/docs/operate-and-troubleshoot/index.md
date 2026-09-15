---
title: "Operate and troubleshoot Velox"
description: "Monitor processing, inspect logs and resolve common failures"
sidebar_position: 10
slug: /operations/
classification: public
status: approved
owner: Cam Hart
keywords:
  - "operations"
  - "monitoring"
  - "troubleshooting"
---

Use this section to monitor Velox, interpret evidence and recover failed work without creating duplicates. Always establish the system connection, test/production context, execution host, service identity and time window before changing state.

## Choose the evidence path

| Observation | Start with | Then use |
| --- | --- | --- |
| Scheduled/file-monitored work did not run | [Daily operations](daily-operations.md) | [Flow troubleshooting](flow-troubleshooting.md) or [service troubleshooting](service-troubleshooting.md) |
| Flow ran but failed or produced wrong output | [Execution Logs](execution-logs.md) | [Flow troubleshooting](flow-troubleshooting.md) |
| Outbound work is queued, retrying or failed | [Transport Logs](transport-logs.md) | [File and Transport troubleshooting](file-and-transport-troubleshooting.md) |
| API caller sees an HTTP failure | [API troubleshooting](api-troubleshooting.md) | Execution Logs and gateway/service evidence |
| Database, driver or folder access fails | [Connection troubleshooting](connection-troubleshooting.md) | Service-account and external-system evidence |
| Scripting help/signature is missing or stale | [Code Library troubleshooting](code-library-troubleshooting.md) | Installed-version and update evidence |
| Cause is unclear or needs escalation | [Diagnostics](diagnostics.md) | [Incident evidence checklist](incident-evidence-checklist.md) |

## Recovery rule

Preserve the original error/status, apply one reversible correction and test one controlled item. Confirm Flow status, Transport status and every affected external destination before widening processing. A Windows service restart, Flow rerun or queue retry is an action, not proof of recovery.

## Escalation evidence

Provide the Velox release, context, host/service identity, timestamps, affected module names/FIDs or log numbers, sanitised log excerpts, changes already attempted and current external-system state. Never include passwords, tokens, private keys or unredacted business payloads.

## Recovery boundary

Keep automated work constrained until the cause is understood and end-to-end verification passes. Use [reprocess and recover](reprocess-and-recover.md) only after reconciling prior side effects.
