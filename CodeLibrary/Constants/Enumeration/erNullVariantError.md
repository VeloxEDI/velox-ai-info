---
title: erNullVariantError
description: "Retains the PascalScript Null-Variant error category, although current runtime source has no explicit automatic producer."
sidebar_position: 33
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, variant, 'null']
---

```Delphi
erNullVariantError = 22
```

### Example

```Delphi
function IsNullVariantCategory(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erNullVariantError;
end;
```

### Usage

`erNullVariantError` retains the Velox scripting Null-Variant error category, although current runtime source has no explicit automatic producer.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Null variant error`. It remains possible to supply the member explicitly through `RaiseException`, but that does not reproduce a Velox Variant failure.

### Additional Technical Info
`erNullVariantError` is member ordinal 22 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 33 is alphabetical navigation metadata and is not its enumeration value.

`erNullVariantError` is ordinal 22 in `TIFException`/`TPSError` and names an invalid operation involving a `Null` Variant. The current Velox PascalScript runtime declares and formats it but contains no explicit producer that assigns this category.
A Delphi `EVariantError` raised inside a guarded imported/runtime operation normally reaches the generic [`erException`](erException.md) branch unless a more specific PascalScript path handles it. Variant operations outside those guards can propagate according to their surrounding host boundary. Therefore this retained member must not be documented as the guaranteed result of every `Null` operation.

#### Behavior, recovery and quirks

- Use `VarIsNull`, explicit Null propagation rules and the called API's contract instead of relying on an exception category.
- Absence of an automatic producer is intentional documentation of current source, not proof that the value can never appear from host code or compatibility bytecode.
- Do not persist the ordinal as a durable error protocol.
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
- [Embarcadero `EVariantError`](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.SysUtils.EVariantError) - Delphi Variant exception background; current PascalScript source does not map it specifically to this member.
- [Free Pascal `EVariantError`](https://www.freepascal.org/docs-html/rtl/sysutils/evarianterror.html) - compatibility context only.

<small>Created 2026-07-15</small>
