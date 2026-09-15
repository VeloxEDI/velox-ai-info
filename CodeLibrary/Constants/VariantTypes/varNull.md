---
title: varNull
description: Identifies the explicit Null Variant state whose conversions and comparisons depend on Delphi process-global rules.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, 'null', missing]
---

```Delphi
varNull = 1
```

### Example

```Delphi
function IsExplicitlyMissing(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varNull;
end;
```

### Usage

`varNull` identifies the explicit Null Variant state whose conversions and comparisons depend on Velox shared across the Velox process rules.

### Additional Technical Info
`varNull` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0001`. It represents an explicitly unknown or missing Variant, including the value returned by [`Null`](../Variant/Null.md) and nullable data sources.

Null is assigned and differs from [`varEmpty`](varEmpty.md), empty text, zero, false, a nil interface and an absent object. Use [`VarIsNull`](../../Functions/Variant/VarIsNull.md) for the semantic test; it is clearer and resolves Delphi's special by-reference Variant wrapper.

Current Delphi defaults `NullStrictConvert=True`, so ordinary casts to non-Variant values can raise. Null equality and ordering also use process-global rules that native host code can change. Modified Pascal Script deliberately routes Variant-to-script-string conversion through `VarToStr`; with the default `NullAsStringValue`, this produces `''` and loses Null provenance.

Technical mappings should test Null before conversion and choose a business outcome explicitly. Do not rely on `Value = Null`, truthiness, an empty formatted string or a persisted numeric type code.

[`VarType`](../../Functions/Variant/VarType.md) returns the raw tag without conversion. A canonical Null has no flags; mask when inspecting externally supplied representations.

The example is source-reviewed only; no Null comparison or conversion was executed.

**External references**

- [Embarcadero `Null`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.Null)
- [Embarcadero `VarIsNull`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarIsNull)
- [Free Pascal `varNull`](https://www.freepascal.org/docs-html/rtl/system/varnull.html)

<small>Created 2026-07-15</small>
