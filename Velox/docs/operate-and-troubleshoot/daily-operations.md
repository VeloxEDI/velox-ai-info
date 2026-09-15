---
title: "Perform daily Velox operations"
description: "Check services, processing, queues and failures safely"
sidebar_position: 20
slug: /operations/daily-operations
classification: public
status: approved
owner: Cam Hart
keywords:
  - "daily-operations"
  - "monitoring"
  - "service"
---

Check Windows service and Velox processing state, recent Flow failures, queued or failed Transports, disk space and agreed dependency health. Compare with the normal baseline and record anomalies before clearing, retrying or restarting anything.

## Daily checklist

| Check | Healthy evidence | Investigate when |
| --- | --- | --- |
| Windows services | Intended `VeloxService$<id>` and `VeloxAPIService$<id>` instances are Running under the approved accounts | Missing/stopped/restarting instance, unexpected account/path or start error |
| Velox processing state | Runtime is enabled for the intended production/test context and managers have loaded expected work | Windows service is running but Velox processing is disabled or expected schedules/monitors are absent |
| Flow Logs | Expected recent runs exist with understood status/duration/volume | Error/Cancelled/Issue spike, missing schedule, long run or repeated retry |
| Transport Logs | Queue is draining; attempts and next-attempt dates match normal traffic | Old pending/sending item, repeated failures or completed status without receiver confirmation |
| Filesystem | Input/output/audit/error folders and ProgramData volumes have capacity and expected permissions | Stale locked files, backlog, unexpected quarantine/error files or low disk space |
| Dependencies | Required databases, shares, mail/queue/API endpoints and gateway checks meet the agreed baseline | Authentication, certificate, DNS, timeout or capacity alarms |

## Shift/period handover

Record time range, context, service/processing state, backlog counts/age, active incidents, deliberately disabled work, changes in progress and next action. Do not mark work recovered solely because an alert cleared; verify one current end-to-end transaction and any affected external destination.

## Escalation evidence

Use the [incident evidence checklist](incident-evidence-checklist.md) for deviations. Escalate recurring or unexplained failures rather than deleting evidence to make a dashboard appear healthy.

## Recovery boundary

Continue with [Execution Logs](execution-logs.md), [Transport Logs](transport-logs.md) or the symptom-specific troubleshooting page.
