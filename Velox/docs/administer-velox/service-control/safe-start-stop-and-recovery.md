---
title: "Start, stop and recover services safely"
description: "Control Velox services without abandoning active work or confusing Windows and Velox processing state."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [start service, stop service, recovery, graceful shutdown]
---

## Before a planned stop

1. Confirm the connection/environment and exact service instance.
2. Review running Flows/processes, schedules, monitors and outbound Transport queue state.
3. Disable or pause new processing through the approved control while allowing active work to complete.
4. Wait for a safe state and record outstanding Flow/Transport identifiers.
5. Stop the Windows service and confirm process exit.

The configured `MaxWaitBeforeTermination` defaults to 3,600 seconds, but stability-critical paths can still reach forced termination. Do not assume a stop request preserves every in-memory operation.

## Start and verify

1. Confirm databases, ProgramData and external dependencies are available under the service identity.
2. Start the service once and inspect startup/synchronisation logs.
3. Confirm IPC/process status from Designer.
4. Run a controlled Flow or REST check appropriate to the service.
5. Re-enable normal triggers gradually and monitor Flow/Transport Logs.

## Recover from an unplanned stop

Preserve the last service/system logs and identify work that may have crossed an external side-effect boundary. Reconcile database/file/report output and Transport Logs before rerunning. Use Flow rerun only for Flow state and Transport retry only for queued delivery state; do not apply both automatically.

See [service troubleshooting](../../operate-and-troubleshoot/service-troubleshooting.md) and [reprocess and recover](../../operate-and-troubleshoot/reprocess-and-recover.md).
