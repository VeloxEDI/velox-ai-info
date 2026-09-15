---
title: Extended
description: Uses the hosting Delphi Extended representation, giving 80-bit precision on Win32 but Double-equivalent precision on Win64.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, extended, floating-point, win32, win64]
---

```Delphi
Extended
```

### Example

```Delphi
procedure Accumulate(Value: Extended; var Total: Extended);
begin
  Total := Total + Value;
end;
```

### Usage

Uses the hosting Velox Extended representation, giving 80-bit precision on Win32 but Double-equivalent precision on Win64.

### Additional Technical Info
`Extended` maps to PascalScript `btExtended`, whose runtime storage is Delphi `Extended` in the hosting Velox executable.

Its precision is architecture-dependent:

- Win32 Delphi uses the 10-byte x87 extended format, with roughly 18-19 significant decimal digits.
- Win64 Delphi defines Extended with the same 8-byte binary64 precision/range as Double.

The same script can therefore round differently between 32-bit Designer/service builds and 64-bit builds. Do not use Extended precision as part of a persisted, signed, reconciled or cross-service calculation contract. Choose [`Double`](Double.md) for a stable binary64 contract, or Currency/decimal text for the required decimal semantics.

Like every binary floating type, Extended cannot represent most decimal fractions exactly. Avoid direct equality after arithmetic and define tolerance/rounding. Text conversion can depend on locale, and non-finite values may not be accepted by external systems.

The example is source-reviewed only; no accumulation was executed.

**External references**

- [Embarcadero Extended type](https://docwiki.embarcadero.com/RADStudio/en/Extended_Syntax_(Delphi)) - platform-dependent native representation.
- [Free Pascal real types](https://www.freepascal.org/docs-html/ref/refsu7.html) - compatible language model; actual FPC Extended width is target-dependent and does not override Velox behavior.

<small>Created 2026-07-15</small>
