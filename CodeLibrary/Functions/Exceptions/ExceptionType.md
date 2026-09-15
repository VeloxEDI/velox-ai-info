---
title: "ExceptionType"
description: "Returns the TIFException value for the current PascalScript runtime exception."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - exceptions
  - tifexception
  - pascalscript
---

```Delphi
function ExceptionType: TIFException;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  try
    RaiseException(erCustomError, 'Fictional validation failure');
  except
    if ExceptionType = erCustomError then
      Value := ExceptionParam
    else
      RaiseLastException;
  end;
end;
```

### Usage

`ExceptionType` returns the TIFException value for the current Velox scripting runtime exception.

**Returns**

One of the current `TIFException` enumeration values:

| Ordinal | Value | Runtime category |
|---:|---|---|
| 0 | `ErNoError` | No saved VM error |
| 1 | `erCannotImport` | Required imported function could not be resolved |
| 2 | `erInvalidType` | Invalid value type |
| 3 | `ErInternalError` | Velox script-engine failure |
| 4 | `erInvalidHeader` | Invalid compiled-script header |
| 5 | `erInvalidOpcode` | Unknown bytecode operation |
| 6 | `erInvalidOpcodeParameter` | Invalid bytecode operation argument |
| 7 | `erNoMainProc` | No main procedure is available |
| 8 | `erOutOfGlobalVarsRange` | Global-variable index is out of range |
| 9 | `erOutOfProcRange` | Procedure index is out of range |
| 10 | `ErOutOfRange` | General VM range failure |
| 11 | `erOutOfStackRange` | Stack index is out of range |
| 12 | `ErTypeMismatch` | Runtime value/type mismatch |
| 13 | `erUnexpectedEof` | Compiled data ended unexpectedly |
| 14 | `erVersionError` | Compiled-script/runtime version mismatch |
| 15 | `ErDivideByZero` | Division by zero |
| 16 | `ErMathError` | Other mapped arithmetic failure |
| 17 | `erCouldNotCallProc` | Procedure invocation failed |
| 18 | `erOutofRecordRange` | Record-field index is out of range |
| 19 | `erOutOfMemory` | Mapped out-of-memory failure |
| 20 | `erException` | General Velox/host exception mapped by the VM |
| 21 | `erNullPointerException` | Nil pointer/object access |
| 22 | `erNullVariantError` | Invalid Null Variant operation |
| 23 | `erInterfaceNotSupported` | Requested interface is unavailable |
| 24 | `erCustomError` | Explicit or mapped custom runtime error |

Use [`ExceptionToString`](ExceptionToString.md) for the exact display text. Some categories describe Velox script-engine failures that a script cannot deliberately reproduce.

**Errors**

There is no separate missing-state exception. An available but empty frame returns `ErNoError`; VM stack failures can still propagate.

### Additional Technical Info
`ExceptionType` returns the PascalScript virtual machine's saved `TIFException` category. It identifies a runtime error code, not a Delphi exception class and not a script-visible exception object.

The example handles only the deliberately expected custom category and re-raises anything else. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The compiler defines `TIFException` in the same order as the runtime's `TPSError` enumeration and registers `ExceptionType` as built-in dispatch 32. The runtime calls `TPSExec.LastEx`:

1. If an exception-handler frame exists, it returns the top frame's `ExceptionData`.
2. Otherwise it returns the executor-level `ExEx` field.
3. Dispatch stores the enumeration ordinal as a 32-bit integer in the function result.

When an error enters an `except` block, the VM copies the category to the handler frame and resets the executor-level `ExEx` to `ErNoError`. This is why the saved type remains readable from the active handler.

**Behaviour**

- A newly created handler frame is zero-initialised, so calling `ExceptionType` in its protected `try` sequence before a failure returns `ErNoError`.
- Inside an active handler, it returns the category saved for that handler until the frame is removed or reused for propagation.
- Nested `try` regions expose the top frame only.
- Reading the type does not mark the exception handled, clear it or alter normal control flow.

**Edge cases and quirks**

- `TIFException` is PascalScript's VM error taxonomy. Delphi classes such as `EDivByZero` may be translated into one of these values, and several different native failures can therefore share a category.
- Host or imported-code exceptions can be caught, translated or logged at an event boundary rather than becoming a script-catchable value. The function does not guarantee that every process-level exception is visible in a script handler.
- `ErNoError` means that the inspected frame/state has no saved VM error. It does not prove that prior Flow work succeeded or that earlier side effects were rolled back.
- Enumeration ordinals are implementation data. Store the meaningful category/name when durable diagnostics are required rather than persisting the number.

**Side effects**

None. The function reads the current executor or top handler frame.

**Performance and concurrency**

The lookup is constant-time and allocates no user-visible object. Exception state belongs to the current script executor and does not provide a lock or thread-safety boundary.

**Remarks**

Branch only on categories your script can handle meaningfully. For unexpected categories, preserve the original failure with [`RaiseLastException`](RaiseLastException.md) instead of replacing it with a generic message.

**Related entries**

- [`ExceptionParam`](ExceptionParam.md) returns the text associated with the current category.
- [`ExceptionToString`](ExceptionToString.md) maps the category and parameter to runtime display text.
- [`RaiseException`](RaiseException.md) accepts a `TIFException` value to create VM error state.
- [`try..except`](../../ScriptingGuide/Statements/tryexcept.md) explains availability and propagation of the handler state.

<small>Created 2026-07-15</small>
