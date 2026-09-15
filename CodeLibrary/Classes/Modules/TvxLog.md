---
title: TvxLog
description: Represents the host-owned execution log, including overall and temporary statuses, messages, file/transport events and diagnostic traces.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, status, diagnostics]
---

```Delphi
type TvxLog = class(TvxModule);
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.StatusType
    else
      Value := -1
  else
    Value := -1;
end;
```

### Usage

`TvxLog` represents the Velox-provided execution log, including overall and temporary statuses, messages, file/transport events and diagnostic traces.

**Acquisition and ownership**

The scripting import exposes no constructor. Obtain the current Velox-provided reference through a script-visible module's `Log` property, commonly `Action.Log`. Do not create, free or retain it beyond the owning execution.

### Additional Technical Info
`TvxLog` is the mutable log for an action/transport execution. It owns message items, file and transport event records and diagnostic SQL/HTTP/transport traces, while tracking both an overall status type and temporary header/row statuses.

**Status model**

[`StatusType`](TvxLog/Properties/StatusType.md) uses the registered enum's ordinal order:

| Ordinal | Value | Display meaning |
|---:|---|---|
| 0 | `flsNotSet` | Not set |
| 1 | `flsOK` | Successful |
| 2 | `flsWarning` | Warning |
| 3 | `flsIssue` | Issue |
| 4 | `flsDuplicate` | Duplicate |
| 5 | `flsCancelled` | Cancelled |
| 6 | `flsError` | Error |
| 7 | `flsTest` | Test |
| 8 | `flsHighlight` | Note/highlight |

Normal StatusType assignment only accepts a greater ordinal. This is not a conventional resettable severity ordering: Test/Highlight outrank Error numerically. Error separately makes the internal Boolean Status false; OK makes it true even when the status type cannot downgrade, so those two values can disagree.

[`HeaderStatusType`](TvxLog/Properties/HeaderStatusType.md) and [`RowStatusType`](TvxLog/Properties/RowStatusType.md) mirror successful overall escalation. Their properties read without reset; [`GetHeaderStatus`](TvxLog/Methods/GetHeaderStatus.md) and [`GetRowStatus`](TvxLog/Methods/GetRowStatus.md) consume/reset the temporary value.

**Lifecycle and destructive operations**

Reset/initialisation sets overall, header and row status to OK, Boolean Status/Handled true, current identifiers blank and start/end time to now. It frees current messages/file/transport objects and clears diagnostic lists. [`Clear`](TvxLog/Methods/Clear.md) invokes the full New/Reset path and fires the log-cleared event; it is not a display-only clear.

Messages added through native Info/Warning/Issue/Duplicate/Cancelled/Error paths update status and may show foreground UI. The five generated methods expose status consumption, destructive clear and SQL trace appends; message-creation methods are not part of this class's generated script surface.

**Safety and concurrency**

- Status and list operations are mostly unsynchronised; only selected native fields use locks. Do not mutate one Log concurrently.
- Logs can retain SQL, URIs, payload fragments, filenames and exception details. Never add credentials, personal data or sensitive content unnecessarily.
- Clearing or forcing status during execution can change later routing, audit, retry, notification and persistence decisions.
- Log saving and UI/event callbacks can perform database/UI work; do not assume every mutation is isolated or cheap.

**Related entries**

- [`Action`](../../Variables/Modules/Action.md) — usual owner/context reference.
- [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md) — registered enum.
- [`LogSQLScript`](TvxLog/Methods/LogSQLScript.md) and [`LogSQLComment`](TvxLog/Methods/LogSQLComment.md) — diagnostic trace only.

<small>Created 2026-07-15</small>
