---
title: "ExceptionProc"
description: "Returns the PascalScript procedure index associated with the active exception handler frame."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - exceptions
  - diagnostics
  - procedures
---

```Delphi
function ExceptionProc: Cardinal;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  RuntimeProcedure: Cardinal;
begin
  try
    RaiseException(erCustomError, 'Fictional procedure example');
  except
    RuntimeProcedure := ExceptionProc;
    Value := RuntimeProcedure;  // An internal index, not a procedure name.
  end;
end;
```

### Usage

`ExceptionProc` returns the Velox scripting procedure index associated with the active exception handler frame.

**Returns**

A 32-bit `Cardinal` containing a Velox scripting procedure-table index, or the executor's current invalid-value sentinel when no usable index is available. The value is build- and compilation-specific.

**Behaviour**

- The index is not a procedure name, method address, stable identifier or source coordinate.
- Inside a protected `try` sequence, before an error, the top frame already exists and the function can return its owning procedure index.
- Inside an `except` block, the same frame normally remains at the top of the stack until the block completes or the exception is re-raised.
- Outside a frame, normal execution commonly has the executor's `$FFFFFFFF` invalid index from run initialisation.

**Errors**

No exception is raised merely because the index is invalid or not useful. Runtime stack/allocation failures can propagate through the VM.

**Usage notes**

Use Velox compilation/runtime logs for a translated procedure name and source location. Combine [`ExceptionType`](ExceptionType.md) with [`ExceptionToString`](ExceptionToString.md) for durable human-readable diagnostics.

### Additional Technical Info
`ExceptionProc` returns a low-level index into the current PascalScript executor's compiled procedure table. When called in an active handler it identifies the procedure that owns the top handler frame; it does not reliably identify a nested procedure or imported function in which the error originated.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The compiler registers `ExceptionProc` as a built-in and the runtime dispatches it to `TPSExec.LastExProc`:

1. With an active exception frame, the getter finds the frame's `CurrProc` pointer in the executor's `FProcs` table and returns that index.
2. Without a frame, it returns the executor-level `ExProc` saved when `CMD_Err3` routed the most recent VM error.
3. The runtime writes the 32-bit result to the script stack for the declared `Cardinal` result.

Exception transfer rewinds the VM to the selected handler frame's procedure before the handler runs. Consequently, the active-frame branch intentionally describes the handler owner, even when the original error was recorded while a called script procedure or imported operation was executing.

**Edge cases and quirks**

- An error raised in a called procedure can be caught by a handler in its caller. From that handler, `ExceptionProc` can identify the caller that owns the handler rather than the callee where the error occurred.
- Nested `try` regions expose the innermost active frame. Removing or entering a nested frame can therefore change the result without any change to the underlying script procedure.
- Recompiling the script can reorder the procedure table. Persisted or compared indices have no compatibility contract.
- The internal getter is an `Integer`, the public declaration is `Cardinal`, and the runtime operates with range checks disabled. The invalid `-1` bit pattern is therefore observable as `$FFFFFFFF` when interpreted as unsigned.

**Side effects**

None. The function performs a lookup in the current executor's procedure table.

**Performance and concurrency**

For an active frame, the implementation searches the procedure table for the frame's procedure pointer; cost is linear in the number of compiled procedures. The table is normally small enough for diagnostics, but avoid using this function as routine application logic. The result is local to one executor and provides no thread-safety guarantee.

**Related entries**

- [`ExceptionPos`](ExceptionPos.md) exposes the associated handler-position field and is normally a sentinel inside `except`.
- [`ExceptionType`](ExceptionType.md) returns the VM error category.
- [`ExceptionParam`](ExceptionParam.md) returns the saved parameter text.
- [`try..except`](../../ScriptingGuide/Statements/tryexcept.md) describes the handler-frame lifecycle.

<small>Created 2026-07-15</small>
