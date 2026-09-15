---
title: fetIssue
description: Names an intended file issue event but currently crosses the script boundary as native Error because the script enum is shifted.
sidebar_position: 55
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, event, issue, logging, defect]
---

```Delphi
fetIssue = 5
```

### Example

```Delphi
function IsIntendedFileIssue(const Event: TvxFileEventType): Boolean;
begin
  // Classification only. Do not pass this member to native-backed APIs.
  Result := Event = fetIssue;
end;
```

### Usage

`fetIssue` names an intended file issue event but currently crosses the script boundary as Velox Error because the script enum is shifted.

### Additional Technical Info
`fetIssue` is script ordinal 5 of [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md). Its intended label is a file-associated issue, distinct from a system/processing error.

**Current scripting defect:** native ordinal 5 is `fetError`; native `fetIssue` is ordinal 6 after the omitted `fetDownload`. Passing script `fetIssue` across [`LogFileEvent`](../../Functions/Logging/LogFileEvent.md), `TvxFileCon.FileEvent` or another direct native boundary therefore stores Error. Do not use `fetTemp` to force native Issue; that embeds the current faulty ordinal layout.

The product enum supplies a lifecycle label only. It does not create a Velox business issue record, change log status, explain the issue, quarantine a file or roll back work. Record the structured issue and diagnostic text through the appropriate Flow/module API, then let product-native lifecycle code maintain file state where available.

#### Interpretation guidance

- Treat Issue as a domain/processing classification and Error as a failed technical operation unless the owning workflow defines a more specific contract.
- A persisted native ordinal 5 is Error. Faulty script use can make the human intent ambiguous, so preserve version, script name and source call.
- Path-only logging does not hash/read the file and cannot prove which content caused an issue.
- The missing adapter affects both writes and reads of later native values; do not round-trip this member through a native property.

The example only compares an enum and was source-reviewed; no issue creation, file operation, runtime or image-function test was executed.

**Related Code Library entries**

- [`fetError`](fetError.md) - native event actually produced by this script ordinal.
- [`LogFileEvent`](../../Functions/Logging/LogFileEvent.md) - exact full mismatch table.

<small>Created 2026-07-15</small>
