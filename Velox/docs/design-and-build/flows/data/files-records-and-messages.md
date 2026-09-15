---
title: "Files, records and messages in a Flow"
description: "Understand how physical files, structured dataview records, Flow attempts and outbound messages relate in Velox."
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords: [file, record, message, Flow attempt, Transport queue]
---

Velox uses related but distinct processing units. Keeping them separate is essential for counts, retry and duplicate prevention.

| Unit | Meaning | Completion evidence |
| --- | --- | --- |
| Physical file | A path selected through a File Connection or monitor | File event and final audit/error/transport location |
| Dataview/record | Structured data loaded through a Definition | Record counts, field validation and destination results |
| Flow attempt | One `ExecuteOnce` sequence over configured data and steps | Final Flow status/log after commit/rollback and closing data |
| Transport queue item | Registered outbound work created from a file event | Transport log/queue state, then protocol-specific delivery evidence |
| External business message | Payload accepted/processed by a receiver | Receiver acknowledgement or business reconciliation, not merely Velox Flow success |

One file can contain many business records; one Flow can create several files or Transport events; one automatic retry creates another Flow attempt. Therefore a single `OK` count does not establish end-to-end exactly-once delivery.

## Processing sequence

1. A trigger starts the Flow and supplies any monitor/request context.
2. Data items open physical or database sources into structured dataviews.
3. Active steps run sequentially and may transform, save, report, call a command or register outbound work.
4. Velox commits/rolls back database-backed data according to final status, closes/resets data, and moves eligible source files.
5. Logs/notifications are finalised; successful linked Flows can follow.
6. Transport workers deliver queued outbound files separately.

Failures late in this sequence can occur after earlier external effects. Before retrying, correlate Flow attempt, file events, Transport events and receiver state. Use [runtime semantics](../runtime/index.md), [file data items](file-data-items.md) and [outbound Transport steps](../steps/outbound-transport-step.md) for the detailed boundaries.
