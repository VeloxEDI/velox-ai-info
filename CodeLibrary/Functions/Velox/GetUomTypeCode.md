---
title: "GetUomTypeCode"
description: "Converts a Velox UOM type number to its canonical code, including the shared Quantity/Unit value."
sidebar_position: 55
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - uom
  - mapping
  - variant
---

```Delphi
Function GetUomTypeCode(const aUomType : Variant) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetUomTypeCode(1); // 'Unit'
end;
```

### Usage

`GetUomTypeCode` converts a Velox UOM type number to its canonical code, including the shared Quantity/Unit value.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aUomType` | `Variant`, `const` | Numeric UOM type; use one of the listed integral values. |
| Result | `Variant` | Canonical code string, or `Null` for Null/unknown input under the normal Variant policy. |

**Behaviour and edge cases**

- `Quantity` cannot be recovered as a distinct concept from number `1`; the result is always `Unit`.
- Unknown comparable values return `Null` and are not coerced to the nearest packaging level.
- With Velox's default loose `NullEqualityRule`, Null follows the explicit guard. A shared across the Velox process strict/error rule can alter or break that comparison.
- Use integral constants rather than relying on conversion from numeric strings, floating-point values or booleans.
- Arrays, interfaces and other incompatible Variants can raise comparison or ordinal-conversion errors, which propagate.
- This maps a UOM classification, not an actual unit code such as `EA`, `KG` or `L`; it performs no quantity conversion.

### Additional Technical Info
`GetUomTypeCode` converts a numeric Velox unit-of-measure type to its canonical code. The observable mapping has six values. Velox's internal `Quantity` and `Unit` constants both equal `1` and both have code text `Unit`; there is no distinct `Quantity` result.

**Complete observable mapping**

| Number | Code | Notes |
|---:|---|---|
| `1` | `Unit` | Also the internal `Quantity` value; the representations are identical. |
| `2` | `Inner` | Inner packaging. |
| `3` | `Outer` | Outer packaging. |
| `4` | `Pallet` | Pallet. |
| `5` | `Hire` | Hire item/container. |
| `6` | `Tie` | Tie. |

**Implementation**

The source checks `aUomType = Null` and otherwise uses a `case`. Value `1` is represented by the `Type_Unit` arm; the source comment explicitly omits a separate `Type_Quantity` arm because both constants have the same value. Remaining values return their fixed literals, and the fallback returns `Null`.

**Side effects, errors and performance**

The function is pure, performs no I/O and is constant-time over six observable values.

**Related entries**

- [`GetUomTypeNum`](GetUomTypeNum.md) performs the reverse text lookup and documents its duplicate source branch.
- [Embarcadero: `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.NullEqualityRule)
- [Free Pascal: `NullEqualityRule`](https://www.freepascal.org/docs-html/rtl/variants/nullequalityrule.html)

<small>Created 2026-07-15</small>
