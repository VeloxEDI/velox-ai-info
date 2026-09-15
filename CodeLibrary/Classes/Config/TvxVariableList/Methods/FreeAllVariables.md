---
title: FreeAllVariables
description: Destroys every cached variable and its lazy dataset within the owning list's process or action scope.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variables, cache-invalidation, lifetime]
---

```Delphi
procedure FreeAllVariables;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  // Use only after every user of this action-local cache has stopped.
  Locals.FreeAllVariables;
  Value := True;
end;
```

### Usage

`FreeAllVariables` destroys every cached variable and its dataset created through the variable within the owning list's process or action scope.

### Additional Technical Info
`FreeAllVariables` locks the list, frees each `TvxVariable`, sets its slot to nil, clears the list and unlocks.

The method returns no status or count. Repeated calls on an empty list complete normally. List destruction also invokes it.

**Scope and side effects**

- On Locals it clears the current action-owned cache. On Globals, Settings or AzureSecrets it clears process-global shared state.
- Destroying a variable invokes its [`FreeData`](../../TvxVariable/Methods/FreeData.md), closing/freeing the lazy dataset and releasing its contents/resources.
- No persistent Setting, secret or other source data is deleted. A later lookup creates a new variable and invokes that list's initial-value hook.
- Globals/Locals normally reacquire Null; Settings requery the database; AzureSecrets may perform remote authentication/network I/O.

Previously returned variables and datasets become dangling references. The list lock does not protect callers already using them, so concurrent clearing can cause access violations or corrupt behaviour. Coordinate a quiescent boundary and prefer [`RemoveVariable`](RemoveVariable.md) for a single governed refresh.

Work is proportional to cached entry count and object/dataset destruction occurs synchronously while other operations on the list are blocked.

<small>Created 2026-07-15</small>
