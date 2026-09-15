---
title: "Configure Flow steps"
description: "Add and order supported Map, Report, script, Transport, route, command, SQL and sub-Flow steps"
sidebar_position: 10
slug: /flows/flow-steps
classification: public
status: approved
owner: Cam Hart
keywords:
  - "flow-step"
  - "map"
  - "report"
  - "script"
---

Flow steps are the ordered units of work performed after a Flow opens its configured data. This reference covers the step types available from the current **Add Action...** menu.

## Scope

Use this page to select a step type and identify its required configuration. Detailed Map, Report, Transport, routing, command-line, SQL, scripting and linked-Flow behaviour belongs to the related specialist pages.

## Supported step types

| **Add Action...** option | Purpose | Required configuration and constraints |
| --- | --- | --- |
| **Map** | Transform source data into destination data | Select a Map, then compatible **Source Data** and **Destination Data** items. The selected Map determines the required DB/File types. |
| **Report** | Generate report output from source data | Select a Report and compatible **Source Data**, then configure the output destination, type and details. Test file, printer and email effects separately. |
| **Custom Script** | Run a Flow-scoped Velox script | Select the applicable source type/item and edit the script. Compile and test it with controlled data; use the Code Library as the scripting-reference authority. |
| **Outbound Transport** | Send a file using a configured outbound Transport | Select an outbound Transport and File Definition source. Sending can create an external side effect even during manual execution. |
| **File Router** | Copy a processed source file to a route's File Connection | Select a File Definition source and configure routing events. Test mode suppresses the router's copy operation, but this does not make every other step side-effect-free. |
| **Command Line** | Start a local command or process | Configure the command, execution method, credentials only if required, wait behaviour and delay. Restrict executable paths and arguments; see the [Command Line step](command-line-step.md). |
| **Custom SQL** | Execute SQL against database-backed Flow data | Select DB **Source Data** and enter the reviewed SQL command. Empty SQL or a missing DB Definition cancels the step. Test write SQL only with an approved rollback method. |
| **Sub Action** | Execute another configured Flow | Select the target Flow. The called Flow inherits the parent test flag and local values, and contributes to the parent status and log context. Prohibit direct and indirect cycles; see the [Sub Action step](sub-action-step.md). |

Options visible in inactive, backup or legacy source are not supported merely because an internal action type exists. This page does not document Call Plugin, Transaction Commit, DB Disconnect, Wait for File or Inbound Transport as current **Add Action...** options.

## Common step settings

| Setting | Accepted value | Effect and constraints |
| --- | --- | --- |
| **Action Step** | Unique descriptive text | Identifies the step in the ordered list and execution log. |
| **Active** | Enabled or disabled | Disabled steps remain configured but are skipped. Do not use this as the only record of why a step is disabled. |
| **Source Data** | Compatible Flow data item | Supplies the input required by the selected module or step type. |
| **Destination Data** | Compatible Flow data item where applicable | Receives output from a Map or other destination-capable step. |
| **Ignore empty source data and continue processing** | Enabled or disabled where shown | Allows applicable steps to continue when the source is empty. Enable only when empty input is a valid business outcome. |
| **Delay (secs)** | Non-negative delay used by applicable steps | Delays execution of the step. Avoid using delay as a substitute for a reliable external-system readiness check. |

## Configure and order steps

1. Add the required [Flow data](../data/index.md) first.
2. On **Action Steps**, select **Add Action...** and choose the required type.
3. Enter a descriptive step name and select its module, source and destination.
4. Complete the type-specific settings and clear **Active** until the step is ready for a controlled test. New action steps are active by default.
5. Drag steps into the required execution order. A Flow executes active steps in list order.
6. Save, reopen and verify the order and references.
7. Test one new side effect at a time, then inspect the execution log and affected destination.

## Example

An illustrative transformation Flow could use this sequence:

1. **Map validated orders** — Map from a file-backed source item to a database-backed destination item.
2. **Create processing report** — Report from the destination item to a controlled test file.
3. **Send accepted file** — Outbound Transport from a generated File Definition after the transport is separately tested.

The example describes ordering only. Actual modules, fields, destinations and transport behaviour must come from the approved integration design.

## Constraints and failure behaviour

- A missing module, source or destination can cancel the affected step or stop the Flow depending on the step and execution policy.
- Later steps should not assume output exists when an earlier step permits empty data or finishes with a non-success status.
- **Test Run** is not a general rollback mechanism. Database SQL, Maps, Reports, scripts, commands and external calls may still cause effects unless their specific implementation prevents them.
- Reordering a shared production Flow changes its business sequence. Preserve the prior order and have an explicit recovery plan.
- A failed Sub Action contributes failure to the parent Flow. Velox has no confirmed cycle guard, so reject direct and indirect Sub Action cycles during design review.

:::warning Host and external-system access
Command Line, SQL, script and Transport steps can execute with service-account permissions and affect systems outside Velox. Apply least privilege, sanitise logs and test against controlled endpoints.
:::

## Related references

- [Flow concepts](../flow-concepts.md)
- [Configure Flow data items](../data/index.md)
- [Step concepts and common properties](step-concepts-and-common-properties.md)
- [Route files and run commands](../file-routing-and-commands.md)
- [Configure Maps](../../transformations-output/maps/index.md)
- [Configure Reports](../../transformations-output/reports/index.md)
- [Operate Transports](../../transports/operate-transports.md)
- [Velox Scripting concepts](../../scripting-code-library/scripting-concepts.md)
