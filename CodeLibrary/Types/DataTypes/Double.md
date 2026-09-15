---
title: Double
description: Stores an IEEE 754 binary64 approximate real value with about fifteen to sixteen significant decimal digits.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, double, floating-point, binary64, precision]
---

```Delphi
Double
```

### Example

```Delphi
procedure CalculateRatio(Total, Count: Double; var Ratio: Double);
begin
  if Count <> 0 then
    Ratio := Total / Count;
end;
```

### Usage

`Double` stores an IEEE 754 binary64 approximate real value with about fifteen to sixteen significant decimal digits.

### Additional Technical Info
`Double` is PascalScript base type `btDouble`, mapped directly to Delphi's 8-byte IEEE 754 binary64 value. It provides approximately 15-16 significant decimal digits and a very large exponent range.

Most decimal fractions, including `0.1`, cannot be represented exactly. Avoid direct equality for calculated measurements; compare within a domain-appropriate tolerance. Do not use Double for identifiers or exact monetary values when [`Currency`](Currency.md) or a validated decimal string/schema is appropriate.

Binary64 exactly represents integers only through `2^53` (`9,007,199,254,740,992`). A 64-bit integer sent through Double/JavaScript JSON can lose low digits above that boundary.

NaN and infinity are possible at the representation level, although a particular arithmetic/import path may raise under the process floating-point mode. Many JSON/database consumers reject non-finite values. Validate `IsNan`/`IsInfinite` where available before interchange.

Text parsing/formatting can be locale-dependent. Use explicit invariant format functions for protocols and persisted text.

The example is source-reviewed only; no division was executed.

**External references**

- [Embarcadero real types](https://docwiki.embarcadero.com/RADStudio/en/Real_Types_(Delphi)) - Double size and precision.
- [Free Pascal real types](https://www.freepascal.org/docs-html/ref/refsu7.html) - compatible floating-type comparison reference.

<small>Created 2026-07-15</small>
