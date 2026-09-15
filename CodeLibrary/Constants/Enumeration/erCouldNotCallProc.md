---
title: erCouldNotCallProc
description: "Indicates that a resolved PascalScript procedure target could not be invoked successfully."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, procedure, dispatch]
---

```Delphi
erCouldNotCallProc = 17
```

### Example

```Delphi
function IsProcedureDispatchFailure(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erCouldNotCallProc;
end;
```

### Usage

`erCouldNotCallProc` indicates that a resolved Velox scripting procedure target could not be invoked successfully.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) returns `Could not call proc`. When `Param` is non-empty it appends ` (` + `Param` + `)`. Current automatic producer sites normally supply no parameter; a parenthesised detail is most likely to come from an explicit [`RaiseException`](../../Functions/Exceptions/RaiseException.md) call or another host integration.

### Additional Technical Info
`erCouldNotCallProc` is member ordinal 17 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 19 is alphabetical navigation metadata and is not its enumeration value.

`erCouldNotCallProc` means that the VM found a procedure target but the runtime adapter could not complete the call. This is later than [`erCannotImport`](erCannotImport.md): the procedure record exists and was resolved, but invocation failed.
The main external-call paths emit it when a registered procedure returns `False` without first setting a more specific executor error. Class/interface dispatch helpers also emit it when their method adapter cannot make the requested call. If the adapter already set another `TPSError`, the VM preserves that category instead of overwriting it with this generic one.

#### Behavior, recovery and quirks

- A valid procedure index is not proof that the Velox adapter can call it with the current object, interface, arguments and runtime state.
- The failed adapter may have changed objects, datasets, files or other host state before returning `False`. VM exception transfer provides no automatic rollback.
- Use the original category/parameter and call position when diagnosing. Replacing it with `erCustomError` removes the distinction between dispatch failure and deliberate business validation.
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
