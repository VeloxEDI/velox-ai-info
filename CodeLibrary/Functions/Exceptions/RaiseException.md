---
title: "RaiseException"
description: "Raises a PascalScript runtime exception with an explicit type and parameter."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - exceptions
  - control-flow
  - validation
---

```Delphi
procedure RaiseException(Ex: TIFException; Param: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Candidate: string;
begin
  Candidate := '';
  try
    if Candidate = '' then
      RaiseException(erCustomError, 'Fictional required value is empty');
  except
    Value := ExceptionToString(ExceptionType, ExceptionParam);
  end;
end;
```

### Usage

`RaiseException` raises a Velox scripting runtime exception with an explicit type and parameter.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Ex` | `TIFException` | VM error category. Use `erCustomError` for a deliberate script-defined validation or business-rule failure; use another category only when its runtime meaning is genuinely applicable. |
| `Param` | `string` | Text saved with the error. Its display treatment depends on `Ex`; the exception runtime converts it through an ANSI-string path. |

**Errors**

The requested exception is the procedure's normal outcome. If no script handler accepts it, the executor is paused and the saved error is returned to the host execution boundary. Errors raised while unwinding or running `finally`/handler code can replace or propagate beyond the original error according to the active frame state.

**Usage notes**

Validate predictable Null, empty, range and format cases directly when recovery is local. Raise `erCustomError` when the current operation cannot continue and the caller needs the normal Velox exception path. Keep `Param` concise and avoid customer-sensitive values unless the approved logging/exposure policy permits them.

### Additional Technical Info
`RaiseException` creates a PascalScript virtual-machine error with a chosen `TIFException` category and parameter. For every category other than `ErNoError`, it interrupts the current statement sequence and transfers control through the VM's `finally`/`except` stack or, when unhandled, out to the owning Velox execution boundary.

The example uses a fictional local value and catches the deliberate custom error. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The compiler registers this as built-in dispatch 31. The runtime adapter reads `Ex` from the integer stack slot, reads `Param` as PascalScript `AnsiString` and calls `TPSExec.CMD_Err2`, which delegates to `CMD_Err3` without a Delphi exception object.

`CMD_Err3` determines the currently executing script-procedure index, checks the executor's optional `OnException` callback, then calls `TPSExec.ExceptionProc`. No current Velox product assignment to that optional callback was found, so normal Velox use proceeds directly to VM exception handling at this point. `ExceptionProc` saves the procedure, bytecode position, category and parameter before walking active exception frames from innermost to outermost. It unwinds VM stack values, runs pending `finally` code first, enters an available `except` block, or pauses the executor when no script handler accepts the failure.

**Behaviour**

- With `erCustomError`, [`ExceptionToString`](ExceptionToString.md) later returns `Param` directly.
- Code following the call in the same statement sequence is skipped when `Ex` is a real error. A matching handler, pending cleanup or outer Velox boundary determines what runs next.
- Existing dataset, file, network, module or object side effects are not rolled back by exception transfer. A called API must provide its own transaction/rollback contract.
- The underlying runtime supports an optional pre-handler `OnException` callback, but the current Velox setup does not assign it. An error that remains unhandled can still be observed and logged at the outer Velox execution boundary.
- Raising a new error from inside an `except` block propagates that new error outward; it does not preserve the original saved category, parameter or native exception object.

**Edge cases and quirks**

- `RaiseException(ErNoError, Param)` does **not** raise. The runtime still records the supplied fields and would invoke the optional callback if a host assigned one, then `ExceptionProc` exits without changing control flow. The current Velox setup does not assign that callback. Do not use `ErNoError` with this procedure.
- The current compiler's script `string` is Unicode, but the built-in adapter explicitly converts `Param` to PascalScript `AnsiString`. Characters outside the active ANSI code page can be changed before the error is stored.
- Some `TIFException` categories ignore `Param` when formatted, some incorporate it, and `erCannotImport` truncates at its first control character. See `ExceptionToString` for the exact mapping.
- A general `erException` formats as `Exception: <Param>`; it does not construct or expose a typed Delphi exception object.
- An exception in a handler skips that handler and searches outward. Use [`RaiseLastException`](RaiseLastException.md) when the intention is to propagate the original caught error unchanged.

**Side effects**

For non-zero error categories, the procedure changes VM control flow, unwinds temporary stack values and can run cleanup/handler code or cause the current script event or Flow action to fail. The current Velox setup provides no assigned pre-handler callback at this runtime hook. The procedure does not itself write a log or roll back application state.

**Performance and concurrency**

Normal exception propagation is more expensive than an explicit branch: it searches handler frames, unwinds VM stack values and may cross the host boundary. Use it for exceptional failure, not routine value testing. Exception state is executor-local and does not serialise shared resources or make partially completed operations atomic.

**Related entries**

- [`ExceptionType`](ExceptionType.md) reads the category saved by the active handler.
- [`ExceptionParam`](ExceptionParam.md) reads its parameter.
- [`ExceptionToString`](ExceptionToString.md) documents the exact type-dependent display text.
- [`RaiseLastException`](RaiseLastException.md) propagates the original saved handler error rather than constructing a replacement.
- [`try..except`](../../ScriptingGuide/Statements/tryexcept.md) explains handler transfer and the absence of automatic rollback.

<small>Created 2026-07-15</small>
