---
title: GetHeaderStatus
description: Returns the current temporary header-status ordinal and immediately resets only that header mirror to OK.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, header-status, stateful]
---

```Delphi
function GetHeaderStatus: Integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.GetHeaderStatus
    else
      Value := -1
  else
    Value := -1;
end;
```

### Usage

`GetHeaderStatus` returns the current temporary header-status ordinal and immediately resets only that header mirror to OK.

### Additional Technical Info
`GetHeaderStatus` consumes the temporary status accumulated for a header/output group.

It returns `Ord(HeaderStatusType)`, then directly sets HeaderStatusType to `flsOK` (ordinal 1). It does not reset overall StatusType, RowStatusType, Boolean Status, messages or handled state.

Overall StatusType escalation mirrors into the header value only when a new overall ordinal is greater. Scripts can also assign HeaderStatusType directly. Reading the [`HeaderStatusType`](../Properties/HeaderStatusType.md) property is non-destructive; calling this method is destructive.

**Quirks and concurrency**

- Multiple calls without an intervening header-status change return the original value once, then OK.
- The Integer is an enum ordinal, not an HTTP/database-independent status contract; store/compare named values where possible.
- An overall error remains an error after this method, even though the next header read begins at OK.
- Calls are unsynchronised; competing consumers can steal/reset each other's status.

**Related entries**

- [`HeaderStatusType`](../Properties/HeaderStatusType.md) — non-destructive temporary property.
- [`GetRowStatus`](GetRowStatus.md) — independent row mirror.
- [`StatusType`](../Properties/StatusType.md) — non-consumed overall status.

<small>Created 2026-07-15</small>
