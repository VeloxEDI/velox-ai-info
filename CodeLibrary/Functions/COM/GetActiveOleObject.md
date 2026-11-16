---
title: "GetActiveOleObject"
description: "Retrieves a running Windows Automation object from the Running Object Table by ProgID."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords:
  - velox
  - scripting
  - com
  - automation
  - running-object-table
---

```Delphi
function GetActiveOleObject(const ClassName: string): IDispatch;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Existing: IDispatch;
begin
  try
    // Replace this fictional ProgID with one documented by the vendor.
    Existing := GetActiveOleObject('Fictional.Application');
    Value := Assigned(Existing);
  except
    LogError('Operation failed: ' + ExceptionToString(ExceptionType, ExceptionParam));
    Exit;
  end;
end;
```

Follow [mandatory script failure handling](../../../instructions/scripts/failure-handling.md): a caught failure is not a successful Boolean/message result; log it as an error and stop.

### Usage

`GetActiveOleObject` retrieves a running Windows Automation object from the Running Object Table by ProgID.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ClassName` | `string`, `const` | Registered ProgID of the running Automation class. It is resolved through `CLSIDFromProgID`; it is not GUID text or a process name. |

**Returns**

A reference-counted `IDispatch` for the active object. The function returns one object selected by the COM Running Object Table (ROT) rules; it does not enumerate all running instances or choose a document, window or process by title.

**Behaviour**

The object must be running and visible in the calling context's ROT at the instant of the call. Some COM servers never register active objects, register only selected instances or documents, or expose per-session or per-user entries. A process appearing in Task Manager is therefore not sufficient evidence that this function can retrieve it.

The calling thread must already have compatible COM initialisation. The returned interface follows normal COM reference counting and apartment rules.

**Errors**

An unknown ProgID, absent ROT entry, incompatible session or identity, failed lookup, or failed `IDispatch` query raises a COM exception. Unlike the other activation functions, this function does not add the ProgID to the outer error message. Catch an exception only when absence is an expected branch; do not suppress diagnostics that indicate a deployment or security fault.

**Usage notes**

Use `CreateOleObject` when starting or activating a new object is acceptable. Use this function only when attaching to an existing instance is an explicit part of the vendor's Automation contract.

### Additional Technical Info
`GetActiveOleObject` retrieves an Automation object that is already running and has registered itself in the Windows Running Object Table (ROT). It resolves a ProgID, obtains the registered object's `IUnknown`, then requests `IDispatch`.

The source-reviewed example deliberately uses a fictional ProgID and is not executed by the documentation workflow. It demonstrates the required failure handling without starting or attaching to a real desktop application.

**Implementation**

Velox registers the PascalScript declaration directly to Delphi's `System.Win.ComObj.GetActiveOleObject`. The Delphi implementation:

1. resolves the ProgID to a CLSID with `ProgIDToClassID`/`CLSIDFromProgID`;
2. calls the Windows `GetActiveObject` API for that CLSID;
3. checks the returned `HRESULT` through `OleCheck`; and
4. calls `IUnknown.QueryInterface` for `IDispatch`, again checking the result.

No activation call is made. The helper neither starts the COM server nor waits for an object to register itself.

**Edge cases and quirks**

- Service and desktop sessions may have different Running Object Tables. A Designer test under an interactive user does not prove that the same call works in Velox Service.
- Registration and ProgID resolution remain process-bitness-sensitive even though the target is already running.
- A running object can be found but still fail because it does not expose `IDispatch`.
- There is a race between lookup and later use: the external application can close or reject calls after the interface is returned.
- The function cannot select between multiple active instances and provides no creation fallback.

**Side effects**

Lookup itself does not create an object, but obtaining and later using the interface can affect the external server's reference count and lifecycle. Subsequent Automation calls can have any side effects documented by that server.

**Performance and concurrency**

Lookup and interface negotiation are synchronous and have no timeout or retry. Use the returned interface only in a compatible apartment, and do not share it between threads without correct COM marshalling and server support.

**Related entries**

- [`COM`](../COM.md) describes shared environment and lifetime constraints.
- [`CreateOleObject`](CreateOleObject.md) activates an Automation object instead of requiring an ROT entry.
- [`OleCheck`](OleCheck.md) documents the result-code check used internally.

**External references**

- [Embarcadero `System.Win.ComObj.GetActiveOleObject`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Win.ComObj.GetActiveOleObject)
- [Free Pascal: Interfaces and COM](https://www.freepascal.org/docs-html/ref/refse49.html)
- [Microsoft: `GetActiveObject`](https://learn.microsoft.com/en-us/windows/win32/api/oleauto/nf-oleauto-getactiveobject)
- [Microsoft: `CLSIDFromProgID`](https://learn.microsoft.com/en-us/windows/win32/api/combaseapi/nf-combaseapi-clsidfromprogid)

<small>Created 2026-07-15</small>
