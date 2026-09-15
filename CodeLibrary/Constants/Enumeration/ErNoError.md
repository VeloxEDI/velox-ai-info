---
title: ErNoError
description: "Represents the zero TIFException sentinel used when the current PascalScript executor or handler has no saved VM error."
sidebar_position: 30
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, no-error, sentinel]
---

```Delphi
ErNoError = 0
```

### Example

```Delphi
function HasNoSavedRuntimeError: Boolean;
begin
  Result := ExceptionType = ErNoError;
end;
```

### Usage

`ErNoError` represents the zero TIFException sentinel used when the current Velox scripting executor or handler has no saved VM error.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `No Error`.

### Additional Technical Info
`ErNoError` is member ordinal 0 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 30 is alphabetical navigation metadata and is not its enumeration value.

`ErNoError` is ordinal 0 and the initial/empty value for PascalScript VM exception state. [`ExceptionType`](../../Functions/Exceptions/ExceptionType.md) returns it when the inspected executor or top handler frame has no saved error.
It means only “no category is stored in this VM state/frame.” It does not prove that a Velox Flow succeeded, that previous work committed, that no warning was logged, or that earlier side effects were rolled back.

#### Behavior, recovery and quirks

- `RaiseException(ErNoError, Param)` does not transfer control. `CMD_Err2` can invoke a host `OnException` callback, then `ExceptionProc` records the supplied fields and exits because the category is zero. Current Velox setup has no assigned callback at this hook.
- Using the zero member as a raise/clear operation is unsafe: it can overwrite executor-level fields, does not clear an active handler frame returned by `LastEx`, and communicates no business outcome.
- Use it for comparisons and initial state. Handle expected categories explicitly and re-raise unexpected errors with `RaiseLastException`.
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
