---
title: "LessThanValueEpsilon"
description: "Tests whether one Extended value orders below another after an explicit-tolerance comparison."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - floating-point
  - less-than
  - epsilon
---

```Delphi
Function LessThanValueEpsilon( const A, B : Extended; Epsilon : Extended): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LessThanValueEpsilon(9.5, 10.0, 0.01);
end;
```

### Usage

`LessThanValueEpsilon` tests whether one Extended value orders below another after an explicit-tolerance comparison.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | Left-hand value. |
| `B` | `Extended`, `const` | Right-hand value. |
| `Epsilon` | `Extended` | Allowed absolute difference before the values are treated as same. Use a finite positive value. |

**Returns**

A difference less than or equal to a valid positive epsilon returns `False` because the values classify as same.

**Behaviour**

With a finite positive epsilon, this operation provides a tolerance-aware strict ordering: `A` must be below the lower edge of `B`'s tolerance band to return `True`. It is an absolute band in the same unit as the operands.

**Errors**

The function does not validate epsilon or finiteness. Nonnumeric argument conversion can raise before entry.

**Usage notes**

Validate epsilon when it comes from configuration and document its unit. If the rule is "less than after rounding to N decimal places", perform that domain rounding explicitly; an absolute binary floating band is not the same rule.

### Additional Technical Info
`LessThanValueEpsilon` reports whether `A` orders below `B` after first applying the supplied absolute tolerance. The example returns `True` because the difference is greater than `0.01`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox wrapper calls the Delphi `Extended` `CompareValue` overload and tests for the internal `LessThan` constant. Delphi performs its inclusive `SameValue` test before evaluating `A < B`.

**Edge cases and quirks**

- A difference exactly equal to epsilon is same, so the result is `False`.
- `Epsilon = 0` selects Delphi's calculated, platform-dependent default tolerance rather than exact `<` semantics.
- With a negative epsilon, even equal values fail the same-value test; ordinary `A < B` pairs still return `True`. This makes the predicate internally inconsistent as a tolerance rule, so reject negative values.
- A very large or infinite positive epsilon can make widely separated finite values classify as same and return `False`.
- A `NaN` operand never classifies as less than through the underlying comparison and this function returns `False`.
- Equal same-signed infinities also return `False`; do not infer equality from that Boolean alone.
- Operand evaluation remains platform-dependent `Extended` arithmetic even when the epsilon is explicit.

**Side effects**

None.

**Performance and concurrency**

The operation is constant-time, allocation-free and re-entrant.

**Related entries**

- [`CompareValueEpsilon`](CompareValueEpsilon.md) exposes the three-way relationship.
- [`LessThanValue`](LessThanValue.md) uses the calculated default tolerance.
- [`IsZeroEpsilon`](IsZeroEpsilon.md) applies an explicit band around zero.

**External references**

- [Embarcadero `System.Math.CompareValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.CompareValue)
- [Free Pascal `CompareValue`](https://www.freepascal.org/docs-html/rtl/math/comparevalue.html) — compatibility reference; current Delphi behaviour is authoritative for Velox.

<small>Created 2026-07-15</small>
