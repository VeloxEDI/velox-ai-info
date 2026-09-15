---
title: fetWrite
description: Records the aligned file-write lifecycle event used by Velox output engines, with a material Test-log deletion boundary.
sidebar_position: 60
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, event, write, logging, test, deletion]
---

```Delphi
fetWrite = 2
```

### Example

```Delphi
procedure RecordCreatedOutput(const FilePath: String);
begin
  // Use only for a file this Test/Flow actually created and owns.
  LogFileWrite(FilePath);
end;
```

### Usage

`fetWrite` records the aligned file-write lifecycle event used by Velox output engines, with a material Test-log deletion boundary.

- Record Write only after the owning process has established output ownership.
- Prefer the dedicated helper over the generic enum selector for script-created path-only evidence.
- Preserve atomic-write/rename, overwrite and retention semantics separately; the enum contains none of them.

### Additional Technical Info
`fetWrite` is ordinal 2 of [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md). Script and native ordinals align, so it crosses the current importer boundary correctly.

Velox output engines set the File Connection event to native Write and create/update log-file records while producing flat, XML, JSON, Excel and report outputs. [`LogFileWrite`](../../Functions/Logging/LogFileWrite.md) instead creates a path-only record; it does not create, open, hash or verify the file.

#### Test-log deletion hazard

When a persisted Test log is deleted, Velox queries file links whose stored event equals native `Ord(fetWrite)` and deletes each existing path. A synthetic `LogFileWrite` or `LogFileEvent(path, fetWrite)` therefore asserts that the Test owns an output eligible for cleanup. Never point it at a pre-existing, shared or inbound file. The deletion routine's later existence check does not establish ownership.

The event itself performs no write and does not prove that bytes were flushed or that a destination accepted them. File engines may create the log record early to capture blank/failing outputs; use Flow/module status and diagnostics for completion.

#### Operational guidance

- Record Write only after the owning process has established output ownership.
- Prefer the dedicated helper over the generic enum selector for script-created path-only evidence.
- Preserve atomic-write/rename, overwrite and retention semantics separately; the enum contains none of them.
- Final persistence depends on the enclosing log save/status rules.
- This aligned member does not make `fetAudit` and later members safe.

The example was source-reviewed; no output, cleanup, Test-log deletion, runtime or image-function test was executed.

**Related Code Library entries**

- [`LogFileWrite`](../../Functions/Logging/LogFileWrite.md) - path parsing, persistence and cleanup details.
- [`fetRead`](fetRead.md) - aligned input event.

<small>Created 2026-07-15</small>
