---
title: varUnknown
description: Identifies a reference-counted IUnknown or IInterface Variant without guaranteeing late-bound Automation dispatch.
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, iunknown, interface]
---

```Delphi
varUnknown = 13
```

### Example

```Delphi
function IsUnknownInterface(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varUnknown;
end;
```

### Usage

`varUnknown` identifies a reference-counted IUnknown or IInterface Variant without guaranteeing late-bound Automation dispatch.

### Additional Technical Info
`varUnknown` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$000D` for an `IUnknown`/Delphi `IInterface` pointer. The Variant normally owns a reference-counted interface but does not promise `IDispatch` late binding.

Use [`varDispatch`](varDispatch.md) for an Automation-dispatch representation. An `IUnknown` may support `IDispatch` or another requested interface through `QueryInterface`, but that capability must be checked; the type tag alone cannot establish it.

**Ownership and safety**

- Copying/assigning an owned value normally increments the interface reference count; clearing releases it and may destroy the underlying object.
- A [`varByRef`](varByRef.md) combination borrows an external interface slot and depends on its lifetime.
- A nil pointer can still have an interface tag. Handle nil and unsupported-interface outcomes.
- Interface calls can execute native/external code with arbitrary I/O, latency, re-entrancy and exceptions. Respect COM apartment/thread rules and never assume thread safety from the tag.

[`VarType`](../../Functions/Variant/VarType.md) reads only the type field and does not call the interface. Converting to a dispatch or concrete interface may query the object and fail.

The example is source-reviewed only; no interface reference was acquired or released.

**External references**

- [Embarcadero `IUnknown`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.IUnknown)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varUnknown`](https://www.freepascal.org/docs-html/rtl/system/varunknown.html)

<small>Created 2026-07-15</small>
