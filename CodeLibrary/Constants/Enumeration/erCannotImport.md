---
title: erCannotImport
description: "Indicates that the PascalScript loader could not bind a compiled external procedure to a registered runtime implementation."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, import, loader]
---

```Delphi
erCannotImport = 1
```

### Example

```Delphi
function IsImportBindingFailure(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erCannotImport;
end;
```

### Usage

`erCannotImport` indicates that the Velox scripting loader could not bind a compiled external procedure to an available Velox operation.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) returns `Cannot Import ` followed by the safe prefix of `Param`. Velox scripting's `SafeStr` stops immediately before the first control character from `#0` through `#31`; a line break, tab or NUL therefore hides the remainder of the diagnostic. `ExceptionParam` still represents the saved parameter rather than the formatted/truncated result.

### Additional Technical Info
`erCannotImport` is member ordinal 1 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 18 is alphabetical navigation metadata and is not its enumeration value.

`erCannotImport` identifies failure to resolve an external procedure recorded in compiled PascalScript bytecode. “Import” here means binding the bytecode declaration to a function already registered in the current script executor; it does not perform a network request, load a Velox module, or search the operating system dynamically.
The loader emits this category while reading an external procedure record. It first tries the procedure name; when the compiled record contains no name, it reports the declaration text instead. A failed binding stops `LoadData`, releases the partially loaded type/procedure/variable structures, and leaves the error available to the owning execution boundary.

#### Behavior, recovery and quirks

- The error usually points to a compiler/Velox availability mismatch: a function, method or declaration was available when the script was compiled but is absent or differently declared in the executor that loads it.
- The category does not identify which plugin or unit should provide the symbol. Preserve the name/declaration and the Velox/product version when diagnosing it.
- Do not catch this error and continue using the same partially loaded script. Correct the configuration or recompile against the current Code Library.
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
