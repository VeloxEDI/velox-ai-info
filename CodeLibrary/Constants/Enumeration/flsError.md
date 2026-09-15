---
title: flsError
description: Classifies a system/error outcome and forces Boolean Log.Status false even when a higher Test or Highlight enum prevents StatusType replacement.
sidebar_position: 69
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, log, status, error, failure, consistency]
---

```Delphi
flsError = 6
```

### Example

```Delphi
function IsSystemError(const Status: TvxLogStatusType): Boolean;
begin
  Result := Status = flsError;
end;
```

### Usage

`flsError` classifies a system/error outcome and forces Boolean Log.Status false even when a higher Test or Highlight enum prevents StatusType replacement.

### Additional Technical Info
`flsError` is ordinal 6 of [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md), displayed as `Error` and mapped to the Admin email class. It is the system/technical error outcome and is included in default save and notification sets.

Setting Error through `TvxLog.SetStatusType` always sets the separate Boolean `Status` to false. The enum field changes only if 6 is greater than the current ordinal. Consequently, an existing Test(7) or Highlight(8) remains the visible StatusType while Boolean Status becomes false. Code must not assume those two fields are always equivalent.

Error stops selected reprocessing loops. File routing currently groups it with OK/Warning/Cancelled in the audit directory rather than selecting the Issue or Duplicate directory. REST paths do not all translate statuses identically; some treat only Error as a client-error response, while another includes Issue.

The value contains no exception, message, stack, failed module, retry classification or rollback guarantee. Always record diagnostic context and preserve external side-effect/transaction boundaries. Higher ordinal does not mean higher semantic severity: Test and Highlight numerically outrank Error due declaration order.

The example only compares a value and was source-reviewed; no error, API, notification, file, runtime or image-function test was executed.

<small>Created 2026-07-15</small>
