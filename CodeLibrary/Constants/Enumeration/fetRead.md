---
title: fetRead
description: Records the aligned file-read lifecycle event used by Velox file engines and the safe dedicated LogFileRead helper.
sidebar_position: 57
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, event, read, logging, audit]
---

```Delphi
fetRead = 1
```

### Example

```Delphi
procedure RecordRead(const FilePath: String);
begin
  LogFileRead(FilePath);
end;
```

### Usage

`fetRead` records the aligned file-read lifecycle event used by Velox file engines and the safe dedicated LogFileRead helper.

- Prefer `LogFileRead` over the generic selector when creating a synthetic path-only Read event; the dedicated helper selects Velox Read inside product code and states intent clearly.
- Do not use it before an attempted read merely to predict success. Record lifecycle state at the point defined by the owning operation.
- File paths are lexically split for path-only logs and are not canonicalized or checked for existence.

### Additional Technical Info
`fetRead` is ordinal 1 of [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md). Its script and native ordinals align, so it can safely cross the current importer boundary.

Velox file engines set `FileCon.FileEvent` to native Read while opening/loading flat, XML, JSON and Excel definitions. They create a log file record early enough to include blank files and some validation failures, then record file/hash/data context according to logging configuration. [`LogFileRead`](../../Functions/Logging/LogFileRead.md) is different: it creates a path-only log item and does not open, hash or verify the supplied file.

The constant describes an event; it never performs the read. A successful assignment does not imply that parsing, validation or mapping succeeded. Consult Flow status, module logs and resulting data separately.

#### Operational guidance

- Prefer `LogFileRead` over the generic selector when creating a synthetic path-only Read event; the dedicated helper selects native Read inside product code and states intent clearly.
- Do not use it before an attempted read merely to predict success. Record lifecycle state at the point defined by the owning operation.
- File paths are lexically split for path-only logs and are not canonicalized or checked for existence.
- Final database persistence depends on the enclosing log's save/status rules.
- Read is aligned, but `fetAudit` and later script constants are not. Never infer whole-enum safety from this member.

The example was source-reviewed and no file was opened, parsed, logged or tested; no image-function test was executed.

**Related Code Library entries**

- [`LogFileRead`](../../Functions/Logging/LogFileRead.md) - dedicated path-only helper.
- [`fetWrite`](fetWrite.md) - aligned output event.

<small>Created 2026-07-15</small>
