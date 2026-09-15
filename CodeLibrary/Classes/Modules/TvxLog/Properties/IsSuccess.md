---
title: IsSuccess
description: Tests for exact OK status; true cannot downgrade an existing result and false requests Error rather than simply clearing success.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, success, status]
---

```Delphi
property IsSuccess: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.IsSuccess
    else
      Value := False
  else
    Value := False;
end;
```

### Usage

`IsSuccess` tests for exact OK status; true cannot downgrade an existing result and false requests Error rather than simply clearing success.

### Additional Technical Info
`IsSuccess` is true only when overall [`StatusType`](StatusType.md) is exactly `flsOK`. It is not a direct view of the separate Boolean Status field.

Writing true requests OK and sets Boolean Status true. Because OK cannot downgrade Warning or any higher type, IsSuccess can remain false while execution Status becomes true.

Writing false requests Error, not “not OK”. For a current type below Error, this escalates overall/header/row to Error and makes Boolean Status false. If current type is Test/Highlight, Error cannot replace it but Boolean Status still becomes false, leaving IsSuccess false.

No success/error message is created. Avoid using this as a general status toggle: it can create type/Boolean mismatches and erase neither messages nor evidence.

**Related entries**

- [`StatusType`](StatusType.md) — exact setter logic.
- [`IsError`](IsError.md) — exact Error check.
- [`IsCancelled`](IsCancelled.md) — dedicated compatibility reset.

<small>Created 2026-07-15</small>
