---
title: "try..finally"
description: "Guaranteed cleanup blocks during normal and exceptional Velox script execution."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords:
  - velox
  - scripting
  - statements
  - cleanup
---

Use `try..finally` to run cleanup statements after a protected sequence, whether that sequence completes normally or leaves with a runtime exception or structured control transfer.

## Syntax

```Delphi
try
  ProtectedStatements;
finally
  CleanupStatements;
end;
```

`finally` does not handle an exception. After cleanup, an outstanding exception continues to an enclosing handler or the Velox event boundary.

## How it works

The compiler emits an exception-handler frame with a `finally` offset. The PascalScript VM records any pending runtime exception, transfers to the cleanup code, and then restores propagation when the cleanup finishes. When no exception occurs, normal control still passes through the cleanup sequence before continuing after `end`.

The compiler also tracks exits from structured regions. `break` and `continue` within a protected region emit the required handler-unwind operations, so applicable cleanup code runs before control reaches the loop target. A procedure `exit` emits the VM return opcode; the runtime walks active handler frames for that call, records the return point and runs their pending `finally` blocks before completing the return. The same handler mechanism is used for runtime exception propagation.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := 'started';
  try
    Value := Value + '|work';
  finally
    Value := Value + '|cleanup';
  end;
end;
```

On normal completion, `Value` becomes `started|work|cleanup`. If the protected operation raised, the cleanup assignment would still be attempted before that exception propagated.

In real scripts, use `finally` for a verified cleanup action such as restoring state or releasing a script-owned resource. Do not free or close Velox-owned datasets or objects unless their individual reference pages explicitly transfer ownership to the script.

`LogError` does not throw or enter an `except` block. When a known failure is logged, use `Exit` and retain this explicit finally cleanup; when failure is inside a helper, return a checked failure result so the calling event also stops. Cleanup failures must be logged as errors too. See [mandatory failure handling](../../../instructions/scripts/failure-handling.md).

## Common mistakes

- Treating `finally` as an error handler. It guarantees an attempt to clean up but does not suppress the original exception.
- Returning a success value unconditionally in cleanup and thereby concealing what operation failed at the host boundary.
- Releasing a module, dataset or map object that is owned by Velox rather than by the script.
- Performing the acquisition before entering `try`. If acquisition succeeds and a later statement fails before the handler frame is installed, cleanup cannot run.

## Edge cases and quirks

- If cleanup raises a new exception, it can replace or obscure the pending failure. Keep cleanup small, defensive and limited to operations whose failure contract is understood.
- The modified parser accepts combined `try ... finally ... except ... end` and `try ... except ... finally ... end` forms. These are not standard Delphi constructs. Prefer explicit nesting: use an inner `try..finally` for cleanup and an outer `try..except` for recovery, or the reverse when recovery itself needs cleanup.
- Structured `break`/`continue` paths are compiled with handler unwinding, and the runtime return path unwinds cleanup before `exit` completes. Arbitrary jumps across protected regions are checked and can fail compilation.
- Cleanup is attempted during VM-managed script errors. Catastrophic process termination or failures outside the script runtime cannot be made recoverable by this statement.
- A cleanup block can observe state changed before the exception; it does not receive a typed exception object.

## Errors and side effects

Malformed structure prevents compilation. Side effects before an exception remain unless cleanup or the called API explicitly reverses them. Cleanup has its own side effects and failure modes; any outstanding exception propagates after a successful cleanup.

## Performance and concurrency

The handler frame adds modest bytecode/runtime overhead. The statement is not a transaction, lock or concurrency boundary. Keep resource ownership explicit and avoid holding scarce resources across expensive or unbounded script work.

## Related reference

- `try..except` — handles a runtime exception rather than only cleaning up.
- `begin..end` — groups statements without exception semantics.
- `Datasets` — follow dataset ownership and edit-state rules; do not infer ownership from access.

## External references

- [Free Pascal: The try...finally statement](https://www.freepascal.org/docs-html/current/ref/refse120.html)
- [Embarcadero DocWiki: Exceptions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Exceptions_%28Delphi%29)
