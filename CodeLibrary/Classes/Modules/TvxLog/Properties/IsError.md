---
title: IsError
description: Tests for exact Error status; its setter can change Boolean execution Status without making this computed value match.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, error, status]
---

```Delphi
property IsError: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.IsError
    else
      Value := False
  else
    Value := False;
end;
```

### Usage

`IsError` tests for exact Error status; its setter can change Boolean execution Status without making this computed value match.

### Additional Technical Info
`IsError` is true only when overall [`StatusType`](StatusType.md) is exactly `flsError`.

Writing true requests Error and always sets the separate Boolean Status false. If current StatusType is Test/Highlight (higher ordinal), the type remains unchanged and this getter remains false despite Boolean failure.

Writing false requests OK and sets Boolean Status true, but it cannot normally downgrade Error or a higher type. If the type was Error, IsError therefore still returns true after the false assignment while execution Status has become true.

The assignment creates no error/success message or exception record. This compatibility property is not a reliable symmetric toggle; prefer read-only checking and normal error/reset lifecycle operations.

Status changes can affect continuation, error-file movement, notification and persistence and are not synchronised.

**Related entries**

- [`StatusType`](StatusType.md) — exact two-field algorithm.
- [`IsSuccess`](IsSuccess.md) — complementary exact OK check with similar mismatch.
- [`IsCancelled`](IsCancelled.md) — only quick property whose false setter genuinely resets.

<small>Created 2026-07-15</small>
