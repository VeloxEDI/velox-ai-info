---
title: "VarType"
description: "Returns the raw Word type code of a Variant, including array and by-reference flags."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - vartype
  - flags
  - inspection
---

```Delphi
function VarType(const V: Variant): TVarType;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Items: Variant;
  Kind: TVarType;
begin
  Items := VarArrayCreate(2, varInteger);
  Kind := VarType(Items);
  Value := (Kind and varArray) <> 0; // True
end;
```

### Usage

`VarType` returns the raw Word type code of a Variant, including array and by-reference flags.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `V` | `Variant` (`const`) | Variant whose top-level stored type code is required. No conversion is performed. |
| Result | `TVarType` | Raw `Word` type code, including base type and any array/by-reference flags. |

### Additional Technical Info
`VarType` returns the raw `TVarData.VType` code stored in `V`. The result contains a base Variant type and can also contain the `varArray` and `varByRef` flag bits.

The example is fictional and source-reviewed only.

**Implementation**

The modified PascalScript runtime registers Delphi `System.Variants.VarType` directly. The installed Delphi implementation returns `TVarData(V).VType` without dereferencing or masking it.

This raw behaviour is important. The missing-value predicates resolve underlying Variant indirection before comparing with `varEmpty` or `varNull`; `VarType` instead reports the top-level representation that the caller supplied.

**Interpreting the result**

| Component | Meaning |
|---|---|
| `Kind and varTypeMask` | Base type code, such as `varEmpty`, `varNull`, `varInteger`, `varDate`, `varOleStr`, `varVariant` or a custom type code. |
| `(Kind and varArray) <> 0` | The Variant contains Automation array storage. |
| `(Kind and varByRef) <> 0` | The Variant contains a by-reference representation. |

An exact equality check such as `VarType(V) = varInteger` is appropriate only when flags must be absent. For an integer Variant array, the raw result is `varInteger or varArray`, so mask the base code and test the array flag separately.

**Edge cases and quirks**

- `VarType(Unassigned)` is `varEmpty`; `VarType(Null)` is `varNull`.
- A `varVariant` wrapper and a by-reference Variant can report their wrapper/flag type rather than the resolved payload type.
- Custom Variant type codes are returned unchanged; this function does not ask the custom handler for a more general category.
- Type inspection says nothing about semantic validity. An empty string, zero, false, nil interface and invalid business date can each have a normal non-Empty type code.
- Type codes are implementation identifiers, not stable text-format values. Do not persist them as a cross-language schema without an explicit contract.

**Side effects, errors, performance and concurrency**

The routine reads one type field. It allocates nothing, performs no I/O or conversion, does not invoke custom handlers and has no normal exception path. It is constant-time. The same Variant must not be mutated concurrently while its representation is being inspected.

**Related entries**

- [`VarAsType`](VarAsType.md) creates a Variant with a requested base type.
- [`VarIsEmpty`](VarIsEmpty.md), [`VarIsNull`](VarIsNull.md) and [`VarIsClear`](VarIsClear.md) express common semantic tests without manual masks.
- [`VarArrayCreate`](VarArrayCreate.md) returns a code containing the selected element type plus `varArray`.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarType)
- [Free Pascal: `Variants.VarType`](https://www.freepascal.org/docs-html/rtl/variants/vartype.html) - compatibility context for the raw type-code result.

<small>Created 2026-07-15</small>
