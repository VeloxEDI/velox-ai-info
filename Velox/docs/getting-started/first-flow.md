---
title: "Create your first Flow"
description: "Build, run and verify a simple example Flow in a test context"
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords: [flow, tutorial, test-run]
---

Create a manually run Flow that writes a harmless message to its execution log. This fictional exercise avoids files, databases, commands and Transports.

## Prerequisites

Use Designer in the test configuration with permission to create a Flow. Confirm no schedule or file monitor will be enabled.

## Build the Flow

1. Under **Flows**, create a Flow named `Tutorial - First Flow`.
2. Keep its trigger manual: do not enable a schedule or file monitor.
3. Add a **Custom Script** Flow step named `Record tutorial message`.
4. Use the Script Editor and Code Library to insert the current logging operation for the installed version, with the sanitised text `First Flow tutorial completed`.
5. Select **Test Compile**, save the step and save the Flow.

Checkpoint: the Flow reopens with one active step and no automated trigger. The exact logging signature must come from the installed Code Library rather than this version-independent tutorial.

## Run and verify

1. Select **Test Run** or the controlled manual run action.
2. Open the execution result and confirm successful status and the tutorial message.
3. Confirm no file, database, Transport or external endpoint changed.

Compile success does not prove runtime behaviour; the execution log is the checkpoint.

## Clean up

Archive or delete the tutorial Flow under local policy after checking it is not used by another module. If the run fails, retain the error, verify the logging signature and script context, and retry only after the cause is understood.

- [Create and configure Flows](../design-and-build/flows/create-flow.md)
- [Review Execution Logs](../operate-and-troubleshoot/execution-logs.md)
