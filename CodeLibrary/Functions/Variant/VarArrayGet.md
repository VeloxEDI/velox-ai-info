---
title: "VarArrayGet"
description: "Returns a copy of one element from a one-dimensional Variant array."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - array
  - indexing
---

```Delphi
function VarArrayGet(var S: Variant; I: Integer): Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Items: Variant;
begin
  Items := VarArrayCreate(2, varVariant);
  VarArraySet('EDI', 0, Items);
  Value := VarArrayGet(Items, 0); // EDI
end;
```

### Usage

`VarArrayGet` returns a copy of one element from a one-dimensional Variant array.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `Variant` (`var`) | Existing one-dimensional Variant array. The `var` modifier requires a writable variable at the call site but Velox only reads it. |
| `I` | `Integer` | Index within the array's actual lower and upper bounds. Arrays made by Velox [`VarArrayCreate`](VarArrayCreate.md) are zero-based. |
| Result | `Variant` | Copy of the selected element, carrying that element's effective Variant type and value. |

### Additional Technical Info
`VarArrayGet` returns the element at index `I` from Variant array `S`. Although the declaration marks `S` as `var`, reading does not modify the array.

The example is fictional and source-reviewed only.

**Implementation**

The modified PascalScript runtime wraps `S` and `I` as a one-item Delphi index list and calls `System.Variants.VarArrayGet(S, [I])`. Delphi verifies that the value is a Variant array and that its dimension count equals the number of supplied indexes. It then copies a `varVariant` cell directly or wraps a fixed-type cell in a Variant of the array's base type.

The PascalScript compiler also lowers a direct Variant index read such as `Value := S[I]` through this registered function. The explicit callable and index syntax therefore share the same one-dimensional terminal behaviour.

**Edge cases and errors**

- The wrapper always supplies exactly one index. A multidimensional Variant array fails the dimension-count check even if `I` would be valid in its first dimension.
- A non-array `S` raises a Variant invalid-argument/not-an-array error.
- An index below the lower bound or above the upper bound raises `EVariantBadIndexError`; there is no default or sentinel result.
- The index is not clamped and negative values are not automatically invalid when an externally created array genuinely has a negative lower bound. Arrays created through the Velox wrapper start at zero.
- The returned Variant is a managed copy. Changing the result does not assign back into the array cell; use [`VarArraySet`](VarArraySet.md) for mutation.

**Performance and concurrency**

Lookup is constant-time apart from copying the selected managed value. Strings, interfaces, nested Variants and arrays may adjust reference counts or copy managed data. The routine has no global state, but simultaneous reads and writes to the same underlying Variant array require caller coordination.

**Related entries**

- [`VarArrayCreate`](VarArrayCreate.md) creates the zero-based arrays used by most Velox scripts.
- [`VarArraySet`](VarArraySet.md) assigns an element through the matching one-index wrapper.
- [`VarType`](VarType.md) can distinguish an array Variant and inspect an element result.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarArrayGet`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayGet)
- [Free Pascal: `System.VarArrayGet`](https://www.freepascal.org/docs-html/rtl/system/vararrayget.html) - compatibility context for Variant-array indexing.

<small>Created 2026-07-15</small>
