---
title: varSingle
description: Identifies a 32-bit binary floating-point Variant with substantially less precision and range than varDouble.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, single, floating-point]
---

```Delphi
varSingle = 4
```

### Example

```Delphi
function HasSingleStorage(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varSingle;
end;
```

### Usage

`varSingle` identifies a 32-bit binary floating-point Variant with substantially less precision and range than varDouble.

### Additional Technical Info
`varSingle` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0004` for a 32-bit binary floating-point payload, with roughly 6-9 significant decimal digits. It can represent signed zero, infinity and NaN as well as finite values.

Converting a [`varDouble`](varDouble.md), Int64, Currency or precise decimal text to Single can lose significant digits, overflow to a special value or raise. Most decimal fractions are not exact even when in range. Do not use this representation for money, identifiers, hashes or precision-sensitive totals.

Exact tag checking is a storage test. Delphi may create a different numeric type depending on the source and `PackVarCreation`; arithmetic can also promote the result. Validate semantic range/precision and explicitly convert only when a receiving interface requires Single.

[`VarAsType`](../../Functions/Variant/VarAsType.md) requests the conversion; [`VarType`](../../Functions/Variant/VarType.md) merely reads the raw tag. Mask array/reference flags before comparing the base code.

When serialising, establish how NaN and infinities are handled because many database, JSON and partner formats reject them.

The example is source-reviewed only; no floating-point conversion was executed.

**External references**

- [Embarcadero `Single`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Single)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varSingle`](https://www.freepascal.org/docs-html/rtl/system/varsingle.html)

<small>Created 2026-07-15</small>
