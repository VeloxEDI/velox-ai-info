---
title: "VarArraySet"
description: "Converts and assigns one element in a one-dimensional Variant array."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - array
  - mutation
---

```Delphi
procedure VarArraySet(C: Variant; I: Integer; var S: Variant);
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

`VarArraySet` converts and assigns one element in a one-dimensional Variant array.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `C` | `Variant` | Value to assign. A fixed-element array converts it to the array's base type. |
| `I` | `Integer` | Index within the array's actual bounds. Velox-created arrays use `0..aLength - 1`. |
| `S` | `Variant` (`var`) | Existing one-dimensional Variant array to mutate. |

### Additional Technical Info
`VarArraySet` assigns `C` to the element at index `I` in Variant array `S`. It mutates the caller's array and returns no status value; conversion or index failures raise an exception.

The example is fictional and source-reviewed only.

**Implementation**

The modified PascalScript runtime calls Delphi `System.Variants.VarArrayPut(S, C, [I])` with a one-item index list. The compiler also lowers direct assignment syntax such as `S[I] := C` through this same registered wrapper.

For a fixed-element array, Delphi casts `C` to the array's base type before writing. For a `varVariant` array, most Variant values retain their type. Native Delphi string Variants are a special case: they are converted to Automation `varOleStr` representation before being stored in the `SAFEARRAY` cell.

**Behaviour and errors**

- The public wrapper can address exactly one dimension. A multidimensional array fails because Delphi requires one index per dimension.
- `S` must be an actual Variant array. A scalar, Empty or Null value raises a Variant invalid-argument/not-an-array exception.
- An out-of-range `I` raises `EVariantBadIndexError`; no element is selected by wrapping or clamping the index.
- A value that cannot be converted to a fixed element type raises a Variant type-cast, overflow or range exception. For example, assigning non-numeric text to a `varInteger` array does not silently produce zero.
- Assignment replaces the previous managed element and updates its references. If an exception occurs before the `SAFEARRAY` write, do not assume that a useful conversion result exists.

**Side effects, performance and concurrency**

The selected cell of `S` is changed. Fixed-type conversion can allocate temporary string/interface data, and replacing a managed value can release its previous references. A normal indexed write is constant-time apart from conversion and managed-value work.

Do not write the same underlying array concurrently without external synchronisation. Ordinary Delphi Variant assignment copies Variant-array storage, but explicit by-reference Variant representations can still expose shared mutable storage.

**Related entries**

- [`VarArrayCreate`](VarArrayCreate.md) chooses the bounds and fixed or mixed element model.
- [`VarArrayGet`](VarArrayGet.md) reads a copied element.
- [`VarAsType`](VarAsType.md) lets a script perform and handle conversion before the write.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarArrayPut`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayPut) - the Delphi terminal used by the Velox `VarArraySet` name.
- [Free Pascal: `System.VarArrayPut`](https://www.freepascal.org/docs-html/rtl/system/vararrayput.html) - compatibility context for the corresponding array write.

<small>Created 2026-07-15</small>
