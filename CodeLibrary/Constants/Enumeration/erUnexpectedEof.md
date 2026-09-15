---
title: erUnexpectedEof
description: "Indicates that compiled PascalScript data ended before a required type, procedure or variable structure was complete."
sidebar_position: 41
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, bytecode, truncated-data]
---

```Delphi
erUnexpectedEof = 13
```

### Example

```Delphi
function IsTruncatedCompiledScript(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erUnexpectedEof;
end;
```

### Usage

`erUnexpectedEof` indicates that compiled Velox scripting data ended before a required type, procedure or variable structure was complete.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Unexpected End Of File`. The producer does not save the expected length, current offset or structure name.

### Additional Technical Info
`erUnexpectedEof` is member ordinal 13 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 41 is alphabetical navigation metadata and is not its enumeration value.

`erUnexpectedEof` is emitted repeatedly by `LoadData` when the compiled bytecode container ends while the runtime is reading a type record, class/procedure metadata, set/array/record detail, procedure body/export information, variable record or attribute payload.
It concerns PascalScript's compiled binary container. It does not describe reaching the end of a source text file, CSV/EDI document, dataset, stream consumed by user code or network response.

#### Behavior, recovery and quirks

- Some malformed lengths are classified as `ErOutOfRange`, `erInvalidType` or `erInvalidHeader` instead. The loader taxonomy is based on the check that failed, not a complete corruption diagnosis.
- Loading returns `False` and clears partially constructed runtime tables; do not execute or reuse the incomplete artifact.
- Recompile or restore the artifact from a trusted source. Repeatedly reading the same truncated data cannot succeed.
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
