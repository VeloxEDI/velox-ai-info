---
title: "Status, event and error reference"
description: "Interpret Velox Flow log statuses, message levels, file events, Transport states and API errors."
sidebar_position: 60
classification: public
status: approved
owner: Cam Hart
keywords: [Flow status, log level, file event, Transport status, problem json]
---

## Flow/log status

| Stored value | Display | Meaning |
| --- | --- | --- |
| 0 | Not Set | No final status established; investigate incomplete creation/execution. |
| 1 | Successful | Completed without a higher-severity state; verify external results. |
| 2 | Warning | Non-fatal warning occurred. |
| 3 | Issue | Business/data issue recorded. |
| 4 | Duplicate | Duplicate condition recorded. |
| 5 | Cancelled | Execution cancelled, no-work condition or deadlock special case. Read the reason. |
| 6 | Error | Error/fatal outcome. |
| 7 | Test | Test-specific status/message. |
| 8 | Note | Highlight/note status. |

Status only escalates according to runtime severity logic. Message levels 0, 6 and 30 set Error; 2, 10 and 40 set Warning; 3 sets Issue; 4 Duplicate; 5 Cancelled. Levels 1, 7, 8, 20 and 50 are informational/test/note-style and do not independently escalate final status in the reviewed mapping.

Deadlock exceptions of recognised DB exception types containing `DEADLOCK` are specially logged as deadlock/cancelled and can participate in retry logic. Do not reinterpret every Cancelled run as user cancellation.

## File events

| Value | Display | Meaning |
| --- | --- | --- |
| 0 | None | No classified file event |
| 1 | Read | File read as input |
| 2 | Write | File written |
| 3 | Downloaded | Remote input downloaded |
| 4 | Audited | File copied/moved to audit lifecycle |
| 5 | Errored | Error lifecycle move/event |
| 6 | Issue | Issue lifecycle move/event |
| 7 | Moved Temp | Temporary lifecycle move |
| 8 | Transporting | File prepared/moved for Transport |
| 9 | Deleted | Delete event recorded |

These are Velox file-lifecycle events, not proof that an external receiver accepted content.

## Transport status

`Sending`, `Completed`, `Cancelled`, `Failed` and `Test` are stored separately from Flow status. Review attempts and next-attempt time. `Completed` means the protocol adapter completed its operation, not universal end-to-end business acknowledgement.

## Error surfaces

| Surface | Use |
| --- | --- |
| Flow/System/Transport Logs | Ordered Velox messages, status, exception and optional communication detail |
| Designer dialog | Foreground validation/execution failure; background equivalents can be routed to logs/events |
| Windows Application Event Log | Service/background startup, shutdown and error evidence |
| REST response | Configured success/client/server status; failed Flows can return `application/problem+json` |
| Raised provider/OS/protocol exception | Dynamic external/library detail; capture exact type/code/text at runtime |

REST problem responses can include exception type/text or error description plus a saved log instance number. Apply gateway error-disclosure policy and avoid putting secrets/data into log descriptions. See [Execution Logs](../operate-and-troubleshoot/execution-logs.md) and [API troubleshooting](../operate-and-troubleshoot/api-troubleshooting.md).
