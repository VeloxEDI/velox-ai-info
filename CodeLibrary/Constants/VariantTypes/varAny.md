---
title: varAny
description: Identifies Delphi's host-managed CORBA Any Variant representation, which Velox can inspect but scripts should not synthesize or cast to.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, any, corba]
---

```Delphi
varAny = 257
```

### Example

```Delphi
function IsHostAny(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varAny;
end;
```

### Usage

`varAny` identifies Velox-provided CORBA Any Variant representation, which Velox can inspect but scripts should not synthesize or cast to.

### Additional Technical Info
`varAny` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0101` for Delphi's legacy CORBA Any representation. It is a Pascal-specific managed type and is explicitly not OLE Automation compatible.

Velox registers the numeric constant because it imports Delphi's standard Variant codes. That registration does not install a public constructor or make `varAny` a general-purpose script container. A real value must come from host code that also supplies Delphi's `ClearAnyProc`, `ChangeAnyProc` and `RefAnyProc` callbacks. The Variant engine calls those callbacks when it clears, converts or copies the payload.

**Use and boundaries**

- Use the constant to classify a host-supplied Variant. [`VarType`](../../Functions/Variant/VarType.md) returns the raw code; mask first in case representation flags are present.
- Do not call [`VarAsType`](../../Functions/Variant/VarAsType.md) with `varAny`, construct the numeric tag manually or persist it as an interchange type. Missing or incompatible host callbacks can make copying, conversion or destruction unsafe.
- It is not the same as ordinary `Variant`, [`varVariant`](varVariant.md), a custom Variant type, JSON `any`, an interface or an Automation Variant.
- The code carries no schema information. Only the owning host integration can define the payload, lifetime and legal operations.

Inspection performs no I/O. Copying or destroying an actual `varAny` value can invoke host callbacks and change reference counts; concurrent use is safe only under that provider's contract.

The example is source-reviewed only; no Any value or callback was exercised.

**External references**

- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Embarcadero Variant support globals](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants)
- [Free Pascal `varAny`](https://www.freepascal.org/docs-html/rtl/system/varany.html)

<small>Created 2026-07-15</small>
