---
title: IsIssue
description: Tests for exact Issue status; assignments request Issue or OK but false does not normally clear the current type.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, issue, status]
---

```Delphi
property IsIssue: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.IsIssue
    else
      Value := False
  else
    Value := False;
end;
```

### Usage

`IsIssue` tests for exact Issue status; assignments request Issue or OK but false does not normally clear the current type.

### Additional Technical Info
`IsIssue` returns true only when overall [`StatusType`](StatusType.md) is exactly `flsIssue`.

Writing true requests Issue. It cannot replace Duplicate, Cancelled, Error, Test or Highlight because their ordinals are already higher, so the getter can remain false.

Writing false requests OK. The overall type normally remains Issue/higher because StatusType is monotonic, while the OK request separately makes Boolean Status true. Thus IsIssue can still return true immediately after `IsIssue := False`.

No Issue/OK message is added. Treat the property as an exact convenience check, not a symmetric Boolean flag. Mutation can affect issue routing/audit and is unsynchronised.

**Related entries**

- [`StatusType`](StatusType.md) — ordinal setter.
- [`IsCancelled`](IsCancelled.md) — exceptional true reset on false assignment.

<small>Created 2026-07-15</small>
