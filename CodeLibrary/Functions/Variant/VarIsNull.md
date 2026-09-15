---
title: "VarIsNull"
description: "Tests whether a Variant contains exactly the explicit Null state."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - 'null'
  - missing-value
---

```Delphi
function VarIsNull(const V: Variant): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Candidate: Variant;
begin
  Candidate := Null;
  Value := VarIsNull(Candidate); // True
end;
```

### Usage

`VarIsNull` tests whether a Variant contains exactly the explicit Null state.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `V` | `Variant` (`const`) | Value to inspect without conversion. Nested Variant/by-reference Variant indirection is resolved for this predicate. |
| Result | `Boolean` | `True` only when the resolved stored type is `varNull`; otherwise `False`. |

### Additional Technical Info
`VarIsNull` returns `True` only when `V` contains the Variant Null state represented by `varNull`. Null conventionally represents an explicitly unknown or missing value; it is different from an unassigned Variant.

The example is fictional and source-reviewed only.

**Implementation and behaviour**

The modified PascalScript runtime registers Delphi `System.Variants.VarIsNull` directly. Delphi follows the underlying Variant data and compares its type code with `varNull`.

The function does not apply Delphi's Null comparison or conversion policies, so it is the reliable way to branch before an operation that may propagate Null or raise under strict Null conversion. It also does not treat Empty, a nil interface, empty text, zero, false or a blank database field already converted to text as Null.

`VarToStrDef` and `VarToWideStrDef` use this exact Null test before selecting their fallback. Their defaults therefore do not apply to Empty or to an otherwise invalid conversion.

**Side effects, errors, performance and concurrency**

The routine is a constant-time type check with no conversion, allocation, I/O, global-state mutation or ordinary exception path. As with other managed values, do not read and mutate the same Variant storage concurrently without coordination.

**Related entries**

- [`VarIsEmpty`](VarIsEmpty.md) tests the distinct Empty/Unassigned state.
- [`VarIsClear`](VarIsClear.md) provides the broader no-usable-value test.
- [`VarToStrDef`](VarToStrDef.md) substitutes caller text only when this predicate is true.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarIsNull`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarIsNull)
- [Free Pascal: `Variants.VarIsNull`](https://www.freepascal.org/docs-html/rtl/variants/varisnull.html) - compatibility context for explicit Null testing.

<small>Created 2026-07-15</small>
