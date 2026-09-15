---
title: fetTemp
description: Names an intended move-to-temporary event but currently crosses the script boundary as native Issue because the script enum is shifted.
sidebar_position: 58
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, event, temporary, logging, defect]
---

```Delphi
fetTemp = 6
```

### Example

```Delphi
function IsIntendedTemporaryEvent(const Event: TvxFileEventType): Boolean;
begin
  Result := Event = fetTemp; // script-local classification only
end;
```

### Usage

`fetTemp` names an intended move-to-temporary event but currently crosses the script boundary as Velox Issue because the script enum is shifted.

- Record the actual resulting path when the Velox operation exposes it; a generic path-only event can retain only the supplied path.
- Define who removes temporary files and how abandoned files are recovered after service interruption.
- Existing Velox ordinal 6 means Issue, so faulty script usage is indistinguishable by ordinal alone.

### Additional Technical Info
`fetTemp` is script ordinal 6 of [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md). The native display text for the intended member is “Moved Temp,” representing a temporary/staging disposition.

**Current scripting defect:** native ordinal 6 is `fetIssue`; native `fetTemp` is ordinal 7 after `fetDownload`. Passing this member to [`LogFileEvent`](../../Functions/Logging/LogFileEvent.md) or a native-backed property records Issue, not Temp. Do not choose `fetTransport` as a workaround even though its current script ordinal is 7.

The value neither creates a temporary filename nor moves/locks/deletes a file. Temporary-location ownership, cleanup, collision handling and retry behavior come from the operation that manages the file. A lifecycle label cannot substitute for those controls.

#### Operational guidance

- Record the actual resulting path when the native operation exposes it; a generic path-only event can retain only the supplied path.
- Define who removes temporary files and how abandoned files are recovered after service interruption.
- Existing native ordinal 6 means Issue, so faulty script usage is indistinguishable by ordinal alone.
- Treat Temp as product lifecycle state, not as the operating system's `%TEMP%` location unless the owning module explicitly uses it.

The example only compares a value and was source-reviewed; no temporary file, move, cleanup, runtime or image-function test was executed.

**Related Code Library entries**

- [`fetIssue`](fetIssue.md) - native event currently produced by this script ordinal.
- [`fetTransport`](fetTransport.md) - next intended lifecycle disposition.

<small>Created 2026-07-15</small>
