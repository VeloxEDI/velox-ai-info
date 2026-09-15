---
title: "Reprocess failed work safely"
description: "Retry, rerun or resend work using confirmed controls"
sidebar_position: 60
slug: /operations/reprocess-and-recover
classification: public
status: approved
owner: Cam Hart
keywords:
  - "retry"
  - "rerun"
  - "reprocess"
---

Reprocessing can repeat database, file, command, message and network side effects. Choose the recovery control that owns the failed boundary; do not rerun an entire Flow to repair only a queued Transport unless its full execution is safe to repeat.

## Choose the recovery level

| Failure boundary | Preferred recovery decision |
| --- | --- |
| Flow never started | Correct trigger/service/configuration, then run one controlled Flow if input is still valid. |
| Flow failed before external side effects | Correct the cause and rerun only after logs and data state confirm no committed effect. |
| Flow failed after DB/file/message/API effect | Reconcile each effect, design an idempotent repair or compensate; do not blind-rerun. |
| Outbound Transport queued/failed | Use the Transport record's retry/recovery path after receiver reconciliation; avoid recreating the Flow output. |
| Timeout/connection loss | Treat result as ambiguous until the destination confirms acceptance/non-acceptance. |
| Deadlock cancellation | Confirm automatic retry state/attempts and idempotency before manual replay. |

## Controlled procedure

1. Freeze the affected scope and preserve Flow/Transport numbers, files, business keys and target evidence.
2. Find the first failure boundary and list completed/unknown/not-started effects.
3. Correct the causal configuration, dependency or data condition and validate it non-destructively.
4. Select the narrowest supported replay, retry, resend, repair or compensation.
5. Process one item with enhanced monitoring; verify every destination and duplicate-control key.
6. Release the backlog gradually and monitor attempts, age, throughput and new failures.

## Escalation evidence

Record the decision for each ambiguous side effect and who verified the receiver. Preserve original evidence even after a replacement transaction succeeds.

## Recovery boundary

Flow auto-retry and Transport retry are separate mechanisms. Review [retry/failure semantics](../design-and-build/flows/runtime/retry-failure-and-cancellation.md) and [Transport Logs](transport-logs.md).
