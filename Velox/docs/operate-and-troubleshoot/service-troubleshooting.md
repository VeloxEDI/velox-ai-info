---
title: "Troubleshoot Velox services"
description: "Diagnose installation, start, stop and restart failures"
sidebar_position: 70
slug: /operations/service-troubleshooting
classification: public
status: approved
owner: Cam Hart
keywords:
  - "service"
  - "troubleshooting"
  - "windows"
---

Use this workflow when Velox Service or API Service will not install, start, stop, remain running or load expected work. Distinguish the Windows Service Control Manager state from Velox processing state inside a running service.

## Symptom matrix

| Symptom | Check first | Next evidence |
| --- | --- | --- |
| Install fails | Approved account/password, Log on as a service, service name collision, executable path and SCM permission | Designer error and Windows event/SCM result |
| Starts then stops | Required `-c` configuration key and `-n` name, Connections.json/database/schema access, General Setup load, ProgramData rights | Exact instance's Application Event Log and system/startup log |
| Running but no work | Velox processing state, active modules, test suffix/context and manager synchronisation | Schedule/monitor/Transport/API load messages |
| Designer cannot control/query | Exact service instance, authorised service users, IPC name/context and local permissions | IPC last error plus SCM state |
| Stop/restart times out | Waiting/running task state and configured internal shutdown wait | View Processes, Flow/Transport/external state |

Designer SCM start/stop polling normally has a 30-second timeout. The service can remain stop-pending for its separate configured wait while execution threads finish. Do not kill the process merely because the Designer timeout expires; assess the work and organisational emergency procedure.

## Safe recovery

1. Preserve service name/display name, executable path/arguments, account, process ID, timestamps and first event/startup error.
2. Correct one cause without changing the production/test context accidentally.
3. Start with Velox processing constrained, confirm setup/manager load and query health through Designer/IPC.
4. Run one controlled Flow or API request and verify logs/external state before restoring triggers.

## Escalation evidence

Never include the service password. Record the account name only where approved and sanitise connection keys/paths if they reveal sensitive deployment detail.

## Recovery boundary

See [service control](../administer-velox/service-control/index.md), [safe start/stop](../administer-velox/service-control/safe-start-stop-and-recovery.md) and [incident evidence](incident-evidence-checklist.md).
