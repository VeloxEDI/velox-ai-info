---
title: ftInterface
description: Identifies an IUnknown interface reference whose concrete contract, lifetime and thread safety are supplied by the host.
sidebar_position: 110
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, interface, iunknown, lifetime]
---

```Delphi
ftInterface = 33
```

### Example

```Delphi
function IsInterfaceReference(Field: TField): Boolean;
begin
  Result := Field.DataType = ftInterface;
end;
```

### Usage

`ftInterface` identifies an IUnknown interface reference whose contract, lifetime and thread safety are supplied by the host.

### Additional Technical Info
`ftInterface` is ordinal 33 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TInterfaceField`, which stores an `IUnknown` reference and exposes it through a Variant/interface value.

The member identifies storage mechanics, not a specific interface IID or callable API. Reference counting affects lifetime; the implementation controls thread affinity, reentrancy and mutation. Do not cast blindly, retain the reference beyond its owner, or pass it across threads without the interface's documented contract.

Nil is distinct from a valid interface returning Null/Empty. Use [`ftIDispatch`](ftIDispatch.md) only for Automation-compatible references.

The example only inspects metadata and was source-reviewed; no interface query/invocation, dataset, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TInterfaceField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TInterfaceField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference.

<small>Created 2026-07-15</small>
