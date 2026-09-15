---
title: "Design and run Flows"
description: "Learn the complete Flow lifecycle from configuration to operation"
sidebar_position: 10
slug: /flows/
classification: public
status: approved
owner: Cam Hart
keywords:
  - "flows"
  - "automation"
  - "runtime"
---

Flows coordinate the data, processing steps and trigger for an integration workload. This section is for implementers who design Flows and operators who run or investigate them.

## Choose a path

- **Understand the model** — read [Flow concepts](flow-concepts.md) for the relationship between data, steps, triggers and results.
- **Build a Flow** — [create and configure a Flow](create-flow.md), add [Flow data](data/index.md), then add [Flow steps](steps/index.md).
- **Test a Flow** — perform a controlled [manual run](triggers/manual-runs.md) and inspect its result before enabling automation.
- **Automate execution** — choose a [schedule](triggers/schedules.md) or [file monitor](triggers/file-monitors.md) only after the manual path is verified.

## Design the workload

A Flow has three main configuration areas:

1. **Data** supplies DB or File Definitions and runtime values to the Flow.
2. **Action Steps** contains the ordered work, such as Maps, Reports, scripts, outbound Transports, file routing, commands, SQL and sub-Flows.
3. **Execution** selects how the Flow starts and controls logging, notifications and other execution policy.

Start with [Flow concepts](flow-concepts.md), then use [Configure Flow data items](data/index.md) and [Configure Flow steps](steps/index.md) as the detailed design guides.

## Verify before automation

Use [Run and test a Flow manually](triggers/manual-runs.md) with sanitised data in the test configuration. A **Test Run** is not a universal transaction rollback or sandbox: confirm the side effects of every step and external system before execution.

After the Flow behaves correctly, configure its trigger and review [Flow properties and execution policy](flow-properties-and-execution-policy.md). Scheduled and monitored execution depend on VeloxService and the permissions of its service account.

## Operate and extend Flows

- [Schedule a Flow](triggers/schedules.md) for time-based execution.
- [Monitor files with a Flow](triggers/file-monitors.md) for file-driven execution.
- [Route files and run commands](file-routing-and-commands.md) for advanced host-level actions.
- [Link and call Flows](triggers/linked-flows.md) for reuse after the linked-Flow boundaries have been reviewed.
- [Flow runtime semantics](runtime/index.md) for commit, retry, status and concurrency boundaries.

Keep each Flow focused on one observable business outcome. Reuse Definitions, Maps, Reports and Transports rather than copying their configuration into several Flows.
