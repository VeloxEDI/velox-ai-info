---
title: ErMathError
description: "Represents a caught Delphi floating-point math exception other than division by zero."
sidebar_position: 29
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, math, floating-point]
---

```Delphi
ErMathError = 16
```

### Example

```Delphi
function IsMappedMathFailure(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = ErMathError;
end;
```

### Usage

`ErMathError` represents a caught Velox floating-point math exception other than division by zero.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Math error`. An explicit `RaiseException(ErMathError, ...)` has the same category but does not construct or retain a Velox `EMathError` object.

### Additional Technical Info
`ErMathError` is member ordinal 16 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 29 is alphabetical navigation metadata and is not its enumeration value.

`ErMathError` is produced when PascalScript catches a Delphi `EMathError` after first excluding `EZeroDivide`. Overflow, underflow, invalid floating operations and other subclasses that reach these guarded runtime paths therefore collapse to one VM category.
The caught native message is stored in `ExceptionParam`, and the native exception object may be retained for host-side re-raise. Script code receives only this category; it cannot determine the exact Delphi subclass from the constant.

#### Behavior, recovery and quirks

- Floating-point control-word/masking settings and the operation determine whether Velox raises an exception, returns an IEEE special value or follows another path. This category documents mapping after a caught `EMathError`.
- Validate predictable domains before calling math functions when local recovery is possible.
- The fixed formatter hides the saved Velox message; inspect `ExceptionParam` and the failing operation for diagnosis.
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
- [Embarcadero `EMathError`](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.SysUtils.EMathError) - Delphi base class mapped after divide-by-zero subclasses are excluded.
- [Free Pascal `EMathError`](https://www.freepascal.org/docs-html/rtl/sysutils/ematherror.html) - compatible class context, not evidence for Velox's translation.

<small>Created 2026-07-15</small>
