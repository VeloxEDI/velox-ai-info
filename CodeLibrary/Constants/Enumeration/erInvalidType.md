---
title: erInvalidType
description: "Indicates invalid, missing or unsupported PascalScript runtime type metadata."
sidebar_position: 28
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, runtime-type, bytecode]
---

```Delphi
erInvalidType = 2
```

### Example

```Delphi
function IsInvalidRuntimeType(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erInvalidType;
end;
```

### Usage

`erInvalidType` indicates invalid, missing or unsupported Velox scripting value type metadata.

#### Using the error value

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) returns `Invalid Type`; the saved parameter normally does not identify the affected type.

During script loading, this error usually indicates incompatible or damaged compiled script data. During execution, it can indicate a Velox scripting defect rather than a recoverable business validation failure.

Capture `ExceptionProc`, `ExceptionPos`, the compiled script, the Velox version and the involved declaration before another error replaces them. Do not persist the numeric ordinal; store the member name and formatted message.

- It is different from the source-code `type mismatch` diagnostic.
- Handling the error does not roll back database, dataset, filesystem or external-system effects that already occurred.

### Additional Technical Info
`erInvalidType` is member ordinal 2 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 28 is alphabetical navigation metadata and is not its enumeration value.

`erInvalidType` is used when the loader or executor cannot resolve a valid PascalScript type record. Loader producers include unsupported base-type tags, invalid type references, impossible exported-type metadata and failures to allocate/initialise a declared global type. Runtime producers include operands that refer to a type index outside the loaded type table or an operation whose value category is not supported at that point.
It differs from [`ErTypeMismatch`](ErTypeMismatch.md): `erInvalidType` says the type metadata/reference itself is not valid for the operation, while a mismatch usually involves two otherwise known types that cannot participate together.

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
