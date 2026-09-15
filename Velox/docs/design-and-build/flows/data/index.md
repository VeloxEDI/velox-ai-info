---
title: "Configure Flow data and parameters"
description: "Add definitions, parameters and runtime values to a Flow"
sidebar_position: 10
slug: /flows/flow-data
classification: public
status: approved
owner: Cam Hart
keywords:
  - "flow-data"
  - "parameters"
  - "definitions"
---

Add reusable DB and File Definitions to a Flow so its action steps can read, transform and write the intended data.

## Before you begin

- **Audience:** Velox implementers.
- **Prerequisites:** A saved Flow and the required tested DB or File Definitions. Read [Data Definition concepts](../../data-definitions/definition-concepts.md) first.
- **Permissions:** Permission to edit the Flow and access each referenced database or file location through the runtime identity.
- **Starting state:** Keep the Flow manual and inactive while changing its data model. Record which step will read or write each item.

:::caution Shared data configuration
Flow data items refer to reusable Definitions and Connections. Editing one of those shared modules can affect other Flows, Maps or Reports. Use **Check Usage** and test all consumers before changing shared structure.
:::

## Steps

1. Open the Flow in Designer and select **Data**.
2. Select **Add Data...**, then choose **DB Definition** or **File Definition**.
3. Enter a descriptive **Data Item** name that states the item's role, such as source, destination or lookup.
4. Select the required **Definition**. Confirm that its dataviews and fields match the processing module that will use it.
5. For a DB Definition item, review its **DB Connection** list. For a File Definition item, review the selected **File Connection**. Override a Definition's connection only when the deployment design requires it and the replacement is compatible.
6. For a DB Definition item that exposes criteria fields, review the **Parameters** table and supply only values required for this Flow.
7. Repeat for every distinct source, destination or lookup required by the action steps.
8. Arrange and name the data items clearly, then select **Save**.

## Parameter guidance

For database-backed items, the **Parameters** table shows **Description**, **Type**, **Criteria** and **Value**. The available criteria come from the selected Definition's designed fields. A parameter value can be a fixed test value or a supported Velox expression/tag where the deployment contract requires runtime substitution.

- Use sanitised, non-production values while designing.
- Match the field's data type, format and null rules.
- Do not embed credentials or secrets as parameter values.
- Treat a missing or empty value deliberately; do not assume it has the same meaning as zero, an empty string or database null.

## Verify the result

Select each data item and confirm its type, Definition, Connection and parameter values. On **Action Steps**, select every step and confirm that the intended item appears in the compatible **Source Data** or **Destination Data** list.

Perform a controlled [manual test](../triggers/manual-runs.md) using boundary cases that matter to the interface: no records, one record, multiple records, null values and an expected invalid value. Inspect the execution log and the destination rather than relying only on a completed status.

## Recover or roll back

Keep the Flow inactive. Restore the previous Definition, Connection and parameter values, then save and repeat the non-production test. Before deleting a data item, remove or update every action step that refers to it.

## Troubleshoot

- **The required Definition is missing:** confirm that it exists in the current configuration and that you selected the correct DB/File item type.
- **A data item is absent from a step list:** the step filters items by the source or destination type required by its selected Map, Report or action type.
- **The Flow opens no data:** test the underlying Connection and Definition independently, then confirm criteria and runtime identity permissions.
- **A parameter does not filter as expected:** confirm its designed field, data type and processed value; do not compensate by broadening a production query.

## Next steps

Use the detailed [database](database-data-items.md) and [file](file-data-items.md) data-item references. Assign the items to [Flow steps](../steps/index.md), then [run the Flow manually](../triggers/manual-runs.md).
