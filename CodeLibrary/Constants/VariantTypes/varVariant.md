---
title: varVariant
description: Identifies nested Variant storage, chiefly Variant-element SAFEARRAYs and by-reference Variant wrappers.
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, nested, array]
---

```Delphi
varVariant = 12
```

### Example

```Delphi
procedure CreateMixedArray(var Value: Variant);
begin
  Value := VarArrayCreate(3, varVariant);
end;
```

### Usage

`varVariant` identifies nested Variant storage, chiefly arrays of Variant values and references to other Variant values.

### Additional Technical Info
`varVariant` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$000C` for storage whose element/referent is itself another Variant. Its most useful script role is as the element type for a mixed-type array: [`VarArrayCreate`](../../Functions/Variant/VarArrayCreate.md) returns `varArray or varVariant`, and each element can then hold its own independent type.

Delphi also uses `varByRef or varVariant` as an indirection wrapper around another Variant. [`VarType`](../../Functions/Variant/VarType.md) returns that raw wrapper code, while several `FindVarData`-based predicates follow the pointer and classify the referent. This explains why raw and semantic type tests can differ.

**Use and boundaries**

- Do not expect a normal by-value scalar assignment to retain an extra nested wrapper; Variant assignment ordinarily copies/converts the contained value.
- Variant-element arrays provide flexibility but require per-element Null/Empty/type/error handling and consume more memory than fixed-type arrays.
- Array elements can themselves be arrays or interfaces. Bound recursion, input size and external side effects when processing untrusted mixed data.
- A by-reference wrapper borrows the referent and must not outlive its owner.

Pass `varVariant` as a base element type, never combined manually with `varArray`/`varByRef` in `VarArrayCreate`. Use [`varTypeMask`](varTypeMask.md) and separate flag tests when inspecting.

The example is source-reviewed only; no Variant array was allocated.

**External references**

- [Embarcadero `VarArrayCreate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayCreate)
- [Embarcadero `VarType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarType)
- [Free Pascal `varVariant`](https://www.freepascal.org/docs-html/rtl/system/varvariant.html)

<small>Created 2026-07-15</small>
