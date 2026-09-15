---
title: "Program control"
description: "Functions for cooperative cancellation, linked-record reprocessing, Windows process launch, worker waiting and nested flow execution."
sidebar_position: 21
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - cancellation
  - process
  - flow
  - sleep
---

The Program control group changes what Velox or the host operating system does next. It includes cooperative map/flow cancellation, linked-record reprocessing, Windows process or Shell launch, thread suspension and synchronous execution of another Velox flow.

## Cancellation families

The five stop/cancel names collapse to two native behaviors:

- [`CancelExecution`](ProgramControl/CancelExecution.md) and [`StopStep`](ProgramControl/StopStep.md) cancel all views/fields in the current map without setting the enclosing flow log to cancelled.
- [`StopAction`](ProgramControl/StopAction.md), [`StopExecution`](ProgramControl/StopExecution.md) and [`StopFlow`](ProgramControl/StopFlow.md) cancel the current map's views and also mark the enclosing action/flow log cancelled.

These calls are cooperative state changes. They do not behave like a language `exit`, throw an exception, undo prior work or prevent the remainder of the current script statement sequence from running. Return/exit explicitly when no later script code should execute.

## External processes and waiting

`ExecCmdLine...` uses a Windows process command line; `ExecShellCmd...` uses Shell associations and can open executables, documents, folders or URLs. Inputs execute with the Velox process identity and environment. Never concatenate untrusted values into a command line, executable, argument, working directory, verb or URL.

The wait variants and [`Sleep`](ProgramControl/Sleep.md) block the current Velox worker thread. Their one-hour wait ceiling is not a general scheduling guarantee, and timeout does not necessarily terminate the launched process. Prefer asynchronous orchestration or bounded polling outside a mapping script where possible.

## Flow and linked-record effects

[`ExecuteFlow`](ProgramControl/ExecuteFlow.md) synchronously checks out, loads and runs another flow. It introduces independent configuration, logging, resource, recursion and failure boundaries; it is not an in-process function call or automatic transaction continuation.

`ProcessMasterRecord` and `ProcessGrandMasterRecord` cancel the current linked view and request reprocessing at a different relationship level. They depend on active linked-data context and affect mapping iteration state rather than returning a record.

## Operational safety

All effects can outlive a later script or map failure. Design idempotent retries, restrict executable/flow identifiers to configuration-owned values, bound wait durations and log only non-sensitive operational context.
