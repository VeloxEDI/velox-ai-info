---
title: "GetShipmentStatusCode"
description: "Converts a Velox shipment status number to its canonical code."
sidebar_position: 45
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mapping
  - shipment-status
  - variant
---

```Delphi
Function GetShipmentStatusCode(const aShipmentStatus : Variant) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetShipmentStatusCode(1); // 'Draft'
end;
```

### Usage

`GetShipmentStatusCode` converts a Velox shipment status number to its canonical code.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aShipmentStatus` | `Variant`, `const` | Numeric shipment status; use a listed integral value. |
| Result | `Variant` | Canonical code string for a recognized value; otherwise `Null`. |

**Complete mapping**

| Number | Code |
|---:|---|
| `1` | `Draft` |
| `2` | `Booked` |
| `3` | `Planned` |
| `4` | `Collected` |
| `5` | `Problem` |
| `6` | `Delivered` |
| `7` | `Cancelled` |

**Behaviour and edge cases**

- With Velox's default loose `NullEqualityRule`, Null follows the explicit guard. Because the rule is shared across the Velox process, strict or error settings can alter or break that comparison.
- Use integral constants from this family. Do not depend on Variant coercion from strings, floats or booleans.
- Unknown comparable values return `Null`; incompatible arrays/interfaces can raise conversion/operator exceptions that propagate.
- Reused labels or numbers in another Velox status/type family are not semantically interchangeable. Use the function matching the field.

### Additional Technical Info
`GetShipmentStatusCode` converts a numeric shipment status to its canonical Velox code. The complete map is compiled into product source and is not read from customer configuration.

**Implementation**

The source evaluates `aShipmentStatus = Null`, then uses a `case` over the listed constants. A recognized branch returns its fixed counterpart; the fallback returns `Null`. No database or alias configuration is consulted.

**Side effects, errors and performance**

For supported input the function is pure, does no I/O and runs over a small fixed mapping. Variant comparison or conversion errors propagate.

**Related entries**

- [`GetShipmentStatusNum`](GetShipmentStatusNum.md) performs the reverse conversion.
- [Embarcadero: `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.NullEqualityRule)
- [Free Pascal: `NullEqualityRule`](https://www.freepascal.org/docs-html/rtl/variants/nullequalityrule.html)

<small>Created 2026-07-15</small>
