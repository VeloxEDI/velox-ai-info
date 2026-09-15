---
title: erOutOfProcRange
description: "Indicates that PascalScript attempted to invoke a procedure number outside the loaded procedure table."
sidebar_position: 36
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, procedure-index, bytecode]
---

```Delphi
erOutOfProcRange = 9
```

### Example

```Delphi
function IsInvalidProcedureIndex(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erOutOfProcRange;
end;
```

### Usage

`erOutOfProcRange` indicates that Velox scripting attempted to invoke a procedure number outside the loaded procedure table.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Out of Proc Range`. The invalid procedure number and table size are not placed in the parameter.

### Additional Technical Info
`erOutOfProcRange` is member ordinal 9 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 36 is alphabetical navigation metadata and is not its enumeration value.

`erOutOfProcRange` is emitted when `RunProc` receives a procedure number greater than or equal to `FProcs.Count` and when bytecode call paths decode an invalid target index. The target cannot be resolved to either an internal or external procedure record.
This differs from [`erCouldNotCallProc`](erCouldNotCallProc.md): that category has a valid/resolved target whose adapter fails, whereas `erOutOfProcRange` has no procedure record at the requested numeric slot.

#### Behavior, recovery and quirks

- The number is compiled VM metadata, not a public stable identifier and not the Code Library sidebar position.
- Corrupt/incompatible bytecode, stale exported-procedure references or incorrect host use of numeric `RunProc` APIs are primary causes.
- Retain the call context and artifact; recompilation is safer than attempting to substitute another index.
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
