---
title: "try..except"
description: "Exception interception and recovery blocks supported by Velox scripts."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords:
  - velox
  - scripting
  - statements
  - exceptions
---

Use `try..except` to intercept unexpected script-runtime failures. In generated Velox scripts, report failure using `LogError`, preserve necessary cleanup and explicitly stop/propagate failure; do not generate raise/rethrow statements. See [mandatory failure handling](../../../instructions/scripts/failure-handling.md).

## Syntax

```Delphi
try
  ProtectedStatements;
except
  HandlerStatements;
end;
```

The current Velox PascalScript grammar supports a general handler statement list. It does not implement Delphi's typed `on E: ExceptionType do` handler syntax.

## How it works

`TPSPascalCompiler.ProcessTry` emits a PascalScript exception-handler frame around the protected statements. At runtime:

1. If the protected sequence finishes normally, the handler is removed and the `except` sequence is skipped.
2. If a VM operation or registered call raises an exception recognised by the script runtime, control transfers to the `except` offset and statements after the failing operation are skipped.
3. The handler sequence runs once. Reaching its end marks the exception handled and execution continues after the final `end` (or through a following combined `finally` clause).
4. An exception raised by the handler itself leaves this handler and propagates outward.

PascalScript registers `ExceptionType`, `ExceptionParam`, `ExceptionProc`, `ExceptionPos`, `ExceptionToString` and `RaiseLastException` for inspecting or re-raising the current VM exception. These describe PascalScript's `TIFException`/`TPSError` model, not a Delphi exception-object variable.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Divisor: Integer;
begin
  Divisor := 2;
  try
    Value := 100 div Divisor;
  except
    LogError('Unexpected calculation failure: ' + ExceptionToString(ExceptionType, ExceptionParam));
    Exit;
  end;
end;
```

The example uses a valid divisor and catches an unexpected runtime failure if one occurs. Validate predictable zero divisors before calculating: call `LogError` and `Exit` on failure. Logging alone does not transfer control into `except`; preserve cleanup on the explicit Exit path too.

## Inspecting exception state

Within the handler, the registered functions provide diagnostic fields:

- `ExceptionType` returns the current `TIFException` enumeration value.
- `ExceptionParam` returns the associated text parameter/message.
- `ExceptionProc` returns the PascalScript procedure index attached to the active handler frame.
- `ExceptionPos` is registered as a position function, but the current runtime returns the active frame's `ExceptOffset`. Once control has transferred into the handler, that field is changed to the internal `InvalidVal - 1` sentinel.
- `ExceptionToString` formats a type/parameter pair.
- `RaiseLastException` re-raises the saved current exception when one is available.

The `ExceptionProc`/`ExceptionPos` pair is therefore not a dependable original-failure location from inside an active handler: the procedure can be the enclosing handler procedure rather than a called procedure where the error arose, and the position is normally the sentinel rather than the failing bytecode offset. Treat both as low-level diagnostics and use the host compilation/runtime log for actionable source location information.

Do not expose internal exception text to an external party without considering whether it contains data values supplied to the failed operation.

## Common mistakes

- Copying a Delphi typed handler (`on E: Exception do`) into a Velox script. The modified `ProcessTry` path does not parse typed `on` clauses.
- Swallowing a failure or returning a result without `LogError` and explicit stop/propagation. A bare handler marks the exception handled.
- Using exceptions as ordinary branching for expected Null, empty or zero values. Test predictable conditions explicitly.
- Assuming the handler rolls back dataset edits, file activity or module side effects completed before the failure. It changes control flow only.

## Edge cases and quirks

- The modified grammar accepts `try ... except ... finally ... end` and even `try ... finally ... except ... end` as one combined construct. These are PascalScript extensions, not normal Delphi syntax. Prefer conventional nested `try..except` and `try..finally` blocks for portability and an unambiguous recovery/cleanup order.
- `break` and `continue` compiled inside protected regions emit exception-handler unwind operations before leaving the region. Invalid jumps across structured regions are rejected by compiler checks.
- The handler catches script-runtime errors routed through the VM. Host code may catch, log or transform errors outside the script at an event boundary; this page does not promise that every process-level failure is recoverable inside a script.
- A handler can read the last VM exception metadata, but there is no typed Delphi exception object scoped to the handler.
- `ExceptionPos` exposing the handler sentinel is a current runtime diagnostic quirk, not a source line/column contract.
- If a conventional outer `try..finally` encloses this statement, its cleanup runs after the handler or during propagation as appropriate.

## Errors and side effects

Missing `except`/`finally` or `end`, invalid handler syntax and unsafe cross-region jumps cause compilation errors. Runtime side effects completed before the exception remain unless the called API itself supplies a rollback contract. An unexpected exception in a handler can propagate. The rethrow API remains documented for interpreting existing code; generated-script handlers must use `LogError`, preserve cleanup explicitly and stop/propagate failure.

## Performance and concurrency

Installing a handler has runtime and bytecode overhead, so use it around a coherent failure boundary rather than every simple operation. It does not serialise shared objects or make a non-thread-safe API safe.

## Related reference

- `try..finally` — guarantees cleanup while preserving an unhandled exception.
- `Compilation errors` — compile-time failures are reported before an event runs and are not caught by script `try..except`.
- `Testing values` — explicit guards for expected Variant states.

## External references

- [Free Pascal: The try...except statement](https://www.freepascal.org/docs-html/current/ref/refse119.html)
- [Embarcadero DocWiki: Exceptions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Exceptions_%28Delphi%29)
