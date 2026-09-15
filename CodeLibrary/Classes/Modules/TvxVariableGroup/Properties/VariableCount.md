---
title: VariableCount
description: Returns a locked snapshot of the number of variable children currently held by the cached group.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable-group, count, concurrency]
---

```Delphi
property VariableCount: Integer read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  // Replace V_MyGroup with a configured group identifier.
  if V_MyGroup <> nil then
    Value := V_MyGroup.VariableCount
  else
    Value := 0;
end;
```

### Usage

`VariableCount` returns a locked snapshot of the number of variable children currently held by the cached group.

### Additional Technical Info
`VariableCount` returns the current child count of a [`TvxVariableGroup`](../../TvxVariableGroup.md).

Velox locks the group, reads its native ChildCount and releases the lock. The operation is constant-time and performs no database load, value evaluation or persistence.

The result is a point-in-time snapshot. The lock does not remain held for a subsequent [`Variables`](Variables.md) access, and host structural operations/cache replacement are not an atomic transaction with script enumeration. A loop bounded by an earlier count can still encounter a stale group or invalid index if configuration changes concurrently.

Count includes configured variable child objects regardless of whether their current Value is blank/null, encrypted, valid for its declared type or usable by the caller. It is not the number of populated values, successful tag expansions or unique codes.

Check the dynamic group reference before reading it, keep count/index use local and short-lived, and do not use it as a durable configuration version.

<small>Created 2026-07-15</small>
