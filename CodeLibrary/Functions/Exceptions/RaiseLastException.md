---
title: "RaiseLastException"
description: "Re-raises the saved exception from the active PascalScript exception handler when available."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords:
  - velox
  - scripting
  - exceptions
  - rethrow
  - control-flow
---

```Delphi
procedure RaiseLastException;
```

### Example
**Exception API reference only — not a recommended generated-script failure pattern.** These APIs remain documented accurately. Generated Velox scripts must use [LogError with explicit stop/propagation](../../../instructions/scripts/failure-handling.md).

```Delphi velox-role="api-reference" reason="Demonstrates exception API semantics; not a generated-script recommendation"
procedure ScriptEvent(var Value: Variant);
begin
  try
    try
      RaiseException(erCustomError, 'Fictional nested failure');
    except
      // Perform only safe local handling here, then preserve the failure.
      RaiseLastException;
    end;
  except
    Value := ExceptionToString(ExceptionType, ExceptionParam);
  end;
end;
```

### Usage

This page documents an existing exception API. Do not generate rethrow-based failure handling; use `LogError`, preserve cleanup explicitly, and stop/propagate failure according to the [mandatory standard](../../../instructions/scripts/failure-handling.md).

`RaiseLastException` re-raises the saved exception from the active Velox scripting exception handler when available.

**Behaviour**

- In an active `except` block, a successful re-raise does not return to the next statement in that block.
- An outer script handler receives the same VM exception category and parameter. When a Velox exception object was retained, ownership is transferred outward with the propagation rather than duplicated.
- Side effects completed before the original error, and any work deliberately performed by the inner handler before re-raising, remain completed unless the relevant API provides rollback.
- If no outer script handler accepts the error, the executor is paused and the owning Velox execution boundary handles the saved failure.

**Errors**

The saved exception is the normal propagated outcome. Failures during cleanup or outer handling can replace or accompany it according to those operations. Absence of a re-raisable top frame is not reported as an error.

**Usage notes**

Call `RaiseLastException` directly from a handler when it cannot fully and safely resolve the current failure. Do not call it as a generic raise operation outside `except`; use [`RaiseException`](RaiseException.md) with an explicit, meaningful category instead.

### Additional Technical Info
`RaiseLastException` propagates the error saved in the currently executing PascalScript `except` frame. It is the script-runtime equivalent of re-raising the current caught failure without constructing a replacement type/parameter pair.

The nested example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The compiler registers this parameterless procedure as built-in dispatch 30. At runtime it:

1. Checks that the executor has at least one exception-handler frame.
2. Selects the top frame and requires its `ExceptOffset` to equal the entered-handler marker `InvalidVal - 1`.
3. Takes the saved native exception-object reference from that frame and sets the frame's reference to `nil`, preventing the frame destructor from freeing it during propagation.
4. Calls `TPSExec.ExceptionProc` with the executor's saved procedure index, the frame's internal entered-handler position marker, and the frame's saved `ExceptionData`, `ExceptionParam` and optional object.
5. The normal VM unwind then skips the already-entered handler, runs any pending cleanup and searches outward for another handler or the Velox host boundary.

**Edge cases and quirks**

- The procedure silently does nothing when there is no exception frame, when the top frame is only a protected `try`/`finally` frame, or when its `except` block has not been entered. There is no Boolean result indicating whether propagation occurred.
- The re-raised position is the frame's `$FFFFFFFE` entered-handler sentinel, not the original failing bytecode offset. [`ExceptionPos`](ExceptionPos.md) in an outer handler therefore cannot be treated as a preserved source position.
- The procedure supplies the executor-level saved procedure index rather than recomputing the top frame's owner. This normally retains the original VM procedure index, but it remains low-level executor state rather than a stable source identifier.
- Nested handlers operate on the top frame only. An inner protected frame that is not in its `except` state can cause the call to be a no-op even if an outer handler frame exists.
- Raising a new error before calling `RaiseLastException` changes control flow and can replace the failure being handled; this procedure cannot recover an earlier exception after the active state has been superseded.

**Side effects**

When applicable, the procedure changes VM control flow, transfers ownership of a saved exception object, unwinds temporary stack state and can run pending `finally` code or fail the current script event. In its no-op states it changes nothing.

**Performance and concurrency**

Propagation cost depends on the number of active handler frames and cleanup blocks crossed. The state belongs to the current executor; the procedure neither locks shared resources nor makes prior operations transactional.

**Related entries**

- [`RaiseException`](RaiseException.md) constructs a new VM error and can replace the original handler state.
- [`ExceptionType`](ExceptionType.md) and [`ExceptionParam`](ExceptionParam.md) let a handler decide whether it can resolve the current failure.
- [`ExceptionPos`](ExceptionPos.md) documents the non-preserved handler-position sentinel.
- [`try..except`](../../ScriptingGuide/Statements/tryexcept.md) explains nested handlers and re-raise control flow.

<small>Created 2026-07-15</small>
