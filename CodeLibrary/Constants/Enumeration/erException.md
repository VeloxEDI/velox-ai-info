---
title: erException
description: "Represents a caught Delphi host exception that has no more specific PascalScript runtime mapping."
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, host-exception, delphi]
---

```Delphi
erException = 20
```

### Example

```Delphi
function IsGeneralHostException(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erException;
end;
```

### Usage

`erException` represents a caught Velox host exception that has no more specific Velox scripting runtime mapping.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) returns `Exception: ` followed by `Param`. It does not apply the control-character filtering used by `erCannotImport`. An explicit `RaiseException(erException, Text)` supplies only a category and parameter, not a Velox exception object.

### Additional Technical Info
`erException` is member ordinal 20 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 22 is alphabetical navigation metadata and is not its enumeration value.

`erException` is the PascalScript runtime's fallback for a caught Delphi `Exception` object that was not already classified as `EPSException`, `EDivByZero`, `EZeroDivide` or another `EMathError`. Imported functions, conversions and external procedure dispatch can therefore map many unrelated host failures to this single category.
For a Delphi `Exception`, the runtime saves `Exception.Message` as `ExceptionParam` and retains the acquired exception object. If an acquired raised object is not an `Exception` descendant, the category is still used but the saved parameter is empty. At the outer host boundary, `RaiseCurrentException` can re-raise the retained native object; script code cannot inspect its Delphi class.

#### Behavior, recovery and quirks

- Different failures can share this category. Diagnose with the parameter, procedure/position, surrounding operation and Velox logs rather than branching on `erException` alone.
- The saved Velox message can contain external-system or data values. Review it before exposing it outside the approved support/logging boundary.
- Host-side retention/re-raise does not make the exception recoverable in script and does not roll back work completed by the failed imported call.
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
- [Embarcadero `System.SysUtils.Exception`](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.SysUtils.Exception) - Delphi base class whose message is captured by this fallback.
- [Free Pascal `Exception`](https://www.freepascal.org/docs-html/rtl/sysutils/exception.html) - compatible exception-class context; Velox uses the Delphi/PascalScript implementation.

<small>Created 2026-07-15</small>
