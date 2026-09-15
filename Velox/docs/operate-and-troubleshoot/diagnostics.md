---
title: "Use Velox diagnostics"
description: "Inspect processes, connections, caches, files and memory safely"
sidebar_position: 50
slug: /operations/diagnostics
classification: public
status: approved
owner: Cam Hart
keywords:
  - "diagnostics"
  - "processes"
  - "connections"
---

Designer and runtime diagnostics expose process, connection, cache, file and memory evidence for support investigation. Use the narrowest view that answers the question and capture state before a refresh, restart or cache clear changes it.

## Diagnostic surfaces

| Surface | Use it for | Caution |
| --- | --- | --- |
| Flow/System Logs | Ordered application status, exceptions and audit messages | Saved Flow logs depend on status settings; system/event logs may hold startup failures. |
| Windows Application Event Log | Background/service start, stop and unhandled error evidence | Match the exact Velox process/service instance and time window. |
| View Processes | Waiting/running Flow tasks via service IPC; controlled termination request | Termination can leave external work ambiguous; preserve identifiers first. |
| Connection/pool views | Active or pooled database connections and exhaustion symptoms | A Designer test is not proof of runtime-account access. |
| File search/folders | Pending, output and diagnostic files | Avoid opening/locking files being processed; do not copy sensitive content casually. |
| Memory/log folder | Crash, FastMM, bug-report or memory evidence | Files can contain stack/path/data detail and can be large. |
| Cache/module refresh | Stale Scriptlet, Variable Group or runtime module suspicion | Clearing/restarting changes state and can affect concurrent work. |

## Procedure

1. Record release/build, connection key/context, host, process/service name/account and local/UTC time.
2. Capture the symptom and relevant log/process/queue state without enabling broad debug detail first.
3. Correlate by module/log/Transport/file/API identifier.
4. If deeper capture is necessary, approve its scope/retention, run one controlled reproduction and disable it afterward.
5. Apply one reversible correction and compare the same diagnostic surfaces before and after.

## Escalation evidence

Use [incident evidence](incident-evidence-checklist.md). Export only approved, sanitised evidence and avoid intrusive diagnostics during peak processing.

## Recovery boundary

If a diagnostic action could terminate work, clear a cache, expose communications or materially affect performance, use change/incident approval first.
