---
title: "Flow status and logging"
description: "Interpret Flow status severity, saved-log filters, detail controls, notifications and file/Transport log events."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [Flow status, execution log, logging, notification, Business Issue]
---

Velox uses status as an accumulating result. A more severe status is not erased by a later less-severe result.

| User-facing status | Meaning for investigation |
| --- | --- |
| **Ok** | Configured attempt completed without a more severe recorded result; still verify asynchronous Transport/business outcome. |
| **Warning** | Work completed with a condition requiring review. |
| **Business Issue** | Data/business condition prevented the intended result. |
| **Duplicate** | Duplicate logic identified work that must be reconciled rather than blindly replayed. |
| **Cancelled** | Execution was intentionally/conditionally stopped or had no executable work. |
| **System Error** | Technical failure; earlier external effects may remain. |

## Default persistence and notification

New Flows save logs for Ok, Warning, Business Issue, Duplicate and System Error; Cancelled is not selected. Notifications default to Warning, Business Issue, Duplicate and System Error; Ok and Cancelled are clear. The Flow can use default administrator/notification addresses or Flow-specific values.

Selected notification status requests an email; it is not proof of delivery or an incident-response SLA. Test SMTP/recipient configuration in each environment.

## Detail controls

SQL, HTTP communication and Transport trace logging default selected; File Data logging defaults cleared. These controls can greatly increase volume and can capture payloads, headers, endpoints, personal data or secrets because no universal redaction layer should be assumed. Enable only approved evidence, restrict access/retention and return diagnostics to normal after investigation.

File and Transport event records connect the Flow attempt with subsequent file movement/delivery processing. Use them with the final status and receiver evidence. REST failure can return a problem-details-style JSON response built from logged errors; sanitise client-visible messages.

See [Execution Logs](../../../operate-and-troubleshoot/execution-logs.md) and [retry/failure](retry-failure-and-cancellation.md).
