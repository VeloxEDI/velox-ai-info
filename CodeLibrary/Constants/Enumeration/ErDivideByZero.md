---
title: ErDivideByZero
description: "Represents both integer and floating-point divide-by-zero exceptions translated by the PascalScript runtime."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, divide-by-zero, arithmetic]
---

```Delphi
ErDivideByZero = 15
```

### Example

```Delphi
function IsDivisionByZero(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = ErDivideByZero;
end;
```

### Usage

`ErDivideByZero` represents both integer and floating-point divide-by-zero exceptions translated by the Velox scripting runtime.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns the Velox scripting resource text `divide by Zero`, including its historical capitalisation. An explicit `RaiseException(ErDivideByZero, ...)` creates the same category but no Velox `EDivByZero`/`EZeroDivide` object.

### Additional Technical Info
`ErDivideByZero` is member ordinal 15 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 21 is alphabetical navigation metadata and is not its enumeration value.

`ErDivideByZero` is the single VM category used when PascalScript catches either Delphi `EDivByZero` (integer division) or `EZeroDivide` (floating-point division). The runtime tests both exception classes before its broader `EMathError` and generic `Exception` branches, so the two native classes deliberately collapse to this one script-visible value.
The caught native exception message is saved in `ExceptionParam`, and the native exception object can be retained for host-side re-raise. Script code sees only the `TIFException` category and parameter; it cannot recover the original Delphi class from this constant.

#### Behavior, recovery and quirks

- Floating-point exception masking and the operation used can affect whether Velox raises `EZeroDivide` or produces an IEEE value. The constant documents translation after an exception occurs, not a guarantee that every floating zero divisor raises.
- Do not use exception handling as normal denominator validation. Check predictable zero values before the operation when local recovery is possible.
- Any mutations completed before the failing calculation remain in place unless the surrounding API supplies its own transaction.
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
- [Embarcadero `EDivByZero`](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.SysUtils.EDivByZero) - integer divide-by-zero class translated by the runtime.
- [Embarcadero `EZeroDivide`](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.SysUtils.EZeroDivide) - floating divide-by-zero class translated to the same category.
- [Free Pascal `EDivByZero`](https://www.freepascal.org/docs-html/rtl/sysutils/edivbyzero.html) and [`EZeroDivide`](https://www.freepascal.org/docs-html/rtl/sysutils/ezerodivide.html) - compatible exception-class context, not evidence for Velox's mapping.

<small>Created 2026-07-15</small>
