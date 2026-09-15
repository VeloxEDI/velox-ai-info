---
title: "Math"
description: "Elementary Extended-precision magnitude, trigonometric, power, root and integer-part functions plus Pi."
sidebar_position: 19
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - math
  - floating-point
  - trigonometry
  - power
---

The Math group exposes elementary operations over PascalScript/Delphi `Extended` values. Most are modified PascalScript standard functions or direct Delphi Math bindings; `NthRoot` is a Velox helper implemented through logarithm and exponentiation.

## Common tasks

- Use [`Abs`](Math/Abs.md) for magnitude and [`Int`](Math/Int.md) for a floating-point integer part rounded toward zero.
- Use [`Sin`](Math/Sin.md) and [`Cos`](Math/Cos.md) with angles in radians; [`Pi`](Math/Pi.md) supplies the matching constant.
- Use [`Power`](Math/Power.md) for an `Extended` base and signed integer exponent.
- Use [`Sqrt`](Math/Sqrt.md) for a principal square root and [`NthRoot`](Math/NthRoot.md) only within its documented positive-input/logarithmic domain.

## Numeric model

These functions use binary floating-point. Results are approximations and can contain rounding error; they are not exact decimal currency calculations. Delphi `Extended` precision and storage are platform dependent, so do not make an interchange format or equality threshold depend on undocumented extra precision.

Trigonometric inputs are radians, not degrees. Convert explicitly when source data uses degrees:

```Delphi
Radians := Degrees * Pi / 180;
```

## Domains and exceptional values

Square root, logarithmic nth-root construction and power operations have mathematical domains. Negative bases, zero with a negative exponent, invalid root values, overflow and underflow can raise a math exception or produce a non-finite value according to the active floating-point environment and terminal routine.

`NaN` and infinity do not behave like ordinary ordered numbers. Validate externally supplied values before using a result in equality, range, array-size or loop decisions. Use the [Numeric](Numeric.md) group for integer bounds, rounding algorithms and pseudo-random values; those entries have different result widths and global-state behavior.

No group-wide rounding or tolerance policy is applied. Choose and document one at the integration boundary when a result will be compared, serialized or stored at fixed precision.
