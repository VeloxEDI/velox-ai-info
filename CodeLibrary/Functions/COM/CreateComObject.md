---
title: "CreateComObject"
description: "Creates a Windows COM object from a class identifier and returns its IUnknown interface."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - com
  - iunknown
  - clsid
---

```Delphi
function CreateComObject(const ClassID: TGUID): IUnknown;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  ClassID: TGUID;
  ComObject: IUnknown;
begin
  // Windows Scripting Runtime's in-memory Dictionary class.
  ClassID := StringToGUID('{EE09B103-97E0-11CF-978F-00A02463E06F}');
  ComObject := CreateComObject(ClassID);
  Value := Assigned(ComObject);
end;
```

### Usage

`CreateComObject` creates a Windows COM object from a class identifier and returns its IUnknown interface.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ClassID` | `TGUID`, `const` | CLSID of the COM class to activate. Obtain it from the component vendor or convert its documented GUID text with [`StringToGUID`](../Conversion/StringToGUID.md). It is not a ProgID. |

**Returns**

A reference-counted `IUnknown` for the newly activated object. The returned base interface does not by itself provide named late-bound methods or properties. The caller needs a registered interface contract or a successful query for another interface, such as `IDispatch`, to use class-specific capabilities.

**Behaviour**

Activation may load vendor code into the Velox process or launch/connect to a local executable server. The helper does not initialise COM, choose an apartment, configure COM security, supply licensing data or pass activation options. The calling thread and host environment must already meet the server's COM requirements.

The interface participates in COM reference counting. Release it by allowing the variable to leave scope or assigning `nil`; do not call `Free`.

**Errors**

configuration, activation, security, dependency, apartment and interface failures surface as `EOleSysError`-derived script exceptions. The Velox function catches an `EOleSysError` raised during activation and rethrows it with `ClassID: <GUID>` appended while preserving the error code. The helper does not retry, log or translate the failure into a Boolean result.

**Usage notes**

Use `CreateOleObject` when a ProgID and late-bound Automation interface are the intended contract. A CLSID should come from vendor documentation or controlled configuration; guessing or copying a CLSID from another environment makes deployment fragile.

### Additional Technical Info
`CreateComObject` activates the COM class identified by a CLSID and returns its base `IUnknown` interface. Use it when the integration contract supplies a class identifier and the caller does not require an Automation-ready `IDispatch` return value.

The example is source-reviewed and is not executed by the documentation workflow. It requires the standard Windows Scripting Runtime registration in the bitness visible to the Velox process.

**Implementation**

Velox exposes the modified PascalScript COM declaration directly to Delphi's `System.Win.ComObj.CreateComObject`. The current Delphi implementation calls `CoCreateInstance` with:

- no outer unknown, so aggregation is not requested;
- `CLSCTX_INPROC_SERVER or CLSCTX_LOCAL_SERVER`, allowing an in-process DLL or a local out-of-process executable server; and
- `IUnknown` as the requested interface.

It does not request a remote server. On 32-bit builds the Delphi wrapper temporarily adjusts the x87 floating-point control word around activation and then restores the default control word.

**Edge cases and quirks**

- The CLSID must be registered in the registry view visible to the current process. Registration, binary availability and dependencies can differ between Win32 and Win64.
- A class registered only as a remote server is outside the contexts requested by this wrapper.
- Successful activation proves only that the class and `IUnknown` are available. It does not prove that an Automation interface, a vendor-specific interface or a later operation will succeed.
- A server can enforce identity, desktop, profile, licence, threading or elevation requirements that differ between Velox Designer, Velox Service and Velox API Service.
- The x86 floating-point-control handling is an upstream Delphi implementation detail. Scripts cannot configure or rely on it as a general COM policy.

**Side effects**

The call can load a DLL, start an executable, allocate external resources and run arbitrary server initialisation. Those actions are defined by the COM server, not by Velox.

**Performance and concurrency**

Activation is synchronous and may cross a process boundary. There is no timeout or cancellation. Cost and thread safety depend on the server. Keep interface use within its COM apartment unless the interface is marshalled correctly between threads.

**Related entries**

- [`COM`](../COM.md) describes environment, lifetime and service-hosting constraints shared by this group.
- [`CreateOleObject`](CreateOleObject.md) activates by ProgID and requests `IDispatch`.
- [`GetActiveOleObject`](GetActiveOleObject.md) attaches to a running registered object instead of creating one.

**External references**

- [Embarcadero `System.Win.ComObj.CreateComObject`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Win.ComObj.CreateComObject)
- [Free Pascal: Interfaces and COM](https://www.freepascal.org/docs-html/ref/refse49.html)
- [Microsoft: `CoCreateInstance`](https://learn.microsoft.com/en-us/windows/win32/api/combaseapi/nf-combaseapi-cocreateinstance)
- [Microsoft: `CoInitializeEx`](https://learn.microsoft.com/en-us/windows/win32/api/combaseapi/nf-combaseapi-coinitializeex)

<small>Created 2026-07-15</small>
