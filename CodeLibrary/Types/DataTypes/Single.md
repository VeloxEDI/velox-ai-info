---
title: Single
description: Stores an IEEE 754 binary32 approximate real value with about seven significant decimal digits.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, single, floating-point, binary32, precision]
---

```Delphi
Single
```

### Example

```Delphi
procedure SetFraction(var Fraction: Single);
begin
  Fraction := 0.5;
end;
```

### Usage

`Single` stores an IEEE 754 binary32 approximate real value with about seven significant decimal digits.

### Additional Technical Info
`Single` is PascalScript `btSingle`, mapped to Delphi's 4-byte IEEE 754 binary32 value. It provides roughly seven significant decimal digits.

Use it only when an API/schema explicitly requires binary32 or its smaller storage/precision is acceptable. Prefer [`Double`](Double.md) for general calculations to reduce rounding loss.

Most decimal fractions are approximate. Repeated arithmetic can accumulate error; direct equality is unsafe for calculated values. Define a tolerance and business rounding rule.

Single's integer precision is limited to 24 binary significant bits, so consecutive large integers cannot all be represented. Validate before using a Single-derived value as a count, identifier or exact database key.

NaN/infinity are representation possibilities but may be rejected by JSON/database consumers or affected by process floating-point settings. Locale-sensitive text conversion is a separate concern.

The example is source-reviewed only; no assignment was executed.

**External references**

- [Embarcadero real types](https://docwiki.embarcadero.com/RADStudio/en/Real_Types_(Delphi)) - Single size and precision.
- [Free Pascal real types](https://www.freepascal.org/docs-html/ref/refsu7.html) - compatible floating-type reference.

<small>Created 2026-07-15</small>
