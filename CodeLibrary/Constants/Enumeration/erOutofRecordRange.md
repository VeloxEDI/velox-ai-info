---
title: erOutofRecordRange
description: "Indicates a PascalScript set-membership ordinal outside the set's represented bit range despite the member's legacy record-oriented name."
sidebar_position: 38
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, set, range]
---

```Delphi
erOutofRecordRange = 18
```

### Example

```Delphi
function IsSetMembershipRangeFailure(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erOutofRecordRange;
end;
```

### Usage

`erOutofRecordRange` indicates a Velox scripting set-membership ordinal outside the set's represented bit range despite the member's legacy record-oriented name.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Out of Record Fields Range`.

### Additional Technical Info
`erOutofRecordRange` is member ordinal 18 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 38 is alphabetical navigation metadata and is not its enumeration value.

`erOutofRecordRange` is ordinal 18 and retains PascalScript's historical spelling/capitalisation. In the current runtime its explicit producer is the `in` operator for sets: after converting the candidate member to an ordinal, the VM raises this category when that ordinal is greater than or equal to the set type's declared bit size.
Current source does not use this member for dataset rows or a record cursor. The resource text still says `Out of Record Fields Range`, so both the identifier and formatted message are misleading for the executable set-membership path.

#### Behavior, recovery and quirks

- The check occurs before reading the set bit. It protects the represented set range; it does not mean the member is merely absent. A valid in-range absent member returns `False` normally.
- Use a member of the set's declared element type/range. Lost subrange metadata or an integer cast can make an otherwise plausible ordinal invalid.
- Do not interpret this as a Velox record-number or field-count error.
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
