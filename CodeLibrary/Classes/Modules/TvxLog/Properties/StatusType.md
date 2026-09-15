---
title: StatusType
description: Gets or requests an ordinal-only escalation of the overall log status, with separate header/row mirror and Boolean Status side effects.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, status-type, state]
---

```Delphi
property StatusType: TvxLogStatusType read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.StatusType
    else
      Value := flsNotSet
  else
    Value := flsNotSet;
end;
```

### Usage

`StatusType` gets or requests an ordinal-only escalation of the overall log status, with separate header/row mirror and Boolean Status side effects.

### Additional Technical Info
`StatusType` is the Log's overall `TvxLogStatusType`.

The getter returns the current field. The setter does not simply assign: it updates the type only when the new enum ordinal is greater than the current ordinal.

**Setter algorithm**

1. If `Value > current StatusType`, store Value and mirror it to HeaderStatusType and RowStatusType.
2. Independently of whether step 1 changed the type:
   - `flsError` makes the separate Boolean Status false;
   - `flsOK` makes Boolean Status true;
   - other values do not change Boolean Status.

No message/log item is created by property assignment.

**Ordinal order and consequences**

`flsNotSet`, OK, Warning, Issue, Duplicate, Cancelled, Error, Test and Highlight have ordinals 0 through 8. Therefore:

- OK/NotSet cannot normally clear a warning/error;
- Test and Highlight numerically prevent a later Error from becoming StatusType;
- assigning Error after Highlight leaves StatusType=Highlight but sets Boolean Status=false;
- assigning OK after Error leaves StatusType=Error but sets Boolean Status=true; and
- header/row mirrors change only on a successful greater-ordinal transition.

The quick Boolean properties inherit these quirks. [`IsCancelled := False`](IsCancelled.md) is exceptional: it writes the backing type to NotSet first, then requests OK, reliably resetting overall/header/row and Boolean Status. [`Clear`](../Methods/Clear.md) is the full destructive lifecycle reset.

**Use and safety**

Prefer native logging operations that add a corresponding message and allow normal escalation. If script must inspect this property, compare named enum values, not assumptions that a higher ordinal always means a more severe business result.

Status mutation can affect continuation, routing, audit, retry, notification and persistence. It is unsynchronised and should not race with active processing.

**Related entries**

- [`TvxLogStatusType`](../../../../Types/Enumerations/TvxLogStatusType.md) — exact enum.
- [`HeaderStatusType`](HeaderStatusType.md) and [`RowStatusType`](RowStatusType.md) — temporary mirrors.
- [`IsSuccess`](IsSuccess.md), [`IsCancelled`](IsCancelled.md) and [`IsError`](IsError.md) — computed convenience properties.

<small>Created 2026-07-15</small>
