---
title: ErTypeMismatch
description: "Indicates that known PascalScript runtime values or types are incompatible for the requested operation."
sidebar_position: 40
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, type-mismatch, conversion]
---

```Delphi
ErTypeMismatch = 12
```

### Example

```Delphi
function IsRuntimeTypeMismatch(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = ErTypeMismatch;
end;
```

### Usage

`ErTypeMismatch` indicates that known Velox scripting runtime values or types are incompatible for the requested operation.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Type Mismatch`. Automatic producers do not include source/destination type names.

### Additional Technical Info
`ErTypeMismatch` is member ordinal 12 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 40 is alphabetical navigation metadata and is not its enumeration value.

`ErTypeMismatch` is the runtime incompatibility category used by value assignment/conversion, arithmetic/comparison/set operators, class/interface operations and imported-call adapters. Both involved type records may be valid, but the requested combination or conversion is not supported.
Many static mismatches are rejected by the PascalScript compiler. This runtime category remains important for Variants, imported values, dynamically selected operations and corrupted/incompatible bytecode whose types cannot be proven at compile time.

#### Behavior, recovery and quirks

- Distinguish it from [`erInvalidType`](erInvalidType.md), which usually means a type record/reference itself is invalid, and from compiler diagnostics which occur before execution.
- Capture the declaration, actual Variant/base type and operation at the failing procedure/position. The fixed message alone is insufficient.
- Do not silence the error with broad casts without confirming range, Null, object ownership and interface compatibility.
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
