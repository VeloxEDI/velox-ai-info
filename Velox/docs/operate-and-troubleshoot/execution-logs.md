---
title: "Review execution logs"
description: "Find, interpret and safely share Flow execution evidence"
sidebar_position: 30
slug: /operations/execution-logs
classification: public
status: approved
owner: Cam Hart
keywords:
  - "logs"
  - "flow"
  - "diagnostics"
---

Flow execution logs show run identity, start/end time, executer, test flag, final status, ordered messages and configured diagnostic detail. A Flow can save logs only for configured final statuses, so an absent saved row does not prove the Flow did not run.

## Find and interpret a run

1. Confirm context and trigger host, then filter by Flow/module, time, status and test flag.
2. Record the saved log number and run identifiers before changing filters or state.
3. Read items from the beginning and find the first causal Warning/Issue/Cancelled/Error, not merely the final summary.
4. Correlate file events, Transport records, database changes, API/gateway IDs and downstream timestamps.
5. Inspect exception type/text only where authorised; stack traces and dynamic messages can contain internal paths or data.

## Status and level reference

| Final status | Meaning | Operational action |
| --- | --- | --- |
| OK | Execution completed without a higher-severity status | Still verify required external delivery/output. |
| Warning | Non-fatal warning raised | Review whether output is acceptable; warnings can reveal partial/degraded processing. |
| Issue | Business/data issue state | Follow the Flow's configured handling and verify rejected/partial records. |
| Duplicate | Duplicate condition recorded | Confirm duplicate policy and that no unintended second effect occurred. |
| Cancelled | Execution stopped or an expected no-work/deadlock path cancelled it | Read the reason; Cancelled is not automatically an infrastructure failure. |
| Error | Fatal/error level recorded | Find the first causal item and reconcile side effects before retry. |

Message levels 0, 6 and 30 set Error; levels 2/10/40 set Warning; level 3 sets Issue; level 4 Duplicate; level 5 Cancelled. Deadlock exceptions are specially converted to Cancelled/deadlock state for retry handling.

## Detail capture and retention

Flow settings control whether SQL, HTTP communications, Transport trace and file data are captured and which final statuses are saved or emailed. Detailed capture can be sensitive and high volume. Enable it only with approval, reproduce one controlled item, export a sanitised excerpt and return settings to their governed state.

Persisted log-item descriptions can be truncated (the SQL Server 2014 support mode uses a shorter limit), while fuller exception/object detail may exist in the saved module representation. Do not infer missing text from a truncated grid row.

## Escalation evidence

Provide the log number, Flow identity, trigger/executer, start/end time, final status, first causal item, relevant file/Transport IDs and sanitised downstream evidence. Never include credentials or unredacted payloads.

## Recovery boundary

See [Flow troubleshooting](flow-troubleshooting.md), [status and logging semantics](../design-and-build/flows/runtime/status-and-logging.md) and [reprocess and recover](reprocess-and-recover.md).
