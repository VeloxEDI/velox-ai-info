---
title: erInvalidHeader
description: "Indicates that compiled PascalScript data has a missing, invalid or unsupported runtime header."
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, bytecode, header]
---

```Delphi
erInvalidHeader = 4
```

### Example

```Delphi
function IsCompiledScriptHeaderFailure(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erInvalidHeader;
end;
```

### Usage

`erInvalidHeader` indicates that compiled Velox scripting data has a missing, invalid or unsupported runtime header.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Invalid Header`. The producer supplies no reason code, observed build number or expected range.

### Additional Technical Info
`erInvalidHeader` is member ordinal 4 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 25 is alphabetical navigation metadata and is not its enumeration value.

`erInvalidHeader` is emitted before the executor loads compiled types, procedures and variables. The current loader uses it for three distinct checks: the input is shorter than `TPSHeader`, the header magic does not equal `PSValidHeader`, or the stored PascalScript build number lies outside `PSLowBuildSupport..PSCurrentBuildNo`.
The category therefore covers both damaged/non-PascalScript data and bytecode produced by an unsupported compiler/runtime generation. Loading stops before execution; the caller must provide compatible compiled script data or recompile from source.

#### Behavior, recovery and quirks

- Although [`erVersionError`](erVersionError.md) exists, current build-number mismatches use `erInvalidHeader`; the version-specific member has no explicit producer.
- This concerns the binary Velox scripting container, not a source-code include, EDI document header, HTTP header or dataset field.
- Do not retry the same bytes as though the error were transient. Confirm source/runtime provenance and regenerate the compiled script.
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
