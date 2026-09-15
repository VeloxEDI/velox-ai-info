---
title: fetNone
description: Represents no current file lifecycle event and is one of the three members whose script/native ordinals remain aligned.
sidebar_position: 56
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, event, none, default, logging]
---

```Delphi
fetNone = 0
```

### Example

```Delphi
function HasFileEvent(const Event: TvxFileEventType): Boolean;
begin
  Result := Event <> fetNone;
end;
```

### Usage

`fetNone` represents no current file lifecycle event and is one of the three members whose script/Velox ordinals remain aligned.

### Additional Technical Info
`fetNone` is ordinal 0 of [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md). It means that no specific file lifecycle action is currently recorded. New `TvxFileCon` instances initialize their native `FileEvent` field to this member.

Script and native ordinals are both 0, so this member is unaffected by the missing native `fetDownload` in the importer. It is safe to pass through the direct enum boundary. That does not make all later members safe.

`fetNone` is a sentinel, not proof that no file operation ever occurred. It may mean the connection has not started, state has been reset, a path-only log was deliberately labelled None, or the relevant operation did not update the property. Interpret it with module phase, log records and status.

#### Behavior and boundaries

- Reading/comparing the constant is side-effect free.
- Assigning it clears only the enum field selected by the receiver; it does not delete logs, clear filenames/data/hashes or undo filesystem work.
- Passing it to `LogFileEvent` can create a path-only log item labelled None. That is usually less informative than omitting the synthetic event.
- Do not use ordinal 0 as a database/API contract; retain the symbolic name and product version.
- Native values after ordinal 2 are unsafe to read through the current script enum even though this sentinel itself aligns.

The example only tests a value and was source-reviewed; no file, log, runtime or image-function test was executed.

**Related Code Library entries**

- [`fetRead`](fetRead.md) and [`fetWrite`](fetWrite.md) - aligned active events.
- [`TvxFileCon.FileEvent`](../../Classes/Modules/TvxFileCon/Properties/FileEvent.md) - native-backed state property.

<small>Created 2026-07-15</small>
