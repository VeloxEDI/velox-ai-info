---
title: ErInternalError
description: "Retains the PascalScript internal-error category for explicit use and compatibility, although current runtime source has no automatic producer."
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, internal-error, compatibility]
---

```Delphi
ErInternalError = 3
```

### Example

```Delphi
function IsInternalVmFailure(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = ErInternalError;
end;
```

### Usage

`ErInternalError` represents a Velox script-engine consistency failure. The current Velox version does not normally produce this category automatically; use it only when an explicit custom error contract requires that exact value.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Internal error`. A manually supplied parameter remains available through `ExceptionParam` even though the formatter does not show it.

### Additional Technical Info
`ErInternalError` is member ordinal 3 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 24 is alphabetical navigation metadata and is not its enumeration value.

`ErInternalError` is ordinal 3 in the shared `TIFException`/`TPSError` taxonomy. It represents an internal virtual-machine consistency failure rather than invalid business data or a normal imported-function error.
Current Velox PascalScript runtime source declares and formats the member but contains no explicit `CMD_Err`, `CMD_Err2` or exception-translation producer for it. It remains reachable through [`RaiseException`](../../Functions/Exceptions/RaiseException.md), persisted compatibility with compiled code, or host code that supplies the enumeration value.

#### Behavior, recovery and quirks

- Absence of a current automatic producer is part of the contract; documentation must not invent a specific failing opcode or subsystem.
- Do not raise this category for script validation. Use [`erCustomError`](erCustomError.md) so support tooling can distinguish deliberate failures from VM-integrity signals.
- If observed without an explicit script raise, preserve the compiled script, product version, procedure/position and surrounding logs for engineering investigation.
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
