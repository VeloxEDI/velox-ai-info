---
title: IsDuplicate
description: Tests for exact Duplicate status; assignments request Duplicate or OK but false does not normally clear the current type.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, duplicate, status]
---

```Delphi
property IsDuplicate: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.IsDuplicate
    else
      Value := False
  else
    Value := False;
end;
```

### Usage

`IsDuplicate` tests for exact Duplicate status; assignments request Duplicate or OK but false does not normally clear the current type.

### Additional Technical Info
`IsDuplicate` returns true only for exact overall `flsDuplicate`.

- Writing true requests [`StatusType`](StatusType.md)=Duplicate. It succeeds only when Duplicate's ordinal is greater than the current type.
- Writing false requests StatusType=OK. The monotonic setter does not downgrade Duplicate or any higher type, although the separate Boolean Status is set true by the OK request.

Consequently, after `IsDuplicate := False` the IsDuplicate getter can still return true. Conversely, setting it true while already Cancelled/Error/Test/Highlight leaves the current type and returns false.

Assignment adds no Duplicate/OK message. Use the property primarily as an exact check; use the deliberate lifecycle/status-reset path when a reset is genuinely required.

Mutation is unsynchronised and can affect duplicate routing/audit.

**Related entries**

- [`StatusType`](StatusType.md) — ordinal escalation and Boolean Status inconsistency.
- [`IsCancelled`](IsCancelled.md) — exceptional false-reset implementation.

<small>Created 2026-07-15</small>
