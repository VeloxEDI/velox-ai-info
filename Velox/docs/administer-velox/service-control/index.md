---
title: "Control Velox services"
description: "Start, stop, restart, enable and disable Velox processing safely"
sidebar_position: 10
slug: /administration/service-control
classification: public
status: approved
owner: Cam Hart
keywords: [service, api-service, operations]
---

Velox Service runs scheduled, monitored and Transport work. Velox API Service runs REST-enabled Flows. Windows service state and Velox processing state are separate controls.

## Planned stop or restart

1. Identify the service instance, connection/context and active work.
2. Prevent new work by disabling Velox processing or upstream triggers where available.
3. Allow active work to finish or record the approved interruption decision.
4. Stop the Windows service and confirm it has stopped.
5. Perform the change, start the service and inspect startup logs.
6. Confirm configuration loaded, run a controlled health check, then re-enable work gradually.

Do not terminate a process merely because stop is slow; it may be completing database, file or network work. If restart fails, keep triggers disabled, check service identity, executable path, connection configuration and dependency access, then restore the previous known-good state.

- [Designer and engine services](designer-and-engine-services.md)
- [Velox API Service](api-service.md)
- [Safe start, stop and recovery](safe-start-stop-and-recovery.md)
- [Daily operations](../../operate-and-troubleshoot/daily-operations.md)
- [Service troubleshooting](../../operate-and-troubleshoot/service-troubleshooting.md)
