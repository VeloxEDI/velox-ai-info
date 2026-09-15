---
title: "Create and configure a Flow"
description: "Create a Flow and set its core behaviour in Velox Designer"
sidebar_position: 30
slug: /flows/create-flow
classification: public
status: approved
owner: Cam Hart
keywords:
  - "create-flow"
  - "configuration"
  - "designer"
---

Create a Flow in Velox Designer, give it an explicit manual starting state and prepare it for data and action-step configuration.

## Before you begin

- **Audience:** Velox implementers.
- **Prerequisites:** Understand [Flow concepts](flow-concepts.md) and have the required Connections, Definitions and processing modules available in the test configuration.
- **Permissions:** Permission to create and save Velox modules and to inspect the resources the Flow will use.
- **Starting state:** Work in the test configuration. Define the intended input, output, success result and recovery approach before creating the Flow.

:::warning Keep new Flows manual
Do not enable a schedule, file monitor or REST trigger while building the Flow. An incomplete active Flow can process files, call external systems or change data as soon as its runtime host sees it.
:::

## Steps

1. In the Designer module tree, open **Flows**, then create a new Flow.
2. Enter a unique, descriptive **Flow Name**. Name the business outcome rather than the implementation technology.
3. On **Execution**, set **Trigger** to **When you manually start it** while the Flow is being designed and tested.
4. Clear **Active** until the data, steps and execution settings have been verified. New modules are active by default. Manual execution can still perform real work, so the active setting is not a safety boundary for manual runs.
5. On **Data**, use **Add Data...** to add the Definitions needed by the Flow. See [Configure Flow data items](data/index.md).
6. On **Action Steps**, use **Add Action...** to add the first supported step. See [Configure Flow steps](steps/index.md).
7. Give every data item and action step a descriptive name. Arrange action steps in the order they must execute.
8. Review **Notification** and log options. Do not enable payload or communication logging unless the captured data is appropriate for everyone who can access logs.
9. Select **Save**.

## Verify the result

Reopen the Flow and confirm:

- the Flow name and manual trigger were saved;
- **Active** remains in the intended state;
- every data item refers to the intended Definition and Connection;
- every action step is active only when it is complete, has the required source/destination and refers to the intended module; and
- log and notification settings do not expose sensitive payloads.

Use [Run and test a Flow manually](triggers/manual-runs.md) only after these checks pass.

## Recover or roll back

Keep the Flow inactive and manual while correcting it. If the new Flow is not needed, first use **Check Usage** to confirm that no other module refers to it, then delete it. If you changed an existing Flow, restore its recorded configuration and retest every dependent workload before re-enabling its trigger.

## Troubleshoot

- **A Definition or module is not available:** confirm it exists in the current test configuration and is the type required by the selected step.
- **A step has no compatible source or destination:** add the appropriate DB or File Definition on **Data**, or select a processing module whose input/output types match.
- **The Flow runs unexpectedly:** return its trigger to **When you manually start it**, clear **Active**, and check its configured schedule, monitor and linked-Flow references before re-enabling processing.

## Next steps

Complete [Flow data](data/index.md), [Flow steps](steps/index.md), then perform a controlled [manual run](triggers/manual-runs.md).
