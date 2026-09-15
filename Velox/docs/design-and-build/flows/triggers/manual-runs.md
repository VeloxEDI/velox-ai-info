---
title: "Run and test a Flow manually"
description: "Execute a Flow in Designer and verify its result"
sidebar_position: 10
slug: /flows/manual-runs
classification: public
status: approved
owner: Cam Hart
keywords:
  - "run-flow"
  - "test-run"
  - "logs"
---

Start a Flow from Velox Designer and inspect its execution log. Use **Test Run** for controlled design-time testing and **Run Flow** only when real configured effects are intended.

## Before you begin

- **Audience:** Velox implementers and authorised operators.
- **Prerequisites:** A saved Flow with verified data items, ordered action steps and tested Connections/Definitions.
- **Permissions:** Access to run the Flow and inspect its logs, plus the database, filesystem, executable and external-system permissions required by its steps.
- **Starting state:** Select the test configuration, use sanitised inputs and confirm that each destination is non-production or has an approved rollback method.

:::danger A Test Run can still change systems
**Test Run** marks the execution as a test and some step implementations suppress specific effects, such as File Router copies. It is not a universal dry run. Maps, SQL, scripts, Reports, commands and Transports may still write data, create files, start processes or contact external systems.
:::

## Steps

1. In Designer, confirm that the current configuration and visible environment label are the intended test environment.
2. Open the Flow and review **Data**, **Action Steps** and **Execution**. Save any intended changes.
3. Check that scheduled or monitored processing cannot compete for the same input. For an active monitored Flow, disable the relevant processing safely or use a separate test folder and file.
4. In the module tree, right-click the Flow and select **Test Run**.
5. Observe the log window that opens for the execution. Do not close or assume success while the Flow is still running.
6. Review the overall status and each step's messages, SQL, files, Transports and HTTP details that are available and safe to view.
7. Verify the expected destination independently: query the controlled database, inspect the test file, or confirm the test endpoint received exactly the intended result.
8. Correct one defect at a time, restore the test starting state and rerun.
9. Use **Run Flow** only after approval to perform the Flow's normal configured effects manually.

## Verify the result

A valid test has more evidence than a successful overall status. Confirm:

- the intended Flow and configuration were loaded;
- every expected active step ran in the configured order;
- record counts and business outcomes match the test case;
- warnings, business issues, duplicates, cancellations and system errors were investigated;
- destinations contain the expected result once, with no unintended duplicate or partial output; and
- the log contains enough safe information for diagnosis without exposing secrets or unnecessary payload data.

## Recover or roll back

Stop repeating the test when an unexpected side effect appears. Keep the Flow manual/inactive, preserve the log, and use the recovery method approved for each affected destination. Restore input files only after confirming that no service or monitor will collect them. Reverse database changes through the database owner's approved transaction, restore or compensating process; do not improvise deletion from production data.

## Troubleshoot

- **The run does not start:** confirm the Flow exists in the current configuration, was saved and all referenced modules can be loaded.
- **Designer warns that VeloxService is monitoring the Flow:** cancel the run unless you have isolated the input or safely disabled the competing monitor. Continuing can cause duplicate processing.
- **A step is skipped:** confirm **Active**, source data availability and whether the prior result or empty-source setting allowed execution to continue.
- **The result is marked as a test but data changed:** test status does not suppress every step's effects. Recover the affected system and revise the test design before rerunning.

## Next steps

After repeatable manual verification, review [execution policy](../flow-properties-and-execution-policy.md) and configure either a [schedule](schedules.md) or [file monitor](file-monitors.md). Keep the Flow inactive until its operational owner accepts the trigger and recovery procedure.
