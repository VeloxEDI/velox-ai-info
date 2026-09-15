---
title: "Configure a Map step"
description: "Select a Map and compatible source and destination Flow data, then verify transformation and save behaviour."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [Map step, Flow, source data, destination data, transformation]
---

A Map step opens a source data item, opens a destination and executes a selected Map. The step adds no type-specific persisted fields beyond the [common step properties](step-concepts-and-common-properties.md); its exact contract comes from the Map and the two data items.

| Field | Required | Effect |
| --- | --- | --- |
| **Map** | Yes | `ActionFIDS` reference to the transformation module. |
| **Source Data** | Yes | Compatible item opened for read. The Map's designed source type controls the selector. |
| **Destination Data** | Yes | Compatible item opened for output/save. |
| **Ignore empty source data** | Optional | Allows the step to continue without source rows only where empty input is a valid business result. |
| **Active** | Yes | New step is active; clear it while an incomplete change is saved. |

## Configure and verify

1. Test the source/destination Definitions independently.
2. Select the reviewed [Map](../../transformations-output/maps/index.md), source and destination.
3. Confirm the Flow data item roles—not merely similar Definition names.
4. Test zero, one and multiple records, nulls, invalid values, parent/detail structures and destination write errors.
5. Compare source counts, mapped/rejected counts and committed destination data.

The runtime catches Map exceptions and records a Map error, which stops normal later steps. A live successful attempt later commits Definition-backed data; a failed/test attempt requests rollback. Files, commands and other external effects are outside that database rollback. Changing the Map or either Definition can invalidate field references without changing the step name, so use dependency checks and rerun the full contract suite.
