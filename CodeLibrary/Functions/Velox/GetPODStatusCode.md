---
title: "GetPODStatusCode"
description: "Converts a Velox POD status number to its canonical code."
sidebar_position: 36
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mapping
  - pod-status
  - variant
---

```Delphi
Function GetPODStatusCode(const aPODStatus : Variant) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPODStatusCode(1); // 'Delivered'
end;
```

### Usage

`GetPODStatusCode` converts a Velox POD status number to its canonical code.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aPODStatus` | `Variant`, `const` | Numeric POD status. Supply one of the listed integral values in a compatible `Variant`. |
| Result | `Variant` | Canonical code string in a `Variant`, or `Null` for a null or unrecognized value. |

**Complete mapping**

| Number | Code |
|---:|---|
| `1` | `Delivered` |
| `2` | `Updated` |
| `3` | `Cancelled` |

**Behaviour and edge cases**

- With Velox's default loose `NullEqualityRule`, `Null` follows the explicit null branch. The rule is shared across the Velox process; strict or error settings can alter or break that comparison.
- Unknown comparable values return `Null`; they do not raise a domain-specific error.
- Use the listed integral values. Do not rely on Variant coercion from strings, floating-point values or booleans.
- Arrays, interfaces and other incompatible Variant values can raise comparison or ordinal-conversion errors, which propagate.
- Identical numbers or labels used by another status/type family do not make the domains interchangeable. Use the function for the field's actual semantic family.

### Additional Technical Info
`GetPODStatusCode` converts a numeric POD status to the canonical Velox code. Its complete mapping is compiled into the product and is not read from customer configuration.

**Implementation**

The source first evaluates `aPODStatus = Null`, then uses a `case` over the listed constants. A recognized value returns its literal code and the `else` branch returns `Null`. It performs no database query or configurable alias lookup.

**Side effects, errors and performance**

For supported input the function is pure, performs no I/O and runs over a small fixed mapping. Variant comparison/conversion failures propagate.

**Related entries**

- [`GetPODStatusNum`](GetPODStatusNum.md) performs the reverse conversion.
- [Embarcadero: `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.NullEqualityRule)
- [Free Pascal: `NullEqualityRule`](https://www.freepascal.org/docs-html/rtl/variants/nullequalityrule.html)

<small>Created 2026-07-15</small>
