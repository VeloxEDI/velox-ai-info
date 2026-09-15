---
title: erOutOfMemory
description: "Retains the PascalScript out-of-memory category, although current runtime source has no dedicated EOutOfMemory mapping."
sidebar_position: 35
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, memory, compatibility]
---

```Delphi
erOutOfMemory = 19
```

### Example

```Delphi
function IsOutOfMemoryCategory(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erOutOfMemory;
end;
```

### Usage

`erOutOfMemory` retains the Velox scripting out-of-memory category, although current runtime source has no dedicated EOutOfMemory mapping.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Out Of Memory`.

### Additional Technical Info
`erOutOfMemory` is member ordinal 19 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 35 is alphabetical navigation metadata and is not its enumeration value.

`erOutOfMemory` is ordinal 19 in the runtime taxonomy and formats the intended VM out-of-memory condition. Current source contains no explicit `CMD_Err(erOutOfMemory)` producer and no `EOutOfMemory`-specific exception branch.
An allocation failure inside one of the runtime's guarded Delphi `Exception` blocks can therefore be classified as [`erException`](erException.md) with the native message/object. An allocation failure outside those guards may propagate directly to the host. Explicitly raising this member does not create memory pressure or a native `EOutOfMemory` object.

#### Behavior, recovery and quirks

- Low-memory recovery is not safely simulated by `RaiseException(erOutOfMemory, ...)`; real allocation failure can also prevent logging, formatting or cleanup allocations.
- Treat an observed genuine allocation failure as an execution/environment incident. Avoid retry loops that allocate more memory.
- The retained category remains valid for compatibility or host-supplied error state, but documentation must preserve the current producer gap.
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
- [Embarcadero `EOutOfMemory`](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.SysUtils.EOutOfMemory) - Delphi allocation-failure class; current PascalScript source does not map it specifically.
- [Free Pascal `EOutOfMemory`](https://www.freepascal.org/docs-html/rtl/sysutils/eoutofmemory.html) - compatible class context only.

<small>Created 2026-07-15</small>
