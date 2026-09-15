---
title: erVersionError
description: "Retains the PascalScript version-error category even though current unsupported bytecode builds are reported as erInvalidHeader."
sidebar_position: 42
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, version, compatibility]
---

```Delphi
erVersionError = 14
```

### Example

```Delphi
function IsLegacyVersionCategory(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erVersionError;
end;
```

### Usage

`erVersionError` retains the Velox scripting version-error category even though current unsupported bytecode builds are reported as erInvalidHeader.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Version error`. A host or script can still supply the value explicitly, but that does not prove the loader performed a version comparison.

### Additional Technical Info
`erVersionError` is member ordinal 14 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 42 is alphabetical navigation metadata and is not its enumeration value.

`erVersionError` is ordinal 14 in the shared runtime enumeration and preserves an explicit version-incompatibility category for API/bytecode compatibility. Current Velox PascalScript runtime source declares and formats it but has no explicit automatic producer.
The active `LoadData` build-range check emits [`erInvalidHeader`](erInvalidHeader.md) when `PSBuildNo` is newer than `PSCurrentBuildNo` or older than `PSLowBuildSupport`. Therefore current unsupported compiled scripts should normally be diagnosed through `erInvalidHeader`, not this retained member.

#### Behavior, recovery and quirks

- Do not build retry or migration logic that waits only for `erVersionError`; inspect `erInvalidHeader` and the compiler/runtime provenance as well.
- Absence of a producer is current-source behavior and could change with a future Velox scripting update, which is why names rather than ordinals should be persisted.
- Recompile source using the target Velox scripting toolchain instead of editing binary header values.
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
