---
title: erInvalidOpcode
description: "Indicates that the PascalScript executor encountered a bytecode opcode it does not recognise."
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, bytecode, opcode]
---

```Delphi
erInvalidOpcode = 5
```

### Example

```Delphi
function IsUnknownBytecodeOperation(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erInvalidOpcode;
end;
```

### Usage

`erInvalidOpcode` indicates that the Velox scripting executor encountered a bytecode opcode it does not recognise.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Invalid Opcode`. The runtime does not include the opcode byte in the parameter, so retain the procedure/position and matching compiled artifact for diagnosis.

### Additional Technical Info
`erInvalidOpcode` is member ordinal 5 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 26 is alphabetical navigation metadata and is not its enumeration value.

`erInvalidOpcode` is raised by the interpreter's default opcode branch after it fetches an operation byte for which the current runtime has no implementation. The procedure number and bytecode position identify where execution stopped.
This is an execution-time bytecode/runtime compatibility or integrity failure. It is not a Pascal source syntax/compiler error: valid source is normally rejected earlier if it cannot be compiled.

#### Behavior, recovery and quirks

- An invalid opcode can occur after earlier script statements and host calls have completed. Exception propagation does not undo those side effects.
- Do not deliberately raise this member for unsupported business operations; use `erCustomError` with actionable text.
- Recompile against the current Velox scripting compiler/runtime and investigate artifact corruption if the error persists.
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
