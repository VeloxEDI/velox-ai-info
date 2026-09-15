---
title: "Flow performance considerations"
description: "Tune Velox Flow concurrency, data volume, logging, connections and external waits without weakening correctness."
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords: [Flow performance, concurrency, logging volume, connection pool, file size]
---

Optimise a measured bottleneck after correctness tests. Increasing threads or suppressing validation/logging can turn a slow integration into duplicated, unordered or unrecoverable work.

## Main controls and costs

| Area | Cost/risk | Safer approach |
| --- | --- | --- |
| `MaxThreadsPerAction` | More concurrent database sessions, memory, files and receiver calls | Start at default `1`; increase only with input claiming, output uniqueness and load tests. REST requires separate upstream limiting. |
| Database Connection pooling/persistence | Reconnect overhead versus pooled resource consumption/stale sessions | Measure on the actual provider and service host; set limits with the DBA. |
| Definition/query breadth | Large datasets increase memory, transaction duration and log/report work | Filter at source, expose only required fields and process bounded batches where the design supports it. |
| SQL/HTTP/file/Transport detail logs | Database/storage growth and sensitive-data exposure | Capture only needed evidence for a bounded period. File Data defaults off for good reason. |
| Command waiting/delay | Worker remains occupied; fixed delay does not establish readiness | Use synchronous completion/exit checks or a reliable downstream signal. |
| Automatic retry | Repeats load and external effects during an outage | Use bounded backoff, idempotency and operational stop conditions. |
| File size/encoding/schema validation | Parser memory/CPU and potentially expensive malformed input | Test maximum accepted size and reject/limit untrusted inputs at the boundary. |

## Measurement checklist

Record trigger time, queue/wait time, source rows/files/bytes, step durations, database sessions/locks, log volume, output count, Transport delay and receiver acknowledgement. Test ordinary and peak concurrency, slow dependencies, failures and recovery. Monitor both service resources and downstream throttling.

Thread cleanup releases per-thread SQL/system pools after execution; a stuck external wait or very large in-memory data set can still hold resources for the run. See [ordering/concurrency](ordering-concurrency-and-transactions.md), [database Connection settings](../../connections/database/index.md#advanced-settings) and [operations monitoring](../../../operate-and-troubleshoot/index.md).
