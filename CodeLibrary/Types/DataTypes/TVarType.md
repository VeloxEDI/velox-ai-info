---
title: TVarType
description: Stores the raw 16-bit Variant base code and representation flags returned by VarType.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, vartype, variant, tag, mask, flags]
---

```Delphi
TVarType = Word
```

### Example

```Delphi
procedure ReadVariantType(Value: Variant; var TypeCode: TVarType);
begin
  TypeCode := VarType(Value);
end;
```

### Usage

`TVarType` stores the raw 16-bit Variant base code and representation flags returned by VarType.

### Additional Technical Info
`TVarType` is an unsigned 16-bit [`Word`](Word.md) used for a Variant's physical type metadata. [`VarType`](../../Functions/Variant/VarType.md) returns the raw top-level `TVarData.VType` field without conversion, masking or dereferencing.

It is not a closed enumeration. The low 12 bits hold a built-in or custom base number; higher bits can describe representation:

```Delphi
Code := VarType(Value);
Base := Code and varTypeMask;
IsArray := (Code and varArray) <> 0;
IsByRef := (Code and varByRef) <> 0;
```

| Role | Registered members |
|---|---|
| Empty/missing | [`varEmpty`](../../Constants/VariantTypes/varEmpty.md), [`varNull`](../../Constants/VariantTypes/varNull.md) |
| Signed integers | [`varShortInt`](../../Constants/VariantTypes/varShortInt.md), [`varSmallInt`](../../Constants/VariantTypes/varSmallInt.md), [`varInteger`](../../Constants/VariantTypes/varInteger.md), [`varInt64`](../../Constants/VariantTypes/varInt64.md) |
| Unsigned integers | [`varByte`](../../Constants/VariantTypes/varByte.md), [`varWord`](../../Constants/VariantTypes/varWord.md), [`varLongWord`](../../Constants/VariantTypes/varLongWord.md) |
| Floating/fixed/date | [`varSingle`](../../Constants/VariantTypes/varSingle.md), [`varDouble`](../../Constants/VariantTypes/varDouble.md), [`varCurrency`](../../Constants/VariantTypes/varCurrency.md), [`varDate`](../../Constants/VariantTypes/varDate.md) |
| Strings | [`varOleStr`](../../Constants/VariantTypes/varOleStr.md), [`varString`](../../Constants/VariantTypes/varString.md), [`varUString`](../../Constants/VariantTypes/varUString.md), internal [`varStrArg`](../../Constants/VariantTypes/varStrArg.md) |
| Interfaces/status | [`varDispatch`](../../Constants/VariantTypes/varDispatch.md), [`varUnknown`](../../Constants/VariantTypes/varUnknown.md), [`varError`](../../Constants/VariantTypes/varError.md) |
| Nested/special | [`varVariant`](../../Constants/VariantTypes/varVariant.md), host-managed [`varAny`](../../Constants/VariantTypes/varAny.md) |
| Mask/flags | [`varTypeMask`](../../Constants/VariantTypes/varTypeMask.md), [`varArray`](../../Constants/VariantTypes/varArray.md), [`varByRef`](../../Constants/VariantTypes/varByRef.md) |

**Important implementation rules**

- Velox registers exactly the constants listed above. Current Delphi also defines `varUInt32`, `varUInt64`, `varRecord`, `varObject`, `varUStrArg` and custom-type ranges, but those names are not script-visible. `varLongWord` is the exposed legacy alias for current code 19/`varUInt32`.
- `varArray` and `varByRef` are flags, not standalone base types. Mask for the base and test each flag separately. Array flags do not provide bounds, dimensions, locks or ownership.
- A raw `varByRef or varVariant` wrapper can differ from its referent. Several Delphi predicates resolve that wrapper with `FindVarData`; `VarType` intentionally does not.
- With Delphi's default `PackVarCreation=True`, equal numeric values can have different exact integer/floating tags according to their source and range. Use exact codes for representation decisions, not as the only business numeric test.
- Pascal strings, arrays, interfaces and Any values have managed or borrowed lifetimes. A type code does not prove payload validity, safe retention, thread safety or absence of side effects.
- `varEmpty` is uninitialised/cleared; `varNull` is explicitly missing. Converting either to a default value can erase that distinction.

Compare symbolic constants rather than hard-coded numbers. Do not persist a `TVarType` as a cross-language schema without a versioned contract.

The example is source-reviewed only; no Variant tag was read.

**External references**

- [Embarcadero `TVarType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TVarType)
- [Embarcadero `VarType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarType)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `TVarType`](https://www.freepascal.org/docs-html/rtl/system/tvartype.html)
- [Free Pascal `VarType`](https://www.freepascal.org/docs-html/rtl/variants/vartype.html)

<small>Created 2026-07-15</small>
