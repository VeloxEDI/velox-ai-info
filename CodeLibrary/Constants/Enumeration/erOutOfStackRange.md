---
title: erOutOfStackRange
description: "Indicates that PascalScript bytecode addressed a stack-relative slot outside the current VM stack."
sidebar_position: 39
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, stack, bytecode]
---

```Delphi
erOutOfStackRange = 11
```

### Example

```Delphi
function IsInvalidVmStackSlot(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erOutOfStackRange;
end;
```

### Usage

`erOutOfStackRange` indicates that Velox scripting bytecode addressed a stack-relative slot outside the current VM stack.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Out Of Stack Range`. The invalid slot, frame base and current count are not saved in the parameter.

### Additional Technical Info
`erOutOfStackRange` is member ordinal 11 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 39 is alphabetical navigation metadata and is not its enumeration value.

`erOutOfStackRange` is emitted when a stack-relative variable operand resolves beyond `FStack.Count` and by execution paths that require more stack entries than are currently present. It identifies invalid VM frame/operand addressing.
This is not an operating-system thread stack overflow and is unrelated to recursion depth by name alone. It generally indicates corrupt/incompatible bytecode or an interpreter/compiler contract failure.

#### Behavior, recovery and quirks

- Procedure/position and the exact compiled artifact are required to reconstruct the failing operand.
- Do not retry the same instruction or treat the category as a recoverable empty local variable.
- VM handler unwinding can reduce the stack, but the error category itself does not repair the invalid compiled reference.
- Exception transfer is not a database, dataset, filesystem or external-system transaction. Any earlier side effect remains unless the called API or surrounding Flow provides an explicit rollback contract.
- Do not persist the numeric ordinal as an integration contract. Store the member name, formatted message, parameter and relevant procedure/position with the Velox version.

**Related Code Library entries**

- [`TIFException`](../../Types/Enumerations/TIFException.md) - complete member order and shared VM-error contract.
- [`ExceptionType`](../../Functions/Exceptions/ExceptionType.md) - read the category saved for the current executor/handler.
- [`ExceptionParam`](../../Functions/Exceptions/ExceptionParam.md) - read its associated parameter before state changes.
- [`ExceptionProc`](../../Functions/Exceptions/ExceptionProc.md) and [`ExceptionPos`](../../Functions/Exceptions/ExceptionPos.md) - locate the compiled procedure and instruction.
- [`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) - exact text/parameter mapping for every category.
- [`RaiseException`](../../Functions/Exceptions/RaiseException.md) and [`RaiseLastException`](../../Functions/Exceptions/RaiseLastException.md) - create a new error or preserve the caught one.
- [`try..except`](../../ScriptingGuide/Statements/tryexcept.md) - handler availability, propagation and rollback boundaries.

**External references**

- [RemObjects PascalScript `uPSRuntime.pas`](https://github.com/remobjects/pascalscript/blob/master/Source/uPSRuntime.pas) - upstream runtime taxonomy and executor context; the modified source shipped with Velox is authoritative for current behavior.

<small>Created 2026-07-15</small>
