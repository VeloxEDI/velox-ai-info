---
title: "LogCancel"
description: "Adds a cancelled item to the current flow log and marks the flow cancelled unless a more severe status already exists."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - cancelled
  - flow-status
---

```Delphi
procedure LogCancel(const aMesg: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Value = '' then
  begin
    LogCancel('No source value was available; the flow is being cancelled.');
    Exit; // LogCancel does not itself exit the current script procedure.
  end;
end;
```

### Usage

`LogCancel` adds a cancelled item to the current flow log and marks the flow cancelled unless a more severe status already exists.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMesg` | `string`, `const` | Human-readable cancellation reason stored as a level-5 log item. Empty text is accepted. |

### Additional Technical Info
`LogCancel` adds a Cancelled item to the current flow log and normally changes the overall log status to `flsCancelled`. The action engine stops dispatching further action steps after the current script returns because its execution loop checks the cancelled state.

The call does not raise an exception, exit the current script procedure or undo work already performed. Use an explicit `Exit` when statements later in the same procedure must not run. The example is fictional and source-reviewed; it was not executed.

**Implementation trace**

1. `TvxScripter.LogCancel` calls `Log.Cancelled(aMesg)`.
2. `TvxLog.Cancelled` calls `MessageLog` with native level `5` (`flsCancelled`).
3. `MessageLog` asks the log to adopt Cancelled status, creates a `TvxLogItem`, stores the description and level, and updates the log end time.

The resulting item caption is `Cancelled`. It is not flagged as a `User` item internally, unlike Issue, Duplicate and the user-specific Info/Warning/Error levels.

**Overall-status behavior**

Flow status is monotonic by the native enumeration's numeric order. Cancelled (`5`) replaces Successful, Warning, Issue or Duplicate, but cannot replace an existing Error (`6`). If Error already exists, the cancellation item is still added, but `Log.IsCancelled` remains false because the overall state stays Error; processing is already destined to stop through `Log.Status=False`.

Cancelled status leaves the log's Boolean `Status` true. Stopping occurs through the separate `IsCancelled` check, not through a false Boolean result. This distinction affects code that reads only `Log.Status`.

**Persistence and flow effects**

The default flow configuration saves Successful, Warning, Issue, Duplicate and Error logs, but excludes Cancelled. If cancellation remains the final status, the item and other current log content may be visible during execution yet not be persisted to VxData. Administrators can change the configured save-status set.

Cancellation also prevents deferred [`InvoiceIssue`](InvoiceIssue.md) data from being saved because issue finalization requires `not Log.IsCancelled`. It does not roll back arbitrary external effects already committed by script code; transaction/file behavior remains the responsibility of the affected API and later flow finalization.

**Text, errors and limits**

Velox performs no trim, formatting, redaction or length check here. When the normalized `VX_LOG_ITEM` row is written, the description is copied to a database-limited prefix (448 characters with the SQL-2014-support branch, otherwise 840); the serialized log representation may retain more. Avoid secrets and excessive payloads.

Allocation or log-object failures can propagate, but there is no expected database access during this immediate call. Database persistence happens later if the final status is configured to save.

**Related entries**

- [`LogError`](LogError.md) records a user error and makes the Boolean flow status false.
- [`LogWarning`](LogWarning.md), [`LogIssue`](LogIssue.md) and [`LogDuplicate`](LogDuplicate.md) raise nonfatal overall statuses.
- [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md) lists the native status order.

<small>Created 2026-07-15</small>
