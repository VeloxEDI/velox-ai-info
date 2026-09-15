---
title: ftIDispatch
description: Identifies an Automation IDispatch interface reference with COM lifetime, apartment and invocation constraints.
sidebar_position: 108
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, idispatch, com, automation, interface]
---

```Delphi
ftIDispatch = 34
```

### Example

```Delphi
function IsAutomationReference(Field: TField): Boolean;
begin
  Result := Field.DataType = ftIDispatch;
end;
```

### Usage

`ftIDispatch` identifies an Automation IDispatch interface reference with COM lifetime, apartment and invocation constraints.

### Additional Technical Info
`ftIDispatch` is ordinal 34 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TIDispatchField`, an `TInterfaceField` descendant holding an Automation `IDispatch` reference.

This is a live COM interface, not serialized business data. Reference counting governs lifetime, while COM apartment/threading rules govern where it can be invoked. The enum does not prove that a method/property exists or that late-bound calls are safe. Validate the expected automation contract and release references promptly.

Do not retain the reference beyond its dataset/host context, marshal it across threads without COM support, or invoke untrusted automation objects. Null/nil remains distinct from an object whose method returns Empty or Null.

The example only inspects metadata and was source-reviewed; no COM creation/invocation, interface, dataset, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType), [`TIDispatchField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TIDispatchField) and [`IDispatch`](https://docwiki.embarcadero.com/Libraries/en/System.IDispatch).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; COM behavior is platform/runtime specific.

<small>Created 2026-07-15</small>
