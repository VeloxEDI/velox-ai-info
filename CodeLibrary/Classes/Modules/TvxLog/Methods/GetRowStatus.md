---
title: GetRowStatus
description: Returns the current temporary row-status ordinal and immediately resets only that row mirror to OK.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, row-status, stateful]
---

```Delphi
function GetRowStatus: Integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.GetRowStatus
    else
      Value := -1
  else
    Value := -1;
end;
```

### Usage

`GetRowStatus` returns the current temporary row-status ordinal and immediately resets only that row mirror to OK.

### Additional Technical Info
`GetRowStatus` consumes the temporary status accumulated for a row/line.

The method returns `Ord(RowStatusType)` and then directly resets RowStatusType to `flsOK`. Overall StatusType, HeaderStatusType, Boolean Status and log content remain unchanged.

The row mirror receives a new overall status only when StatusType successfully escalates to a greater ordinal, and it can be assigned independently by script. The [`RowStatusType`](../Properties/RowStatusType.md) getter does not reset it.

**Quirks and concurrency**

- This is read-and-reset state: a second call normally returns OK.
- Header and row mirrors are independent; consuming one does not consume the other.
- The returned Integer is the current `TvxLogStatusType` ordinal.
- Concurrent consumers are unsafe because one caller can reset the value before another reads it.

**Related entries**

- [`RowStatusType`](../Properties/RowStatusType.md) — non-destructive mirror.
- [`GetHeaderStatus`](GetHeaderStatus.md) — independent header mirror.
- [`StatusType`](../Properties/StatusType.md) — persistent overall status.

<small>Created 2026-07-15</small>
