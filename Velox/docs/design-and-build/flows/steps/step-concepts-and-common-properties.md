---
title: "Flow-step concepts and common properties"
description: "Understand the ordered action-step model, shared properties, validation and status behaviour used by every Velox Flow step."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [Flow step, action order, source data, destination data, active step]
---

An active Flow step runs as one item in the Flow's ordered action list. Within one attempt, Velox does not run these action items in parallel: it advances while the current Flow status is successful, the run is not cancelled and another item remains.

## Shared settings

| Setting | Default | Contract |
| --- | --- | --- |
| **Action Step** / `ActionName` | Type-specific `New ... Action` | Display/log name. Make it state the business action and object. |
| **Action type** | Set by subtype | Determines validation and runtime executor. It is not a user-selected substitute for creating the correct type. |
| **Module/action reference** / `ActionFIDS` | Empty | Stable reference to the selected Map, Report, Transport or Flow where required. |
| **Active** / `ItemActive` | Selected | Inactive steps remain configured but are skipped. Record why a step is disabled. |
| **Source Data** / `Source` | None | Flow data item opened/read by the step. Compatible choices depend on type and selected module. |
| **Destination Data** / `Dest` | None | Flow data item receiving output where supported. |
| **Ignore empty source data** | Cleared | Lets an applicable step proceed when its source is empty. Enable only when empty is an explicit valid outcome. |

Changing list order changes business behaviour. A later step must not assume an output exists if an earlier step can ignore empty input, be inactive or finish with a non-success status.

## Status and cancellation

Each step logs a start and finish/error result. More severe statuses dominate less severe later statuses. Normally cancellation or failure stops the remaining action loop. The Flow-level **Continue with next action step if previous one is cancelled** policy can clear cancellation only under its implemented conditions; it does not manufacture missing output.

No configured action steps causes the Flow to finish cancelled. A disabled-only list is therefore not a successful no-op design.

## Safe change procedure

1. Keep automated triggers inactive and record the existing step order.
2. Add required [Flow data](../data/index.md) and configure the step's dedicated page.
3. Save, reopen and confirm references/order.
4. Test one side effect at a time with controlled data.
5. Inspect the execution log and every affected destination.
6. Prove retry and rollback behaviour before enabling scheduling, monitoring or REST.

**Test Run** is not universal isolation. File routing and normal outbound sending are suppressed in specific paths and database work is rolled back, but scripts, reports, commands and external calls can still have effects. See [manual runs](../triggers/manual-runs.md) and [runtime semantics](../runtime/index.md).
