---
title: erNullPointerException
description: "Indicates a nil PascalScript pointer, object or interface receiver was required for a runtime operation."
sidebar_position: 32
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, nil, pointer]
---

```Delphi
erNullPointerException = 21
```

### Example

```Delphi
function IsNilReferenceFailure(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erNullPointerException;
end;
```

### Usage

`erNullPointerException` indicates a nil Velox scripting pointer, object or interface receiver was required for a runtime operation.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Null Pointer Exception`.

### Additional Technical Info
`erNullPointerException` is member ordinal 21 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 32 is alphabetical navigation metadata and is not its enumeration value.

`erNullPointerException` is emitted when the VM dereferences a PascalScript pointer whose destination is nil and from multiple class/interface import adapters when a method or property receiver is nil. It prevents the adapter from making the native call with that receiver.
The category does not identify which variable was nil and does not expose a memory address. Diagnose from the procedure/bytecode position, declaration and the object's construction/assignment/lifetime path.

#### Behavior, recovery and quirks

- Not every nil interface-related path uses this category. Object-to-interface conversion can emit [`erInterfaceNotSupported`](erInterfaceNotSupported.md) when its source object is nil.
- An `Assigned` check is only a snapshot and cannot make an externally owned object safe after another owner frees it. Follow each API's ownership/lifetime contract.
- Do not catch and continue unless the operation is genuinely optional and state remains consistent. Earlier side effects are not automatically rolled back.
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
