---
title: "Configure a Sub Action step"
description: "Call another Flow synchronously as an ordered step, passing test mode and local values into the parent log context."
sidebar_position: 100
classification: public
status: approved
owner: Cam Hart
keywords: [Sub Action, sub-Flow, linked Flow, cycle, Flow locals]
---

A Sub Action step synchronously calls another configured Flow within the parent's ordered action list. It is different from a linked successor, which starts only after a Flow completes successfully.

| Field | Default | Effect |
| --- | --- | --- |
| **Flow** / `ActionFIDS` | Empty | Target Flow reference. The Sub Action subtype has no other published settings beyond common step properties. |
| **Active** | Selected | Controls whether the call occurs at this position. |

The child inherits the parent's Test flag and borrows its local values while it runs. Child cleanup closes variable datasets but does not null the parent's borrowed local values; the child references are removed when the call finishes. A child failure prevents normal later parent steps. The call does not create an independent guarantee that completed child external effects can be rolled back by the parent.

If a DB Connection used by the child has **Disconnect after use** selected, Velox disconnects it when the temporary child connection module is released. The next use must reconnect, so test both session cleanup and reconnect overhead in the target runtime.

## Design rules

1. Use a Sub Action only for a reusable, bounded synchronous unit whose completion is required before the next parent step.
2. Document inputs/locals, data/environment dependencies, side effects and possible statuses.
3. Prohibit direct and indirect cycles. No reliable cycle guard is confirmed in the current execution path.
4. Test the child independently, then through the parent with failure and empty-data cases.
5. Account for nested execution time, database/external resource use and any reconnect cost from **Disconnect after use**.

Do not confuse this step with [linked Flow configuration](../triggers/linked-flows.md). For sequencing and transaction boundaries, see [ordering, concurrency and transactions](../runtime/ordering-concurrency-and-transactions.md).
