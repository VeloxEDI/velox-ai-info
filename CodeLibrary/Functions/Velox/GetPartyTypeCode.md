---
title: "GetPartyTypeCode"
description: "Converts a Velox party type number to its canonical code."
sidebar_position: 34
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mapping
  - party-type
  - variant
---

```Delphi
Function GetPartyTypeCode(const aPartyType : Variant) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPartyTypeCode(1); // 'Customer'
end;
```

### Usage

`GetPartyTypeCode` converts a Velox party type number to its canonical code.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aPartyType` | `Variant`, `const` | Numeric party type. Supply one of the listed integral values in a compatible `Variant`. |
| Result | `Variant` | Canonical code string in a `Variant`, or `Null` for a null or unrecognized value. |

**Complete mapping**

| Number | Code |
|---:|---|
| `1` | `Customer` |
| `2` | `Supplier` |
| `3` | `Consignor` |
| `4` | `Consignee` |
| `5` | `Location` |
| `6` | `Carrier` |
| `7` | `Shipper` |
| `8` | `Agent` |
| `100` | `Company` |

**Behaviour and edge cases**

- With Velox's default loose `NullEqualityRule`, `Null` follows the explicit null branch. The rule is shared across the Velox process; strict or error settings can alter or break that comparison.
- Unknown comparable values return `Null`; they do not raise a domain-specific error.
- Use the listed integral values. Do not rely on Variant coercion from strings, floating-point values or booleans.
- Arrays, interfaces and other incompatible Variant values can raise comparison or ordinal-conversion errors, which propagate.
- `Company` is deliberately `100`, not the next value after `Agent`. Do not infer party numbers by list position.
- [`GetReferenceTableForPartyType`](GetReferenceTableForPartyType.md) returns a different, prefixed identifier family and uses `Unknown` rather than `Null` for a miss.

### Additional Technical Info
`GetPartyTypeCode` converts a numeric party type to the canonical Velox code. Its complete mapping is compiled into the product and is not read from customer configuration.

**Implementation**

The source first evaluates `aPartyType = Null`, then uses a `case` over the listed constants. A recognized value returns its literal code and the `else` branch returns `Null`. It performs no database query or configurable alias lookup.

**Side effects, errors and performance**

For supported input the function is pure, performs no I/O and runs over a small fixed mapping. Variant comparison/conversion failures propagate.

**Related entries**

- [`GetPartyTypeNum`](GetPartyTypeNum.md) performs the reverse conversion.
- [Embarcadero: `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.NullEqualityRule)
- [Free Pascal: `NullEqualityRule`](https://www.freepascal.org/docs-html/rtl/variants/nullequalityrule.html)

<small>Created 2026-07-15</small>
