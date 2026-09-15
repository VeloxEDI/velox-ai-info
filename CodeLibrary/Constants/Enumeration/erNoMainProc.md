---
title: erNoMainProc
description: "Indicates that loaded PascalScript bytecode does not provide a valid executable main procedure."
sidebar_position: 31
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, main-procedure, bytecode]
---

```Delphi
erNoMainProc = 7
```

### Example

```Delphi
function IsMissingMainProcedure(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erNoMainProc;
end;
```

### Usage

`erNoMainProc` indicates that loaded Velox scripting bytecode does not provide a valid executable main procedure.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns the historical text `no Main Proc`.

### Additional Technical Info
`erNoMainProc` is member ordinal 7 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 31 is alphabetical navigation metadata and is not its enumeration value.

`erNoMainProc` is used at the compiled-script entry boundary. `LoadData` emits it when the header's main-procedure number is outside the loaded procedure table (unless the special `InvalidVal` value is used). `RunScript` emits it when the selected main-procedure record is external rather than an executable internal script procedure.
This is not the same as failing to look up a named exported procedure. [`erOutOfProcRange`](erOutOfProcRange.md) covers invalid procedure-number calls, while [`erCannotImport`](erCannotImport.md) covers unresolved external declarations.

#### Behavior, recovery and quirks

- When `FMainProc = InvalidVal`, current `RunScript` returns `False` without setting `erNoMainProc`. A library-like artifact can therefore lack a main body without producing this category; callers must inspect the Boolean execution result as well as exception state.
- The automatic producer does not include the stored index or procedure count, so retain the compiled artifact and load/run context.
- Correct the compile/execution mode; do not use this category as a general “function not found” error.
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
