---
title: "VarIsClear"
description: "Tests whether a Variant is Empty, contains a nil interface or reports a custom clear state."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - clear
  - unassigned
---

```Delphi
function VarIsClear(const V: Variant): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Candidate: Variant;
begin
  Candidate := Unassigned;
  Value := VarIsClear(Candidate); // True
end;
```

### Usage

`VarIsClear` tests whether a Variant is Empty, contains a nil interface or reports a custom clear state.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `V` | `Variant` (`const`) | Value to inspect without conversion. Variant indirection is resolved by the Velox helper. |
| Result | `Boolean` | `True` for Empty, a nil `varDispatch`/`varUnknown` interface, or a custom Variant whose `IsClear` handler returns `True`; otherwise `False`. |

**Important distinctions**

- Null is assigned and therefore is not clear. Use [`VarIsNull`](VarIsNull.md) when Null means missing in the data contract.
- Empty text, zero, false and an empty but allocated Variant array are not clear.
- [`VarIsEmpty`](VarIsEmpty.md) is narrower: it recognises only `varEmpty`, not a nil interface or custom clear value.
- `VarIsClear` does not coerce a value before testing. Text such as `'NULL'` or `'0'` remains ordinary non-clear text.

### Additional Technical Info
`VarIsClear` returns `True` when `V` has no usable assigned value under Delphi's broader clear-state test. It includes Empty/Unassigned Variants, nil interface Variants and custom Variant types whose handler reports that the value is clear.

The example is fictional and source-reviewed only.

**Implementation**

The modified PascalScript runtime registers Delphi `System.Variants.VarIsClear` directly. Delphi resolves Variant/by-reference Variant indirection, then checks the stored type. Built-in `varEmpty` is clear. Built-in `varDispatch` and `varUnknown` values are clear only when their interface pointer is nil. A registered custom Variant type delegates the decision to its `IsClear` method.

**Side effects, errors and concurrency**

The built-in checks only read `V` and do not allocate or mutate state. A custom Variant type's handler is code supplied by that type; any cost, side effect or exception from that handler propagates through this call. Independent built-in checks are safe to perform concurrently provided the same Variant storage is not being mutated at the same time.

**Related entries**

- [`VarIsEmpty`](VarIsEmpty.md) tests exactly Empty/Unassigned.
- [`VarIsNull`](VarIsNull.md) tests exactly Null.
- [`VarType`](VarType.md) exposes the raw type code when the distinction must be handled explicitly.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarIsClear`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarIsClear)
- [Free Pascal: `Variants.VarIsClear`](https://www.freepascal.org/docs-html/rtl/variants/varisclear.html) - compatibility context for the broader clear-state predicate.

<small>Created 2026-07-15</small>
