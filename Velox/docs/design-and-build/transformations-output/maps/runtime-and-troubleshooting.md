---
title: "Map runtime and troubleshooting"
description: "Understand Map execution, destination persistence, errors, logging and safe recovery in a Flow."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [Map runtime, Map error, destination save, record count]
---

A Flow Map step loads the Map, opens source for read and destination for output, then calls Map execution. Exceptions are logged as Map errors and stop the normal later-step sequence.

## Runtime boundaries

- The Map's standalone **Test Map** previews rather than persisting its destination.
- A Flow step uses real Definitions. Database-backed destination changes participate in the Flow's later commit/rollback path unless transactions are disabled or work commits independently.
- File output is not a database transaction and can exist even if later work fails.
- Flow Test Run requests database rollback and suppresses normal file movement, but an individual script/module can still perform external effects. Use isolated destinations.
- Record/view counters and `SaveData` are reset for an execution; they are not long-lived business totals.

## Diagnose

| Symptom | Check |
| --- | --- |
| Map cannot open | Source/destination Definition availability, Connection permissions and synchronised structure. |
| Field missing/out of sync | Definition rename/removal, view relationship and saved field-name mapping. |
| No output | Source criteria/parameters, empty-source policy, event branches and destination open/save behaviour. |
| Wrong detail relationship | Parent/detail view mappings, key mapping and record-level events. |
| Duplicate destination | Prior attempt outcome, Flow/Transport retry, destination keys and replay controls. |
| Formula error | Compile in exact event scope; inspect types, nulls, Scriptlet and Variable Group references. |

Before rerunning, establish whether the first attempt wrote database rows or files. See [Flow transactions/retry](../../flows/runtime/ordering-concurrency-and-transactions.md) and [Map step](../../flows/steps/map-step.md).
