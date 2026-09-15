---
title: "Ordering, concurrency and transactions"
description: "Understand sequential Flow steps, concurrent Flow attempts, per-Flow limits and database/file transaction boundaries."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [Flow ordering, concurrency, MaxThreadsPerAction, semaphore, transaction]
---

Velox serialises steps inside one attempt but can execute several attempts/Flows concurrently. Design both levels explicitly.

## Ordering within an attempt

Active steps run in list order. The next step starts only after the current call returns and only while Flow status is successful and not cancelled. Asynchronous work started by a Command Line step can outlive that call when **Wait for process** is cleared; outbound Transport delivery occurs later in Transport processing.

Sub Actions execute synchronously at their list position. Linked successor Flows execute only after successful completion, in configured link order.

## Concurrent attempts

`MaxThreadsPerAction` defaults to `1`. Non-positive values are forced to one when the execution semaphore is created. Manual, scheduled, monitor and relevant Transport worker paths wait for that per-Flow semaphore, with a one-hour wait timeout; a timeout exits without running the Flow.

The action pool removes an in-use Flow instance and returns/frees it after execution, preventing the same object instance being shared concurrently. Different instances/Flows can still compete for database, file, memory and remote-system resources.

REST uses a separate thread path. Although the maximum value is copied into REST manager state, the reviewed REST execution does not wait on the normal per-Flow semaphore. Control REST concurrency upstream and test it separately.

## Transaction boundaries

| Resource | Success | Failure or test | Important limit |
| --- | --- | --- | --- |
| DB Definition Connections | Commit through `CommitData(true)` | Roll back through `CommitData(false)` | A Connection can disable transactions; provider and independently committed work vary. |
| System configuration database connection | Commit | Roll back | Used by applicable runtime/system writes. |
| Source files | Move to Audit or Transport | Move to Error; test does not move | Filesystem operations are not atomic database transactions. Deadlock-cancel path can leave the file. |
| Command/report/remote script effects | Already performed | Not automatically undone | Require their own idempotency/recovery. |
| Outbound Transport | Work registered, later delivered | Depends on when failure occurs | Flow and Transport retries are separate. |

Before increasing concurrency, prove that input claiming, output naming, database isolation, script/module state and receiver idempotency remain correct. See [performance](performance-considerations.md) and [file locking](../../connections/file/locking-retries-and-failure.md).
