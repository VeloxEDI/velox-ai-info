---
title: ErOutOfRange
description: "Represents the PascalScript runtime's general data, index or encoded-value bounds failure."
sidebar_position: 37
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, range, bounds]
---

```Delphi
ErOutOfRange = 10
```

### Example

```Delphi
function IsGeneralVmRangeFailure(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = ErOutOfRange;
end;
```

### Usage

`ErOutOfRange` represents the Velox scripting runtime's general data, index or encoded-value bounds failure.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Out Of Range`. Automatic producers normally provide no offending index, limit or value.

### Additional Technical Info
`ErOutOfRange` is member ordinal 10 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 37 is alphabetical navigation metadata and is not its enumeration value.

`ErOutOfRange` is the broad range category used throughout bytecode loading and execution. Producers guard compiled-buffer reads, attribute/value lengths, array/string/set indexes, encoded variable data, temporary/runtime tables and several opcode-specific bounds. The exact cause must be determined from the failing procedure/position and operation.
It is broader than [`erOutOfGlobalVarsRange`](erOutOfGlobalVarsRange.md), [`erOutOfProcRange`](erOutOfProcRange.md), [`erOutOfStackRange`](erOutOfStackRange.md) and the legacy-named [`erOutofRecordRange`](erOutofRecordRange.md), which identify narrower tables/checks.

#### Behavior, recovery and quirks

- A user-controlled string/array index can cause this category, but during loading it can instead indicate malformed compiled data. Do not assume one recovery strategy from the name alone.
- Where input bounds are predictable, validate before indexing. For loader/bytecode failures, recompile or investigate artifact integrity.
- Range failure after external calls does not roll back completed host changes.
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
