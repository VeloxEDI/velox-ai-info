---
title: varDouble
description: Identifies a 64-bit binary floating-point Variant, including finite values, signed zero, infinities and NaN.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, double, floating-point]
---

```Delphi
varDouble = 5
```

### Example

```Delphi
function HasDoubleStorage(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varDouble;
end;
```

### Usage

`varDouble` identifies a 64-bit binary floating-point Variant, including finite values, signed zero, infinities and NaN.

### Additional Technical Info
`varDouble` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0005` for a 64-bit IEEE-style binary floating-point payload. It offers roughly 15-17 significant decimal digits but cannot exactly represent most decimal fractions.

The type can also carry signed zero, positive/negative infinity and NaN. Those values have special comparison and conversion behavior: NaN is not an ordinary ordered number, infinities can overflow narrower targets and signed zero can be lost in text or business comparisons.

Delphi's `PackVarCreation` setting means an apparently floating value can instead be tagged [`varSingle`](varSingle.md), `varCurrency` or an integer type depending on how it was created. Exact tag equality is therefore a representation test, not a general numeric predicate.

**Integration guidance**

- Do not use `Double` for exact money or identifiers. Use [`varCurrency`](varCurrency.md), integer scaling or a governed decimal/text representation.
- Validate finite/range requirements before writing databases, JSON, XML or partner formats that cannot represent NaN/infinity.
- Converting a large [`varInt64`](varInt64.md) to Double can lose low-order integer bits even when it remains in range.
- [`VarAsType`](../../Functions/Variant/VarAsType.md) may round or raise on invalid/overflowing input.

[`VarType`](../../Functions/Variant/VarType.md) itself performs no conversion. Mask away flags for base classification.

The example is source-reviewed only; no floating-point operation was executed.

**External references**

- [Embarcadero `Double`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Double)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varDouble`](https://www.freepascal.org/docs-html/rtl/system/vardouble.html)

<small>Created 2026-07-15</small>
