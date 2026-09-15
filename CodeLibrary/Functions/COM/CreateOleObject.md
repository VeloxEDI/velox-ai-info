---
title: "CreateOleObject"
description: "Creates a registered Windows Automation object by ProgID and returns its IDispatch interface."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - com
  - automation
  - idispatch
  - progid
---

```Delphi
function CreateOleObject(const ClassName: string): IDispatch;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Dictionary: Variant;
begin
  Dictionary := CreateOleObject('Scripting.Dictionary');
  try
    Dictionary.Add('Region', 'NZ');
    Value := Dictionary.Item('Region');
  finally
    Dictionary := Unassigned;
  end;
end;
```

### Usage

`CreateOleObject` creates a registered Windows Automation object by ProgID and returns its IDispatch interface.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ClassName` | `string`, `const` | Registered programmatic identifier (ProgID) to resolve, for example `Vendor.Component`. Supply a ProgID, not GUID text. |

**Returns**

A reference-counted `IDispatch` for the newly activated object. Assigning it to a `Variant` enables normal late-bound member syntax in Velox scripts. The exact members, argument rules and result types come from the COM server's Automation contract.

**Behaviour**

The function creates or activates an object according to the COM class configuration; it does not look only for an already-running instance. Activation may load an in-process server or start a local executable server. The calling thread must already have compatible COM initialisation.

Late-bound method and property calls are synchronous. Velox scripting resolves and invokes them ; Velox does not add a timeout, retry, cancellation or server-specific lifecycle policy.

**Errors**

An unknown ProgID, missing or mismatched configuration, activation/security failure, incompatible apartment or lack of `IDispatch` raises a COM exception. The Velox function catches `EOleSysError` during activation and rethrows it with `ProgID: "<ClassName>"` appended while preserving the error code. Later member calls raise separately .

**Usage notes**

Assign `Unassigned` or `nil` as appropriate, or leave scope, to release script-held references. Do not call `Free`. For unattended integrations, prefer a component explicitly supported for server-side Automation and test it using the production bitness, service identity and component version.

### Additional Technical Info
`CreateOleObject` resolves a registered ProgID to a CLSID, activates the corresponding local COM class and returns its `IDispatch` Automation interface. It is the usual entry point for late-bound COM calls when the vendor documents a ProgID such as `Vendor.Application`.

The example is source-reviewed and is not executed by the documentation workflow. It uses the local Windows Scripting Runtime dictionary rather than an Office application or external service, but still depends on matching COM registration in the deployed environment.

**Implementation**

Velox registers the PascalScript declaration directly to Delphi's `System.Win.ComObj.CreateOleObject`. The Delphi wrapper:

1. resolves `ClassName` with `ProgIDToClassID`, which calls the Windows `CLSIDFromProgID` API;
2. calls `CoCreateInstance` without aggregation and with `CLSCTX_INPROC_SERVER or CLSCTX_LOCAL_SERVER`;
3. requests `IDispatch`; and
4. returns the resulting interface to the script runtime.

On 32-bit builds the wrapper temporarily adjusts the x87 floating-point control word during activation and restores the default afterwards.

**Edge cases and quirks**

- ProgID resolution and class activation use the registration view visible to the current process, so Win32 and Win64 results can differ.
- An installed desktop application may still be unsupported under a service account because its profile, interactive desktop, permissions or licensing context is missing.
- The Embarcadero page describes the argument as a class-name string representation, but current Delphi source resolves it as a ProgID. The implementation is authoritative for this Velox exposure.
- The wrapper requests only in-process or local-server activation, not a remote machine.
- Current Velox source comments say the classic native invocation bridge must be off on x64 and mention a historical `CreateOleObject` dependency, while current Win32 and Win64 project configurations both define it. Treat 64-bit late-bound Automation as deployment-specific until it has been validated in the same product component and server combination.
- Free Pascal's documentation reports limitations in its own `Variant` dispatch implementation. That is compatibility context only and is not evidence of the Delphi/PascalScript behaviour used by Velox.

**Side effects**

The COM server may start a process, show user interface, read or write files, access a network, create locks or retain external resources. `CreateOleObject` does not constrain or roll back those effects.

**Performance and concurrency**

ProgID lookup and activation are synchronous and can cross process boundaries. There is no timeout. Server objects and interfaces may be apartment-bound; do not share the returned interface between Velox threads without the server's documented support and correct COM marshalling.

**Related entries**

- [`COM`](../COM.md) describes shared hosting, registration and lifetime constraints.
- [`CreateComObject`](CreateComObject.md) activates from a CLSID and requests only `IUnknown`.
- [`GetActiveOleObject`](GetActiveOleObject.md) retrieves an object already registered as running.
- [`IdispatchInvoke`](IdispatchInvoke.md) is the low-level late-bound invocation helper.

**External references**

- [Embarcadero `System.Win.ComObj.CreateOleObject`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Win.ComObj.CreateOleObject)
- [Free Pascal: Variants and interfaces](https://www.freepascal.org/docs-html/ref/refsu20.html)
- [Microsoft: `CLSIDFromProgID`](https://learn.microsoft.com/en-us/windows/win32/api/combaseapi/nf-combaseapi-clsidfromprogid)
- [Microsoft: `CoCreateInstance`](https://learn.microsoft.com/en-us/windows/win32/api/combaseapi/nf-combaseapi-cocreateinstance)

<small>Created 2026-07-15</small>
