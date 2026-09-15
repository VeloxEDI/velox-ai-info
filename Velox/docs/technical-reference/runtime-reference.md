---
title: "Velox runtime reference"
description: "Understand execution hosts, triggers, concurrency, refresh and completion"
sidebar_position: 40
slug: /advanced/runtime-reference
classification: public
status: approved
owner: Cam Hart
keywords: [runtime, service, concurrency]
---

## Execution hosts and boundaries

| Trigger | Host | Admission/refresh | Completion boundary |
| --- | --- | --- | --- |
| Manual/Test Run | Designer interactive process/identity | Current Designer configuration/module state | Flow run returns; test mode does not suppress all external effects |
| Schedule | Velox Service schedule manager | Active scheduled Flows loaded/synchronised; configured per-Flow concurrency applies | Flow execution completes under service identity |
| File monitor | Velox Service monitor manager | Directory watcher and pending-file queue; existing files can be scanned at manager start | Flow ends, then file lifecycle/external effects still need verification |
| Inbound Transport | Velox Service inbound manager | Transport-specific polling/receive plus action thread | Receive, Flow processing and later outbound work have separate checkpoints |
| REST | Velox API Service REST manager | Active endpoints keyed by configured path; current branch handles GET/POST | HTTP response follows Flow outcome/timeout; normal Flow semaphore is not visibly used and gateway is separate |
| Sub Action | Current parent execution | Loaded child Flow receives parent test/locals/log context | Runs within parent orchestration; external effects remain independent |
| Linked successor | Current execution host after parent success | Success-link chain | Successors run sequentially and stop when a linked Flow fails |
| Outbound Transport step | Flow host plus outbound manager | Step registers queue work; manager polls using Transport attempt interval | Flow can finish before delivery completes asynchronously |

## Ordering, transactions and concurrency

Flow steps execute in configured order, but records/threads/transports need not be FIFO. Normal Flow execution uses a per-Flow semaphore with a one-hour acquisition wait in reviewed code; scheduler/manager queues and DB connection pools impose additional limits. REST execution copies configured concurrency but does not visibly acquire that normal semaphore.

Database work can participate in Velox transaction handling; files, commands, reports, messages and remote API calls cannot be assumed to roll back with it. A linked/Sub Action does not create a universal distributed transaction.

## Status, retry and refresh

Log severity only escalates to higher-priority outcomes. Deadlock exceptions can become Cancelled/deadlock state for retry handling. Flow retry replays Flow execution; Transport retry re-attempts a queued Transport item. Either can duplicate non-idempotent side effects.

Some service managers resynchronise configuration, while API routes and other startup-loaded state can require a service/front-end restart. After promotion, prove which module version, trigger and endpoint the runtime actually loaded.

Cancellation, timeout and Windows service stop do not prove rollback of files, commands, messages or remote calls. Design idempotency, correlation and reconciliation into integrations.

- [Flow concepts](../design-and-build/flows/flow-concepts.md)
- [Daily operations](../operate-and-troubleshoot/daily-operations.md)
- [Control services](../administer-velox/service-control/index.md)
- [Status, event and error reference](status-event-and-error-reference.md)
