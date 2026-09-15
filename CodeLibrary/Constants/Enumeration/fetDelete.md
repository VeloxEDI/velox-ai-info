---
title: fetDelete
description: Names an intended file-deletion event but currently crosses the script boundary as native Transport; native Delete cannot be expressed by the script enum.
sidebar_position: 53
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, event, delete, logging, defect]
---

```Delphi
fetDelete = 8
```

### Example

```Delphi
function IsIntendedDeleteEvent(const Event: TvxFileEventType): Boolean;
begin
  // Do not pass fetDelete to LogFileEvent in the current build.
  Result := Event = fetDelete;
end;
```

### Usage

`fetDelete` names an intended file-deletion event but currently crosses the script boundary as Velox Transport; Velox Delete cannot be expressed by the script enum.

### Additional Technical Info
`fetDelete` is the final script-visible member, at ordinal 8, of [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md). Its intended meaning is that a file deletion has been recorded.

**Current scripting defect:** the native enum includes `fetDownload` at ordinal 3 and places native `fetDelete` at ordinal 9. Directly passing script `fetDelete(8)` to [`LogFileEvent`](../../Functions/Logging/LogFileEvent.md) or a native-backed property produces native `fetTransport`, not Delete. No current script member has ordinal 9, so native Delete cannot be selected through this enum.

Do not use an out-of-range cast or the “next” value to reach ordinal 9. That bypasses the declared type, risks runtime range/serialization failures, and will become incorrect when the importer is fixed. Escalate the missing adapter/product fix if script-authored delete audit evidence is required.

The constant never deletes a file. File deletion authority, existence checks, race handling, error recovery and retention policy belong to the operation that actually removes the file. A log label on its own is not evidence of successful deletion.

#### Audit guidance

- Distinguish “requested,” “attempted” and “confirmed” deletion in surrounding process data.
- Preserve the original path, governing log/action, timestamp and failure details; an enum ordinal alone is insufficient.
- Existing native ordinal 8 rows mean Transport, whereas faulty script use of `fetDelete` also produces 8. The stored ordinal cannot reveal the caller's intent without provenance.
- Never compensate by writing a different named member. Correct the boundary or use a purpose-built native helper.

The example only classifies a script value and was source-reviewed; no file deletion, log persistence, runtime or image-function test was executed.

**External references**

- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - ordinal behavior behind the mismatch.

<small>Created 2026-07-15</small>
