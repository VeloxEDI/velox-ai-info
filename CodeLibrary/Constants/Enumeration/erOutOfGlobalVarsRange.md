---
title: erOutOfGlobalVarsRange
description: "Indicates that bytecode addressed a global-variable slot outside the loaded PascalScript global table."
sidebar_position: 34
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, global-variable, bytecode]
---

```Delphi
erOutOfGlobalVarsRange = 8
```

### Example

```Delphi
function IsInvalidGlobalSlot(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erOutOfGlobalVarsRange;
end;
```

### Usage

`erOutOfGlobalVarsRange` indicates that bytecode addressed a global-variable slot outside the loaded Velox scripting global table.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Out of Global Vars range`. Automatic producers do not include the invalid index or current count.

### Additional Technical Info
`erOutOfGlobalVarsRange` is member ordinal 8 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 34 is alphabetical navigation metadata and is not its enumeration value.

`erOutOfGlobalVarsRange` is emitted by variable-decoding paths when an encoded global-variable index is greater than or equal to the executor's loaded global count. It is a VM address-table failure, not an indication that a valid variable contains an empty, Null or out-of-business-range value.
The failure generally indicates corrupt/incompatible bytecode or a compiler/runtime contract problem. Normal Pascal source refers to variables by name and the compiler emits the numeric slot.

#### Behavior, recovery and quirks

- Do not confuse this category with the documented global variables in the Code Library's Variables / Globals branch; it concerns the compiled executor table.
- Retain the exact compiled script, procedure, position and Velox version.
- Reload only after recompiling or correcting artifact integrity; the VM cannot infer the intended variable.
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
