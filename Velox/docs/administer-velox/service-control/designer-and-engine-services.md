---
title: "Operate Velox Designer and engine services"
description: "Understand Designer, Velox Service, Windows service state and Velox processing state."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [Velox Designer, Velox Service, service state, IPC]
---

Velox Designer is the interactive configuration application. Velox Service hosts schedules, file monitors, inbound Transport checks and outbound Transport delivery. They share configuration but have separate processes, caches and permissions.

| State/control | Meaning | Verification |
| --- | --- | --- |
| Windows service started/stopped | Whether the service process is running | Windows service state and process existence |
| Velox service enabled/disabled | Whether Velox processing is enabled in General Setup/runtime | Designer service status plus absence/presence of new processing |
| Flow/module active/inactive | Whether that configuration is eligible for runtime managers/use | Module state and manager synchronisation/log evidence |
| Designer open/closed | Interactive process only | Does not prove background services are healthy |

Designer communicates with Velox Service through a connection/environment-specific IPC name. **View Processes**, enable/disable and start/stop/restart actions depend on elevation or configured Service Users plus Windows rights.

After a module or Flow change, verify the owning service has resynchronised it. The core Velox Service implements relevant change/enable/disable operations, but live behaviour remains type-specific; restart gracefully when the concrete guide requires it.
