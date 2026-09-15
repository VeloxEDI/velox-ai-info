---
title: "Flow properties and execution policy"
description: "Configure logging, notification, retry, cancellation and run-until policies"
sidebar_position: 40
slug: /flows/execution-policy
classification: public
status: approved
owner: Cam Hart
keywords:
  - "retry"
  - "notification"
  - "cancellation"
---

Use the Flow **Execution** settings to control repetition, retry, cancellation, logging and notification. These controls affect the complete Flow and are separate from retry settings on an individual Transport.

## Flow identity and trigger fields

| Setting | New-Flow default | Ownership |
| --- | --- | --- |
| **Flow name** | New Flow | Common module name used in configuration, selection and logs. Rename only after checking all users/relations. |
| **Trigger** / `ScheduleType` | None/manual | Selects no automated trigger, schedule, file monitor, REST or linked execution. Configure it on the matching [trigger page](triggers/manual-runs.md). |
| **Maximum threads per Flow** / `MaxThreadsPerAction` | `1` | Limits relevant manual, schedule and monitor concurrency; non-positive values are forced to one by runtime semaphore creation. The REST path does not use that normal semaphore. |
| **Monitored file item** | None | File data item used by the file-monitor trigger. |
| **Linked parent and order** | No parent; order `1` | Parent Flow and relative order for successful linked execution. |

Trigger-specific fields are owned by [schedules](triggers/schedules.md), [file monitors](triggers/file-monitors.md), [REST invocation](triggers/rest-invocation.md) and [linked Flows](triggers/linked-flows.md). Runtime-only flags such as REST/Sub Action state, current status and script event numbers are assigned during execution and are not normal saved configuration choices.

## Scope

This reference covers the current Flow-level execution policy in Velox Designer. It does not define service levels, retention policy, message delivery guarantees or a substitute for application-specific recovery procedures.

:::warning Repetition can duplicate external effects
A failed Flow attempt can have already written a file, started a command, sent data or changed an external system. Database rollback does not reverse every external effect. Enable automatic repetition only after proving that the complete Flow is safe to repeat or has a controlled duplicate-detection method.
:::

## Execution settings

| Setting | Accepted value | New-Flow default | Effect and constraints |
| --- | --- | --- | --- |
| **Active** | Selected or clear | Selected | Allows the configured service trigger to load and run. Clear it while preparing automated execution. |
| **Re-run the flow until an error/cancelled status** | Selected or clear | Clear | Repeats manual and scheduled execution, and a monitored Flow run manually in Designer, until a duplicate, cancellation or system error stops the sequence. It does not apply to normal service file-monitoring, REST API or test execution. Do not use it as a queue or unconditional service loop. |
| **Auto retry up to _n_ times if an errors occurs** | Selected or clear; retry count | Clear; `3` retries | After a failed attempt is finalised, starts the whole Flow again up to the configured retry count. Successful effects outside the rolled-back work can occur again. |
| **waiting _n_ secs between attempts** | Whole seconds | `5` seconds | Delays the next automatic Flow attempt. The delay does not make an unsafe operation idempotent. |
| **Continue with next action step if previous one is cancelled** | Selected or clear | Clear | Clears a step cancellation so a later active step can run when an earlier step has succeeded. Use only when downstream steps are explicitly safe after partial completion. |

Combining continuous re-run with continuation after cancellation can create an unintended long-running loop. Velox warns about this combination when the Flow is saved; treat the warning as a design defect unless the complete termination behaviour has been proved.

## Log detail settings

| Setting | New-Flow default | Effect and constraints |
| --- | --- | --- |
| **Log SQL statements (not recommended with large datasets)** | Selected | Adds SQL detail to execution evidence and can substantially increase log size. |
| **Log HTTP communication (not recommended with large datasets)** | Selected | Adds HTTP communication detail. Payloads or headers may contain sensitive values. |
| **Log File Data (creates large log data storing all file data in database)** | Clear | Stores file content in the database log and can expose business data or consume significant storage. |
| **Log Transport communication traces** | Selected | Adds Transport communication traces, which may contain endpoints, protocol detail or message content. |

Enable only the detail needed for an approved diagnostic purpose. Use sanitised test data, restrict log access and turn high-volume or payload logging off after investigation. Do not assume that secrets or personal data are automatically removed.

## Save and notification status filters

Both **Save Log on following statuses** and **Send Notification on following statuses** offer these statuses:

- **Ok**
- **Cancelled**
- **Warning**
- **Business Issue**
- **Duplicate**
- **System Error**

For a new Flow, saved-log statuses are **Ok**, **Warning**, **Business Issue**, **Duplicate** and **System Error**. **Cancelled** is clear. Notification statuses are **Warning**, **Business Issue**, **Duplicate** and **System Error**; **Ok** and **Cancelled** are clear.

The notification section can use **Use default administrator & notification email address** or Flow-specific **Administrator Email** and **Notification Email** values. Treat addresses as governed configuration and test notification delivery in the target environment. A selected status requests a notification; it does not establish a delivery guarantee or response commitment.

## Example policy

For an illustrative monitored import that has not yet proved safe replay, keep **Auto retry** and **Re-run the flow until an error/cancelled status** clear, use one monitor thread, save all material outcome statuses, and notify only the roles approved for the environment. After a controlled failure test confirms duplicate prevention and recovery, consider a bounded retry count and verify the destination after every attempt.

## Constraints and failure behaviour

- A Flow with no active action steps ends as cancelled rather than successful.
- Step results contribute to the overall Flow status; a more severe outcome is not hidden by a later successful step.
- Flow auto-retry repeats the whole attempt. It is independent of retry and queue behaviour configured on a Transport.
- Test execution does not make every step side-effect free. Follow the safeguards in [Run and test a Flow manually](triggers/manual-runs.md).
- Completion can include data finalisation, file movement, log saving, notification and successful linked-Flow processing. A failure late in that sequence does not prove that earlier external effects did not occur.
- Clearing **Active** prevents new service-triggered work after runtime configuration is updated, but it does not reverse a completed effect or guarantee that already-running work has stopped.

## Related references

- [Schedule a Flow](triggers/schedules.md)
- [Monitor files with a Flow](triggers/file-monitors.md)
- [Flow runtime semantics](runtime/index.md)
- [Review Execution Logs](../../operate-and-troubleshoot/execution-logs.md)
- [Troubleshoot Flow execution](../../operate-and-troubleshoot/flow-troubleshooting.md)
