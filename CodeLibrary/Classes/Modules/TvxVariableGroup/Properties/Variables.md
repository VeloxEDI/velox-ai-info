---
title: Variables
description: Returns the host-owned variable at a zero-based child index and propagates native bounds/lifetime failures.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable-group, indexer, zero-based]
---

```Delphi
property Variables[Index: Integer]: TvxVariable read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var Item: TvxVariable;
begin
  // Replace V_MyGroup with a configured group identifier.
  if (V_MyGroup <> nil) and (V_MyGroup.VariableCount > 0) then
  begin
    Item := V_MyGroup.Variables[0];
    Value := Item.Code;
  end
  else
    Value := '';
end;
```

### Usage

`Variables` returns the Velox-provided variable at a zero-based child index and propagates Velox bounds/lifetime failures.

### Additional Technical Info
`Variables` is the read-only Integer indexer on [`TvxVariableGroup`](../../TvxVariableGroup.md).

Indexing is zero-based: valid indices at one instant are `0` through `VariableCount - 1`. Velox locks the group, reads `Children[Index]`, casts it to `TvxVariable`, returns the reference and releases the lock.

There is no explicit bounds check or nil fallback. A negative/out-of-range index propagates the native child-list exception. The getter assumes every child is a variable; malformed structure can cause an invalid cast/use.

**Enumeration and lifetime**

[`VariableCount`](VariableCount.md) and each index access take separate locks. Configuration save/delete, mode switch or cache reload can replace/free a group between calls. The returned [`TvxVariable`](../../../Config/TvxVariable.md) is borrowed and can become stale after the getter releases its lock.

Prefer [`VariableByCode`](VariableByCode.md) when a stable configured code is known. If enumeration is required, keep it within one short script operation, recheck context as appropriate and handle execution errors at the workflow level. Never free returned variables or store them globally.

Reading values can reveal sensitive shared state and writing returned variables affects other executions. Index order is configuration child order, not alphabetical order, database ordering or a permanent identifier.

<small>Created 2026-07-15</small>
