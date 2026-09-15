---
title: "Logging and reporting settings"
description: "Configure shared Velox audit, debug, report-processing and user-reporting behaviour."
sidebar_position: 80
classification: public
status: approved
owner: Cam Hart
keywords: [logging, audit, reporting, debug, General Setup]
---

Logging settings affect evidence volume and, for some flags, runtime behaviour. Enable extra diagnostics only for a defined investigation and protect log content from credentials or customer payloads.

| Property | Default | Verified behaviour / qualification |
| --- | --- | --- |
| `DetailedSystemAudit` | `true` | Enables detailed system audit logging |
| `EnableLogUserReporting` | `false` | Persisted/exposed; direct enforcement in the reviewed user-log path was not found, so verify before relying on it |
| `EnableDebug` | `false` | Enables global debug/audit output |
| `EnableMemCheck` | `false` | Enables FastMM diagnostic mode |
| `ShutdownMemDump` | `false` | Persisted, but full downstream behaviour remains unverified |
| `SafeReportProcessing` | `false` | Copied to Report runtime processing |
| `SQL2014Support` | `false` | Influences SQL/log persistence compatibility |

## Operational procedure

1. Define the question the additional logging must answer and the retention/security impact.
2. Record baseline log volume and available storage.
3. Enable only the required setting in test, reproduce the scenario and collect a sanitised excerpt.
4. Restore normal settings, restart/reload the affected runtime and verify normal processing.
5. Retain the Flow/Transport/system identifiers needed to correlate events; do not retain unnecessary payload or secret data.

Use [Execution Logs](../../operate-and-troubleshoot/execution-logs.md) and [diagnostics](../../operate-and-troubleshoot/diagnostics.md) for interpretation.
