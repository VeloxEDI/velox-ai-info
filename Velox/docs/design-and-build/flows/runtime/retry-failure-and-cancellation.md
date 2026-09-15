---
title: "Retry, failure and cancellation"
description: "Configure and recover from whole-Flow retries, reprocess loops, step cancellation, deadlocks and independent Transport retry."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [Flow retry, cancellation, deadlock, reprocess, duplicate]
---

Retry is replay. Before enabling it, identify every effect that can survive a failed attempt and define how duplicate work is detected or reconciled.

## Mechanisms

| Mechanism | Default | Boundary |
| --- | --- | --- |
| **Auto retry** | Cleared; count `3`, wait `5` seconds | Finalises a failed attempt, resets status and executes the whole Flow again up to the limit. |
| **Re-run until error/cancelled** | Cleared | Repeats relevant manual/scheduled execution until Duplicate, Cancelled or Error/loop termination. It is not the ordinary monitored/REST/test path. |
| **Continue after previous cancellation** | Cleared | Can clear a cancelled step result so later active work runs when implementation conditions allow. Missing earlier output remains missing. |
| Transport retry | Transport-specific | Retries outbound delivery independently of Flow auto-retry. |

The Designer warns about combining continuous re-run and cancellation continuation. Treat that combination as unsafe until termination has been formally proved.

## Failure finalisation

Failure requests rollback of database Definition and system transactions, closes/resets data and moves eligible source files to Error. A cancelled deadlock can leave a monitored file in place. None of these actions reverse an already written external file, completed report/email, command process, remote API call or independently delivered Transport message.

## Recovery decision

1. Stop new automated triggers without destroying evidence.
2. Identify the exact attempt, final status and failed step.
3. Check database commit/rollback, file location, command/remote effects and Transport queue/receiver state.
4. Correct the cause and decide whether to resume, manually compensate or replay.
5. Use a unique correlation/business key and verify the outcome after the controlled run.

Never assume an Error means “nothing happened” or that a timeout means the remote system did not process the request. See [status/logging](status-and-logging.md) and [Flow troubleshooting](../../../operate-and-troubleshoot/flow-troubleshooting.md).
