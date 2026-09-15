---
title: "ExecuteFlow"
description: "Synchronously checks out, loads and executes another flow by GUID with a supplied Test flag."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - program-control
  - flow
  - execution
  - pooling
---

```Delphi
function ExecuteFlow(const aFID: TGuid; const aTest: boolean): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  ChildFlowFID: TGuid;
begin
  ChildFlowFID := StringToGUID('{11111111-2222-3333-4444-555555555555}');

  if not ExecuteFlow(ChildFlowFID, Test) then
    raise Exception.Create('The referenced flow did not complete successfully');

  Value := True;
end;
```

### Usage

`ExecuteFlow` synchronously checks out, loads and executes another flow by GUID with a supplied Test flag.

Validate the target FID during configuration review, propagate the current `Test` flag deliberately, log enough caller context to correlate the two independent logs and treat `False` as a flow failure. Avoid circular dependencies and place a business-level idempotency boundary around externally visible work.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFID` | `TGuid` | FID of the flow/action definition to load or check out from the global pool. Use the configured flow's stable FID, not its display name. |
| `aTest` | `boolean` | Value assigned to the checked-out action's `Test` property before execution. Pass the current `Test` flag when the called flow should follow the caller's test mode. |

**Returns**

Returns `True` when the referenced action manager's `Execute` method returns `True`. Returns `False` when the action cannot be obtained/loaded or its execution reports failure.

An unknown, missing or unloadable FID returns `False` silently at this function level. The routine does not add a specific “linked flow not found” message to the caller's log. The called flow creates and maintains its own execution log, where its detailed result should be investigated.

### Additional Technical Info
`ExecuteFlow` synchronously executes another configured Velox flow identified by its FID. It obtains an independent action manager from the global action pool, sets that action's `Test` property to the supplied flag, calls its normal `Execute` method and returns the resulting Boolean status.

This is the global `vxActionExe.ExecuteFlow` routine imported directly into PascalScript. It is not the similarly named internal sub-action execution path on `TvxActionMan`: it does not automatically share the caller's parent/action context, locals or transaction lifecycle. The example is fictional and source-reviewed only; no linked flow is executed during documentation validation.

**Implementation and lifecycle**

1. Initialise the result to `False`.
2. Ask the global action pool for `aFID`.
3. The pool removes an available action instance from that FID's free list, or creates and loads a new `TvxActionMan` when none is available.
4. Return `False` if no instance could be loaded.
5. Check `ModuleLoaded`, set `lAction.Test := aTest`, then call `lAction.Execute` synchronously.
6. In Designer, free the action instance. In service/runtime, free it after a failed result when `ReloadModuleOnError` is enabled; otherwise release it back to its per-FID pool.

Checked-out objects are absent from the free pool while in use, allowing concurrent callers to receive separate instances. A reused action remains a pooled mutable object whose normal reset/execution lifecycle is responsible for clearing run-specific state.

**Independent execution boundary**

The called flow follows its own configured source, actions, logging, retries, transports and finalisation. This wrapper does not establish the caller/child relationship used by Velox's internal sub-action mechanism and does not copy the caller's locals into the called action.

Execution is synchronous: the calling script and its worker remain blocked until the complete called flow returns. The caller's current transaction is not a general transaction enclosing all work done by the called action. Design explicit idempotency and recovery when either flow can succeed after the other fails.

**Test mode limitations**

`aTest=True` is forwarded to the action, so action implementations can use their normal test-mode transaction behaviour. It is not a universal guarantee of “no side effects.” File operations, external processes, network requests, email, remote endpoints and custom actions can have effects that a database rollback cannot reverse. Review every action in the referenced flow before using `ExecuteFlow(..., True)` as a safe test.

**Errors and implementation quirks**

- Missing/load-failed actions return `False` without a wrapper diagnostic.
- The redundant `ModuleLoaded=False` branch exits without freeing or releasing the checked-out action. It should be unreachable after a normal successful pool load, but if reached it strands that instance outside the free pool.
- The wrapper has no `try/finally` around execution and release. `TvxActionMan.Execute` handles most execution exceptions internally, but an exception that escapes the call or later release logic can also strand the checked-out object.
- Recursion is not prevented. A flow can call itself, or flows can form a cycle, consuming stack, worker and pooled action instances until another failure occurs.
- Multiple callers can execute the same FID concurrently; downstream resources must tolerate that concurrency.

<small>Created 2026-07-15</small>
