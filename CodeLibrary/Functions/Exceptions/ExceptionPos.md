---
title: "ExceptionPos"
description: "Returns the active exception handler's low-level position value, normally an internal sentinel inside a handler."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - exceptions
  - diagnostics
  - bytecode
---

```Delphi
function ExceptionPos: Cardinal;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  RuntimePosition: Cardinal;
begin
  try
    RaiseException(erCustomError, 'Fictional position example');
  except
    RuntimePosition := ExceptionPos;
    Value := RuntimePosition;  // Treat as an opaque VM diagnostic.
  end;
end;
```

### Usage

`ExceptionPos` returns the active exception handler's low-level position value. Inside a handler this is normally an opaque sentinel, not a source line.

**Returns**

A 32-bit `Cardinal` containing the current handler-frame `ExceptOffset` when an exception frame exists, or the executor-level saved exception position when no frame exists.

**Behaviour**

- Inside the `except` block shown in the example, the result is normally the entered-handler sentinel.
- Inside a protected `try` sequence before a failure, it is the handler's future bytecode offset rather than a failure position.
- Outside an exception frame, normal execution commonly exposes the executor's initial `InvalidVal` sentinel; after an unhandled failure the script normally cannot continue merely to read it.
- The function does not return a filename, row or column. Use the error details reported by Velox when source location is required.

**Errors**

There is no invalid-state error and no stable sentinel intended for application logic. If no useful position exists, the function returns an opaque execution value.

**Usage notes**

Use the Velox compilation or runtime log when you need an actionable source location. Log `ExceptionType` and the formatted exception text for script-level diagnostics; treat `ExceptionPos` as an diagnostic value only.

### Additional Technical Info
`ExceptionPos` exposes the current PascalScript executor's low-level position field. Despite its name, the value returned from inside an active `except` handler is normally an internal handler-state sentinel, not the bytecode position at which the failure occurred and not a source line or column.

The example deliberately treats the value as opaque. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The compiler registers `ExceptionPos` as a PascalScript built-in. Runtime dispatch calls `TPSExec.LastExPos` and writes its 32-bit result to the script stack:

1. With an active exception frame, `LastExPos` returns that frame's `ExceptOffset`.
2. On transfer into the frame's `except` block, the runtime first sets `ExceptOffset` to `InvalidVal - 1` to mark the handler as entered.
3. Without a frame, `LastExPos` returns the executor's `ExPos`, which is set to the VM instruction position when an error is first routed through `CMD_Err3`.

The included PascalScript runtime disables Delphi range and overflow checking. Its internal `InvalidVal` is `Cardinal(-1)` (`$FFFFFFFF`), so the entered-handler marker has the 32-bit pattern `$FFFFFFFE` (4294967294 when viewed as `Cardinal`). These are implementation sentinels, not public source coordinates.

**Edge cases and quirks**

- `ExceptionPos` is therefore not suitable for branching, stable telemetry, source navigation or comparing builds. Bytecode offsets can change whenever a script is recompiled.
- [`RaiseLastException`](RaiseLastException.md) passes the active frame's entered-handler sentinel back into the propagation path, so re-raising does not restore an original failure offset.
- Nested handlers expose only the top frame. An inner `try` frame can hide outer handler state while it exists.
- The declaration returns `Cardinal`, while the internal getter is an `Integer`. The unchecked runtime preserves the 32-bit sentinel bit pattern across that boundary.

**Side effects**

None. It reads the current executor or top handler frame.

**Performance and concurrency**

The lookup is constant-time. The value is tied to one executor's current control-flow state; it provides no synchronisation and must not be used to coordinate concurrent Flow work.

**Related entries**

- [`ExceptionProc`](ExceptionProc.md) exposes the corresponding low-level procedure index and has similar limitations.
- [`ExceptionType`](ExceptionType.md) identifies the VM error category.
- [`ExceptionToString`](ExceptionToString.md) produces the user-facing VM error text.
- [`try..except`](../../ScriptingGuide/Statements/tryexcept.md) explains how the active handler frame is created and consumed.

<small>Created 2026-07-15</small>
