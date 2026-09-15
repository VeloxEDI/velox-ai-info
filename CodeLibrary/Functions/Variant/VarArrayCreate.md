---
title: "VarArrayCreate"
description: "Creates a zero-based, one-dimensional Variant array of a specified length and element type."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - array
  - vartype
---

```Delphi
Function VarArrayCreate( const aLength : Integer; const aVarType : Word) : Variant
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := VarArrayCreate(3, varVariant);
end;
```

### Usage

`VarArrayCreate` creates a zero-based, one-dimensional Variant array of a specified length and element type.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aLength` | `Integer` | Number of elements requested. A positive value `N` produces the bounds `0..N - 1`; zero produces the empty bounds `0..-1`. Negative values are invalid. |
| `aVarType` | `Word` | Base Variant type code for every element, such as `varInteger`, `varDouble`, `varDate`, `varByte`, `varOleStr` or `varVariant`. Do not combine it with `varArray` or `varByRef`. |
| Result | `Variant` | Newly allocated Variant array with one zero-based dimension. |

### Additional Technical Info
`VarArrayCreate` allocates a one-dimensional Variant array with indexes from `0` through `aLength - 1`. Every element has the Variant element type selected by `aVarType`; use `varVariant` when individual elements must be able to hold different types.

The example is fictional and source-reviewed only.

**Implementation**

Velox registers a wrapper that transforms `aLength` into the Delphi bounds array `[0, aLength - 1]`, then calls `System.Variants.VarArrayCreate`. Delphi validates the element type, converts the bounds to a `SAFEARRAY` description, allocates the storage and returns a Variant whose type code is `aVarType or varArray`.

This differs from Delphi's public routine, which accepts any even list of lower/upper bound pairs and can create multidimensional or non-zero-based arrays. Those capabilities are not exposed by this Velox declaration.

**Element types**

- `varVariant` permits mixed element types and nested Variant values.
- A fixed type such as `varInteger` or `varDate` makes every later assignment convert to that type.
- Use `varOleStr`, not `varString` or `varUString`, for an Automation-compatible string array.
- `varByte` is suitable for raw binary octets. It remains a Variant array, not a Velox `TBytes` dynamic array.
- `varEmpty`, `varNull`, native `varString`/`varUString`, custom Variant types and codes containing `varArray` or `varByRef` are not valid array base types.

**Edge cases and errors**

`aLength = 0` is the deliberate empty-array form: the wrapper supplies `0..-1`, producing a zero-element Variant array. With a negative value, the calculated element count underflows the unsigned Automation bound and can become an enormous invalid allocation request; do not pass negative or unchecked external lengths. A bad element code, invalid bounds, allocation failure or operating-system `SAFEARRAY` failure raises `EVariantArrayCreateError`.

The function does not populate business values. Assign elements explicitly with [`VarArraySet`](VarArraySet.md), and keep the requested length bounded when it comes from external data because allocation scales with both the element count and element size.

**Side effects, performance and concurrency**

The function allocates managed array storage but performs no I/O and changes no existing value. Time and memory are proportional to `aLength`; large or malicious lengths can exhaust process memory. Each call returns independent storage. Ordinary Delphi Variant assignment copies Variant-array storage, while explicit by-reference Variant representations can still share a mutable array.

**Related entries**

- [`VarArrayGet`](VarArrayGet.md) reads one element.
- [`VarArraySet`](VarArraySet.md) converts and assigns one element.
- [`VarType`](VarType.md) reports `varArray` together with the element base code.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarArrayCreate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayCreate)
- [Free Pascal: `Variants.VarArrayCreate`](https://www.freepascal.org/docs-html/rtl/variants/vararraycreate.html) - compatibility context; its bounds-based declaration is not the Velox length wrapper.

<small>Created 2026-07-15</small>
