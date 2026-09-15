---
title: erCustomError
description: "Represents deliberate script-defined failures and several PascalScript errors preserved as direct custom message text."
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, custom-error, validation]
---

```Delphi
erCustomError = 24
```

### Example

```Delphi
procedure RequireFictionalValue(const Candidate: string);
begin
  if Candidate = '' then
    RaiseException(erCustomError, 'Fictional value is required');
end;
```

### Usage

`erCustomError` represents deliberate script-defined failures and several Velox scripting errors preserved as direct custom message text.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) returns `Param` verbatim after Velox scripting's string conversion. It adds no label, punctuation or fallback; an empty parameter formats as an empty string. When `RaiseException` is used, characters outside the active Windows code page can change.

### Additional Technical Info
`erCustomError` is member ordinal 24 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 20 is alphabetical navigation metadata and is not its enumeration value.

`erCustomError` is the normal category for a deliberate script-defined validation or business-rule failure. It is also used internally when PascalScript catches a nested `EPSException`, detects selected string-index failures, or reports object/interface cast failures through a prepared resource message.
When a nested `EPSException` is translated, the runtime retains that exception's procedure number and bytecode position but stores its display message as the custom parameter. The script-visible category is therefore not a Delphi exception class and does not preserve a distinct subclass identity.

#### Behavior, recovery and quirks

- Because the parameter becomes the entire display message, keep it actionable and safe for logs or user-visible channels. Do not include credentials, tokens or unnecessary customer data.
- Use this member for failures your script intentionally owns. Do not use VM-corruption categories merely to make a message appear more severe.
- Raising it transfers control through `finally`/`except` frames and can fail the current event or Flow action. It does not undo side effects completed before the raise.
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
