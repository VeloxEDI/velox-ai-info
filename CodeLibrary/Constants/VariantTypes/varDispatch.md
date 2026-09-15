---
title: varDispatch
description: Identifies a reference-counted IDispatch Automation interface whose dynamic property or method access can execute external code.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, idispatch, automation]
---

```Delphi
varDispatch = 9
```

### Example

```Delphi
function IsAutomationObject(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varDispatch;
end;
```

### Usage

`varDispatch` identifies a reference-counted IDispatch Automation interface whose dynamic property or method access can execute external code.

### Additional Technical Info
`varDispatch` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0009` for an `IDispatch` Automation interface. The Variant normally owns a reference-counted interface pointer and can support late-bound method/property access.

The type code does not prove that the pointer is non-nil, that a requested member exists, that the server is trusted or that invocation is side-effect free. Automation access may cross process boundaries, display UI, perform network/file/database operations, block, mutate external state or raise dispatch/COM exceptions.

**Ownership and use**

- Assignment/copying normally adjusts the interface reference count; clearing releases it. A [`varByRef`](varByRef.md) form instead depends on external storage lifetime.
- [`varUnknown`](varUnknown.md) identifies an `IUnknown` without promising late-bound dispatch. Conversion/querying between the two can fail.
- A nil interface can still carry an interface type code. Test the operation you require and handle errors rather than relying only on the tag.
- Do not invoke members derived from untrusted configuration without allow-listing the object and member contract.

[`VarType`](../../Functions/Variant/VarType.md) reads only the tag and does not invoke the object. Mask the code when flags may be present. Actual late binding uses the current host's Automation support and threading/apartment rules; the Variant constant does not make a server thread-safe.

The example is source-reviewed only; no Automation object was invoked.

**External references**

- [Embarcadero `Variant`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variant)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varDispatch`](https://www.freepascal.org/docs-html/rtl/system/vardispatch.html)

<small>Created 2026-07-15</small>
