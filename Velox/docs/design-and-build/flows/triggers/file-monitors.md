---
title: "Monitor files with a Flow"
description: "Configure monitored file processing and concurrency"
sidebar_position: 30
slug: /flows/file-monitoring
classification: public
status: approved
owner: Cam Hart
keywords:
  - "file-monitor"
  - "file-connection"
  - "threads"
---

Configure VeloxService to start a Flow when a file matching a Flow file data item's folder and pattern is available. Use the simultaneous-thread limit to control concurrency, not to enforce processing order.

## Before you begin

- **Audience:** Velox implementers and administrators responsible for inbound file processing.
- **Prerequisites:** A manually tested Flow containing a file data item backed by a tested File Connection. Confirm its folder, file pattern, processing folder, completed-file behaviour and error-file behaviour.
- **Permissions:** Access to edit the Flow and verify VeloxService. The service account needs read, write, create, move and delete permissions required by the complete configured file lifecycle.
- **Starting state:** Keep the Flow inactive. Use an isolated test folder containing no production files and prepare one sanitised file that matches the configured pattern.

:::danger Existing and new files can be processed
When monitoring starts, Velox can queue files that already match in the monitored folder as well as files that arrive later. Empty or quarantine the test folder before activation. Do not activate a monitor against an unreviewed production backlog.
:::

## Steps

1. Open the Flow in Velox Designer and clear **Active**.
2. On **Data**, confirm that the Flow has the correct file data item and that its File Connection uses a sufficiently narrow folder and file pattern.
3. Select **Execution**, then set **Trigger** to **Monitor for incoming files**.
4. For **File Connection to Monitor**, select the Flow file data item whose underlying File Connection defines the monitored folder and pattern.
5. Under **Transports to Monitor**, add only the inbound Transports that are explicitly part of the Flow's approved input design. Test their collection behaviour separately before combining it with folder monitoring.
6. Set **Use max _n_ simultaneous threads to process files** to a value from `1` to `99`. A new Flow uses `1`; increase it only after proving that files, database work and external destinations can be processed concurrently without collision or duplication.
7. Review [completion, retry and cancellation settings](../flow-properties-and-execution-policy.md). Confirm how failed and completed files are moved and whether repeating an attempt can duplicate an external effect.
8. Save the inactive Flow, reopen it and verify the monitor selection and thread limit.
9. Confirm the monitored folder is empty or contains only explicitly approved test inputs. Select **Active** and save the Flow.
10. Place one sanitised matching file in the monitored folder and observe the resulting execution.

:::caution File order is not guaranteed
Do not design a monitored Flow that depends on files being processed in arrival or filename order. A concurrency limit of `1` restricts simultaneous work but is not an ordering guarantee.
:::

## Verify the result

Confirm that:

- exactly one execution starts for the test file;
- the Flow reads the expected file and its log records the intended configuration;
- the input follows the configured processed, completed or error-file lifecycle;
- the destination contains the expected result once; and
- simultaneous executions never exceed the configured limit during a controlled multi-file test.

Verify the result using the VeloxService account and target runtime folders, not only an interactive Designer session.

## Recover or roll back

Clear **Active** and save the Flow before adding, restoring or moving files during investigation. Preserve the original input and execution log. Check whether an execution or external effect has already occurred before placing a file back in the monitored folder; restoring it without that check can process it again.

## Troubleshoot

- **A matching file is not detected:** confirm **Active**, **Monitor for incoming files**, the selected Flow file data item, the exact folder and pattern, VeloxService state, and service-account folder permissions.
- **The wrong files are collected:** narrow the File Connection folder and pattern, then retest in an isolated directory.
- **A file is processed more than once:** disable the Flow and check for manual runs, another monitor, multiple copies of the file, retry behaviour and a failed completed/error-file move.
- **Files complete in an unexpected order:** ordering is not guaranteed. Redesign the input so each file is independent or add a verified sequencing mechanism outside the monitor.
- **Parallel files conflict:** return the simultaneous-thread limit to `1`, recover affected destinations, then find shared filenames, mutable parameters, database locks or non-idempotent external operations before increasing it.

## Next steps

See [Configure a File Connection](../../connections/file/index.md) for folder and lifecycle settings. Use [file and Transport troubleshooting](../../../operate-and-troubleshoot/file-and-transport-troubleshooting.md) to collect evidence for operational failures.
