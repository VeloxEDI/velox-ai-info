---
title: "Troubleshoot Flow execution"
description: "Diagnose a Flow that does not start, complete or return the expected status"
sidebar_position: 80
slug: /operations/flow-troubleshooting
classification: public
status: approved
owner: Cam Hart
keywords:
  - "flow"
  - "troubleshooting"
  - "status"
---

Use this workflow when a Flow does not start, stops, is cancelled, hangs, retries or produces an unexpected status/output. Separate trigger registration, execution admission, data/step behaviour and asynchronous Transport delivery.

## Symptom matrix

| Symptom | Checks |
| --- | --- |
| Never starts | Correct context/host; Flow active/not archived; Velox processing enabled; trigger manager loaded; schedule window, monitor path/pattern or REST route; maximum-concurrency admission. |
| Starts but waits | Per-Flow semaphore/concurrency, database pool, file lock/wait, external call/command, linked/Sub Action and service task view. REST uses a separate path and does not visibly use the normal Flow semaphore. |
| Cancelled | No-source/no-test-file reason, manual/service stop, deadlock conversion/retry, retry valve and explicit cancellation message. Cancelled is not automatically an error. |
| Error/Issue/Warning | First causal log item, selected Definitions/Connections, step order, script/SQL/Map/Report configuration and configured continue/stop policy. |
| Flow OK but output absent | Output step/Definition/file path, queue registration and separate Transport Log/destination acknowledgement. |
| Duplicate/partial effects | Prior attempts, retry configuration, database commit boundary, file movement and command/message/API side effects. |

## Diagnostic procedure

1. Preserve the original run/log number, trigger input, status and external-state evidence.
2. Compare current module identity/version and dependencies with the known-good configuration.
3. Read [Execution Logs](execution-logs.md) in step order and identify the first causal boundary.
4. Reproduce only in the correct test context with sanitised/controlled input. Test Run can still execute SQL, file, command and external side effects; it is not a universal sandbox.
5. Apply one reversible correction and run one controlled item.
6. Verify DB transactions, files, reports, messages/API calls and queued Transport separately.

## Escalation evidence

For escalation include Flow FID/name, trigger, executor, concurrency/retry settings, log number/status, first causal item, affected step and sanitised input/output identifiers.

## Recovery boundary

See [runtime semantics](../design-and-build/flows/runtime/ordering-concurrency-and-transactions.md), [retry/failure](../design-and-build/flows/runtime/retry-failure-and-cancellation.md) and [reprocess and recover](reprocess-and-recover.md).
