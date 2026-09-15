---
title: erInterfaceNotSupported
description: "Indicates that PascalScript could not obtain the requested interface while converting an object value."
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, exception, pascalscript, interface, conversion]
---

```Delphi
erInterfaceNotSupported = 23
```

### Example

```Delphi
function IsUnsupportedInterfaceConversion(const ErrorType: TIFException): Boolean;
begin
  Result := ErrorType = erInterfaceNotSupported;
end;
```

### Usage

`erInterfaceNotSupported` indicates that Velox scripting could not obtain the requested interface while converting an object value.

#### Formatting and exception state

[`ExceptionToString`](../../Functions/Exceptions/ExceptionToString.md) ignores `Param` and returns `Interface not supported`. The automatic producer does not save the requested GUID, interface name or object class, so those details must come from the failing declaration and call context.

### Additional Technical Info
`erInterfaceNotSupported` is member ordinal 23 of [`TIFException`](../../Types/Enumerations/TIFException.md), the script-visible declaration that is kept in exact ordinal alignment with PascalScript's runtime `TPSError`. Its sidebar position 23 is alphabetical navigation metadata and is not its enumeration value.

`erInterfaceNotSupported` is emitted by the runtime value-conversion path when an object is being assigned/converted to an interface and `TObject.GetInterface` cannot return the destination interface. It is about that specific object-to-interface conversion, not a general “feature unavailable” status.
The current condition combines a nil source object and a non-nil object whose interface table does not contain the requested GUID. Consequently, this path can report `erInterfaceNotSupported` for a nil object instead of [`erNullPointerException`](erNullPointerException.md). Other nil receiver paths use the latter category.

#### Behavior, recovery and quirks

- `GetInterface` returns `False` instead of raising when the interface is absent; Velox scripting converts that false result into VM error state.
- Do not interpret this category as an authorisation decision or as proof that every instance of the class lacks the interface. It describes the exact value conversion that failed.
- Check object creation, nilability, the declared interface GUID and the actual runtime class/import configuration.
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
- [Embarcadero `TObject.GetInterface`](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.TObject.GetInterface) - exact Delphi lookup used by the conversion.
- [Free Pascal `TObject.GetInterface`](https://www.freepascal.org/docs-html/rtl/system/tobject.getinterface.html) - compatible lookup context; it does not define PascalScript's error mapping.

<small>Created 2026-07-15</small>
