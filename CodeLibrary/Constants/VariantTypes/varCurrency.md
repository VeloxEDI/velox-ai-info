---
title: varCurrency
description: Identifies a Variant Currency value stored as a signed 64-bit integer scaled by 10,000 for exact four-decimal arithmetic.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, currency, decimal]
---

```Delphi
varCurrency = 6
```

### Example

```Delphi
function HasCurrencyStorage(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varCurrency;
end;
```

### Usage

`varCurrency` identifies a Variant Currency value stored as a signed 64-bit integer scaled by 10,000 for exact four-decimal arithmetic.

### Additional Technical Info
`varCurrency` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0006`. The payload is Delphi `Currency`: a signed 64-bit integer scaled by 10,000, giving exact storage to four decimal places over approximately -922 trillion to +922 trillion.

This representation is usually safer than binary floating point for monetary values that fit its range and scale. It is not an arbitrary-precision decimal and cannot preserve more than four fractional digits. Conversion from `Double`, text or database decimal values can round, overflow or reject according to Delphi Variant conversion rules.

**Integration guidance**

- Establish the currency, rounding mode and permitted scale in the mapping contract; the type code supplies none of them.
- Avoid converting through [`varDouble`](varDouble.md) merely for arithmetic or formatting, because binary floating point can introduce representation error.
- Use [`VarAsType`](../../Functions/Variant/VarAsType.md) deliberately when the destination must have this tag, and handle conversion exceptions.
- Null/Empty and text parsing require explicit policy. Locale-sensitive text conversion is unsuitable for a machine interchange format unless the locale is governed.

The raw code can also include array/by-reference flags. [`VarType`](../../Functions/Variant/VarType.md) itself performs no conversion; mask to inspect the base type.

The example is source-reviewed only; no monetary conversion or calculation was executed.

**External references**

- [Embarcadero `Currency`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Currency)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varCurrency`](https://www.freepascal.org/docs-html/rtl/system/varcurrency.html)

<small>Created 2026-07-15</small>
