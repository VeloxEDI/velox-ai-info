---
title: erInvalidOpcodeParameter
description: "Indicates that a recognised PascalScript bytecode operation contains an unsupported or invalid selector or operand."
sidebar_position: 27
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, bytecode, operand]
---

```Delphi
erInvalidOpcodeParameter = 6
```

### Example

```Delphi
function IsInvalidBytecodeOperand(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erInvalidOpcodeParameter;
end;
```

### Usage

`erInvalidOpcodeParameter` indicates that a recognised Velox scripting bytecode operation contains an unsupported or invalid selector or operand.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Invalid Opcode Parameter`. Automatic producer sites do not include the bad selector or operand in `Param`.

### Additional Technical Info
`erInvalidOpcodeParameter` is member ordinal 6 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 27 is alphabetical navigation metadata and is not its enumeration value.

`erInvalidOpcodeParameter` means the outer bytecode operation was recognised but a subordinate operation code, comparison selector, conversion/cast selector or other encoded operand was not valid for that instruction. The runtime emits it from several operator and dispatch switch defaults.
It is distinct from [`erInvalidOpcode`](erInvalidOpcode.md), where the primary operation byte itself is unknown, and from [`ErTypeMismatch`](ErTypeMismatch.md), where the encoded operation is valid but the runtime values/types are incompatible.

#### Behavior, recovery and quirks

- The category normally points to corrupt or incompatible compiled script data or a Velox scripting defect rather than end-user configuration.
- Procedure and bytecode position are the essential diagnostic coordinates; keep the exact compiled artifact and product revision.
- Already completed host-side effects are not rolled back when the executor stops.
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
