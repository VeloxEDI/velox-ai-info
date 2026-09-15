---
title: flsCancelled
description: Classifies cancelled or no-work execution, which stops selected loops but is excluded from default log persistence and notification sets.
sidebar_position: 67
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, log, status, cancelled, persistence, retry]
---

```Delphi
flsCancelled = 5
```

### Example

```Delphi
function WasCancelled(const Status: TvxLogStatusType): Boolean;
begin
  Result := Status = flsCancelled;
end;
```

### Usage

`flsCancelled` classifies cancelled or no-work execution, which stops selected loops but is excluded from default log persistence and notification sets.

### Additional Technical Info
`flsCancelled` is ordinal 5 of [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md), displayed as `Cancelled`. It represents an execution that was deliberately cancelled, stopped, or produced no actionable work according to the owning operation. It is not necessarily a system failure.

Default action configuration does not save or send Cancelled logs. Reprocess-until-error logic treats Duplicate, Cancelled and Error as stop conditions. File audit routing groups Cancelled with OK, Warning and Error in the audit directory rather than Issue/Duplicate directories.

The normal status setter retains only a numerically greater ordinal. Cancelled can replace NotSet/OK/Warning/Issue/Duplicate, but cannot replace Error/Test/Highlight. It does not set the separate Boolean `Log.Status` false. That Boolean may therefore remain true for a cancelled outcome.

`IsCancelled := False` is exceptional: native code directly forces the internal enum to NotSet, then sends OK through the setter so cancellation can be reset. Ordinary `StatusType := flsOK` cannot lower Cancelled.

Use cancellation for control-flow intent, and preserve the reason in a log item. Do not infer rollback: files, database updates, messages or external requests completed before cancellation remain governed by their own transaction/idempotency contracts.

The example only compares a value and was source-reviewed; no cancellation, action, log, file, runtime or image-function test was executed.

<small>Created 2026-07-15</small>
