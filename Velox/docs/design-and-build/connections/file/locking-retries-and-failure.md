---
title: "File locking, retries and failure handling"
description: "Configure File Connection wait behaviour and recover safely from locked, missing or misrouted files."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [file lock, WaitFor, retry, File Connection]
---

`WaitFor` defaults to 30 seconds and controls how long file operations wait for a lock to clear. It is not a complete Flow retry policy and does not make a partially written file valid.

## Failure boundaries

| Symptom | Safe interpretation and action |
| --- | --- |
| File remains locked | Identify the writer and confirm completion/atomic hand-off. Do not only increase `WaitFor` to hide a producer problem. |
| No files match | Verify processed absolute folder, pattern, service identity and trigger timing. |
| Duplicate/collision | Keep unique/safe naming enabled, inspect tag output and reconcile existing files before rerun. |
| File moved to Error | Inspect the Flow/file log and any database/output side effects before returning it to input. |
| Transport folder contains files without delivery | Inspect Transport Logs; file staging and outbound delivery are separate. |

## Safe recovery

1. Preserve the original file and relevant Flow/Transport identifiers.
2. Correct the producer, permissions, pattern or configuration in test.
3. Determine whether the Flow committed database/output side effects or created a Transport queue record.
4. Reprocess through the approved Flow or Transport retry path, not both automatically.
5. Verify final file location, Flow Log, output and Transport Log.
