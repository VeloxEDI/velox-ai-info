---
title: "Flow runtime semantics"
description: "Follow the complete Velox Flow attempt from trigger and data opening through ordered steps, finalisation, logging and linked execution."
sidebar_position: 10
classification: public
status: approved
owner: Cam Hart
keywords: [Flow runtime, ExecuteOnce, commit, file movement, linked Flow]
---

A Flow run is more than its action-step loop. Correct operation and recovery require evidence from the complete attempt.

## One attempt

1. A manual, schedule, file monitor, REST or parent/linked trigger obtains a loaded Flow instance.
2. Velox initialises status/log context and, on the first applicable service execution, can check incoming Transports.
3. Each active action step executes in order while status is successful and the run is not cancelled.
4. If no steps are configured, the Flow becomes cancelled.
5. In live mode, success commits Definition/system database work and moves eligible source files to Audit or Transport; failure rolls back database work and moves eligible files to Error.
6. In test mode, database work is rolled back and normal source-file/Transport movement is suppressed.
7. Data is closed/reset; an eligible failed attempt can auto-retry after its delay.
8. Final status is logged, selected logs are saved, REST error responses and notifications are produced where applicable.
9. On success, configured linked successor Flows run in order.
10. Runtime resources and per-thread database pools are released and the Flow object is reset/returned to its pool.

## What to read next

- [Ordering, concurrency and transactions](ordering-concurrency-and-transactions.md)
- [Retry, failure and cancellation](retry-failure-and-cancellation.md)
- [Status and logging](status-and-logging.md)
- [Performance considerations](performance-considerations.md)
- [Files, records and messages](../data/files-records-and-messages.md)

An earlier external effect may remain even when final status is Error. Always correlate the log, database outcome, source-file location, outbound queue/delivery and receiving system before rerunning.
