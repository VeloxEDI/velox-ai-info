---
title: "LessThanValue"
description: "Tests whether one Extended value orders below another after Delphi's default-tolerance comparison."
sidebar_position: 17
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
Function LessThanValue( const A, B : Extended): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LessThanValue(9.5, 10.0);
end;
```

### Usage

`LessThanValue` tests whether one Extended value orders below another after Velox's default-tolerance comparison.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | Left-hand value. |
| `B` | `Extended`, `const` | Right-hand value. |

**Returns**

Values within the default tolerance return `False`.

**Behaviour**

For ordinary finite operands well outside the tolerance, the result matches `A < B`. At or within the inclusive tolerance boundary, the operands classify as same and this function returns `False`.

**Errors**

There is no ordinary data-dependent exception. Nonnumeric script inputs can fail conversion to `Extended` before entry.

**Usage notes**

Use this when near-equal floating values should not order below one another under Velox's default machine tolerance. Use [`LessThanValueEpsilon`](LessThanValueEpsilon.md) when the allowed band is part of the interface or business rule.

### Additional Technical Info
`LessThanValue` reports whether `A` orders below `B` after applying Delphi's calculated default floating-point tolerance. It does not perform the raw expression `A < B`.

The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox calls Delphi `CompareValue` for `Extended` operands and compares its result with the internal `LessThan` constant. The underlying routine first tests approximate equality. With default epsilon, its tolerance is based on the smaller operand magnitude and `ExtendedResolution`, with a minimum of that resolution.

**Edge cases and quirks**

- The platform's `Extended` resolution affects the default band: current true 80-bit builds use `1E-16`, while builds where `Extended` aliases `Double` use `1E-12`.
- A slightly smaller `A` can return `False` when its difference from `B` is within tolerance.
- A `NaN` in either position does not classify as less than through `CompareValue`; this function returns `False`. That does not mean the operands are equal.
- Equal same-signed infinities also return `False`, although the underlying relationship can be the greater/unordered branch rather than same.
- This is an absolute-tolerance comparison derived from floating magnitude, not a decimal rounding or currency-minor-unit rule.

**Side effects**

None.

**Performance and concurrency**

The operation is constant-time, allocation-free and re-entrant.

**Related entries**

- [`CompareValue`](CompareValue.md) exposes all three underlying relationships.
- [`LessThanValueEpsilon`](LessThanValueEpsilon.md) supplies a tolerance.
- [`IsZero`](IsZero.md) uses the related default-resolution zero test.

**External references**

- [Embarcadero `System.Math.CompareValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.CompareValue)
- [Free Pascal `CompareValue`](https://www.freepascal.org/docs-html/rtl/math/comparevalue.html) — compatible background; Delphi defines Velox's exact tolerance and platform behaviour.

<small>Created 2026-07-15</small>
