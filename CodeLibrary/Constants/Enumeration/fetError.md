---
title: fetError
description: Names an intended file-error event but currently crosses the script boundary as native Audit because the script enum is shifted.
sidebar_position: 54
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, event, error, logging, defect]
---

```Delphi
fetError = 4
```

### Example

```Delphi
function IsIntendedFileError(const Event: TvxFileEventType): Boolean;
begin
  // Script-local comparison only; native APIs receive Audit for this ordinal.
  Result := Event = fetError;
end;
```

### Usage

`fetError` names an intended file-error event but currently crosses the script boundary as Velox Audit because the script enum is shifted.

- Use normal logging/exception handling for the diagnostic cause; use file-event state only as lifecycle evidence.
- Do not infer that a file is in an error folder merely from this value, especially for path-only events.
- Existing Velox Audit rows and faulty script `fetError` calls share ordinal 4; retain caller/version provenance.

### Additional Technical Info
`fetError` is script ordinal 4 of [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md). Its intended meaning is that file handling has entered an error disposition. Native file-connection code applies native `fetError` after a successful move to the error destination and can update the log with that destination path.

**Current scripting defect:** native ordinal 4 is `fetAudit`, because native `fetDownload(3)` is missing from the script declaration. Passing this constant to [`LogFileEvent`](../../Functions/Logging/LogFileEvent.md) or a native-backed property therefore records Audit, not Error. Native Error is ordinal 5 and is not safely reachable by choosing another script name.

An event constant is not an exception and does not set the Flow's error status. It does not move the file or capture the exception that caused a failure. Product code logs operation errors separately, then updates native file-event state if/when the error-file move succeeds.

#### Operational guidance

- Use normal logging/exception handling for the diagnostic cause; use file-event state only as lifecycle evidence.
- Do not infer that a file is in an error folder merely from this value, especially for path-only events.
- Existing native Audit rows and faulty script `fetError` calls share ordinal 4; retain caller/version provenance.
- Avoid the tempting `fetIssue` workaround (script ordinal 5 maps to native Error). It hard-codes the defect.

The example was source-reviewed and performs no error handling, file move, runtime or image-function test.

**Related Code Library entries**

- [`fetIssue`](fetIssue.md) - intended business/processing issue, distinct from error.
- [`fetAudit`](fetAudit.md) - native event incorrectly produced by this script value.

<small>Created 2026-07-15</small>
