---
title: RowStatusType
description: Gets or directly replaces the temporary row-status mirror without consuming it or changing the overall log status.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, row-status, status]
---

```Delphi
property RowStatusType: TvxLogStatusType read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.RowStatusType
    else
      Value := flsNotSet
  else
    Value := flsNotSet;
end;
```

### Usage

`RowStatusType` gets or directly replaces the temporary row-status mirror without consuming it or changing the overall log status.

**Lifecycle and quirks**

- Reset/Clear initialises it to OK.
- It can be raised or lowered independently by direct assignment.
- Equal/lower overall assignments do not reapply the mirror after a row read/reset.
- It is unsynchronised mutable state; use one deterministic consumer per row.

### Additional Technical Info
`RowStatusType` is the temporary `TvxLogStatusType` used for a row/line status.

Reading the property does not reset it. [`GetRowStatus`](../Methods/GetRowStatus.md) returns its ordinal and then resets only this mirror to `flsOK`.

Successful greater-ordinal [`StatusType`](StatusType.md) escalation mirrors the new overall value into both row and header fields. Direct RowStatusType assignment replaces only the row field and has no effect on overall/header/Boolean status or message content.

**Related entries**

- [`GetRowStatus`](../Methods/GetRowStatus.md) — destructive ordinal read.
- [`HeaderStatusType`](HeaderStatusType.md) — independent header mirror.
- [`StatusType`](StatusType.md) — overall status.
- [`TvxLogStatusType`](../../../../Types/Enumerations/TvxLogStatusType.md) — enum values.

<small>Created 2026-07-15</small>
