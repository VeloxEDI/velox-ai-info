---
title: ExecuteFlow
description: Synchronously executes another Velox flow identified by its TGuid and returns its result.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - flow
  - sub-action
---

```Delphi
function ExecuteFlow(const aFID: TGuid; const aSubAction: Boolean): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  ChildFID: TGuid;
begin
  ChildFID := GetActionFID('Child Flow');
  if IsEmptyGuid(ChildFID) then
    Value := False
  else
    Value := Action.ExecuteFlow(ChildFID, True);
end;
```

### Usage

`ExecuteFlow` synchronously executes another Velox flow identified by its TGuid and returns its result.

**Usage notes**

Resolve the identifier from governed configuration, check for an empty GUID and deliberately choose the sub-action mode. Avoid user-supplied arbitrary flow identifiers unless the surrounding design validates authorisation and permitted targets.

**Side effects**

The child is a complete flow execution. It can run scripts, query or update databases, read/write/move files, call services, send transports, write logs and commit or roll back according to its own configuration and test-mode rules. A false result does not imply that every prior external side effect was rolled back.

**Errors and quirks**

- An empty, unknown or unavailable identifier logs a critical configuration error and returns false.
- A pooled object that exists but is not loaded also logs and returns false.
- Exceptions are caught, logged against the caller and converted to false.
- Cleanup is not protected by a method-level `finally`. An exception before normal cleanup can leave borrowed locals, a temporary parent or a checked-out child incompletely released.
- No recursion/cycle guard is present here. A configuration or script that executes itself, directly or indirectly, can recurse until another resource or error stops it.
- A child can change shared named locals even if its result is false.

### Additional Technical Info
`ExecuteFlow` loads another flow by identifier, runs it synchronously and returns that flow's Boolean execution result.

| Parameter | Meaning |
|---|---|
| `aFID` | Persistent identifier of the target action/flow. |
| `aSubAction` | When true, makes the child share the parent/log relationship and folds a false child result into the caller's total status. |

The result is false when the target cannot be obtained, is not loaded, returns failure or raises an exception handled by this method.

**Implementation**

The method asks the process action pool for a `TvxActionMan` with `aFID`. It rejects nil and not-loaded managers with a log error. It then copies the caller's test flag, assigns the caller's named locals into the child and, for a sub-action, temporarily assigns the caller as parent so logging is shared.

The child executes in the calling thread. On normal completion, the method clears the child's borrowed local list, removes the temporary parent and then either frees the child in Designer, frees it after a failed result when reload-on-error is enabled, or returns it to the pool.

**Behaviour**

- Execution is synchronous; the call returns only after the child finishes or the method handles an error.
- Both `aSubAction` values receive the caller's locals. The child list refers to the caller-owned variable objects rather than an isolated value snapshot, so child mutations are visible to the caller.
- `aSubAction = True` shares parent/log context and evaluates the caller's total status as its previous value AND the child result.
- `aSubAction = False` does not attach the parent and does not fold the result into total status automatically; the script still receives the result and must decide what to do with it.
- The caller's test flag propagates. Request, response and other execution context are not explicitly copied by this method.

**Performance and concurrency**

Cost is the full child-flow workload plus pool/load/log overhead. The call blocks the current script and can be long-running. Do not use it as a fire-and-forget queue, parallel launcher or transaction boundary. Pooling isolates normal executions, but caller-owned locals intentionally cross the parent/child boundary.

**Related entries**

- [`TvxActionMan`](../../TvxActionMan.md) — owner and lifecycle of this method.
- [`ActionStatus`](../Properties/ActionStatus.md) — current/total failure-latch behaviour.
- [`GetActionFID`](../../../../Functions/Velox/GetActionFID.md) — resolves a flow name to an identifier.
- [`TGUID`](../../../../Types/DataTypes/TGUID.md) — identifier representation.
- [`Locals`](../../../../Variables/Locals/Locals.md) — shared named-local behaviour.

<small>Created 2026-07-15</small>
