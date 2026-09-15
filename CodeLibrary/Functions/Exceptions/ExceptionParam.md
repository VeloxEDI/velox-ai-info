---
title: "ExceptionParam"
description: "Returns the parameter text attached to the current PascalScript runtime exception."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - exceptions
  - diagnostics
  - pascalscript
---

```Delphi
function ExceptionParam: string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  try
    RaiseException(erCustomError, 'Fictional validation failure');
  except
    Value := ExceptionParam;  // 'Fictional validation failure'
  end;
end;
```

### Usage

`ExceptionParam` returns the parameter text attached to the current Velox scripting runtime exception.

**Returns**

The saved exception parameter as a script `string`. For `erCustomError`, this is normally the complete custom message. Other exception types may store a procedure name, conversion detail, host exception message or an empty string.

**Behaviour**

- The function reads VM state; it does not inspect a Velox `Exception` object and does not create a scoped `E.Message` variable.
- `ExceptionParam` is meaningful only in relation to [`ExceptionType`](ExceptionType.md). The same text can be interpreted differently for different `TIFException` values.
- Calling it while merely inside a protected `try` region, before an exception has entered the handler, reads the top handler frame's initially empty parameter.
- Reading the value does not mark the exception handled, clear it or re-raise it.

**Errors**

There is no separate missing-value exception. String conversion or allocation failures can propagate through the script runtime.

**Usage notes**

Prefer `ExceptionToString(ExceptionType, ExceptionParam)` when logging a general VM failure because many exception types use a fixed description in addition to, or instead of, the parameter. Keep `ExceptionParam` for logic that deliberately understands the corresponding type.

### Additional Technical Info
`ExceptionParam` returns the text parameter saved with the current PascalScript virtual-machine exception. Use it inside a `try..except` handler when the parameter itself is useful; use [`ExceptionToString`](ExceptionToString.md) when you need the runtime's type-aware display text.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The PascalScript compiler registers `ExceptionParam` as a built-in exception function. Runtime dispatch reads `TPSExec.LastExParam`:

1. When an exception-handler frame is active, it returns the `ExceptionParam` field from the top frame.
2. When no frame is active, it returns the executor-level `ExParam` field.
3. The dispatch writes the value through PascalScript's ANSI-string stack path before returning it as the declared script `string`.

When control transfers into an `except` block, the VM copies the current exception parameter into that handler frame and clears the executor's active error code. The handler copy therefore remains available while the block runs.

**Edge cases and quirks**

- Empty text is a valid result. It can mean that the exception type has no parameter, that the producer supplied an empty parameter, or that no exception is saved; it is not a success indicator on its own.
- The current Delphi build declares script `string` as Unicode, but these exception built-ins use PascalScript's `AnsiString` runtime path. Characters that the active ANSI code page cannot represent may be changed during the conversion.
- Runtime and host errors can place data from the failed operation in the parameter. Do not expose it to an external party without applying the Flow's information-disclosure policy.
- The parameter is not guaranteed to equal a native Delphi exception message. The VM maps and stores several error categories of its own.

**Side effects**

None. The function reads the current executor or handler frame.

**Performance and concurrency**

The lookup is constant-time and copies one managed string. The state belongs to the currently executing PascalScript executor; the function does not synchronise shared objects or make concurrent use of an executor safe.

**Related entries**

- [`ExceptionType`](ExceptionType.md) returns the `TIFException` value that gives this parameter its meaning.
- [`ExceptionToString`](ExceptionToString.md) applies the runtime's type-specific formatting rules.
- [`RaiseException`](RaiseException.md) supplies the type and parameter stored by a deliberately raised VM error.
- [`try..except`](../../ScriptingGuide/Statements/tryexcept.md) explains the handler state in which these values are normally read.

<small>Created 2026-07-15</small>
