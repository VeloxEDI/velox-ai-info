---
title: varShortInt
description: Identifies a signed 8-bit Variant integer that can be selected automatically by Delphi's packed numeric creation.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, shortint, integer]
---

```Delphi
varShortInt = 16
```

### Example

```Delphi
function HasSignedByteStorage(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varShortInt;
end;
```

### Usage

`varShortInt` identifies a signed 8-bit Variant integer that can be selected automatically by Velox's packed numeric creation.

### Additional Technical Info
`varShortInt` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0010` for a signed 8-bit integer (-128..127).

With Delphi's default `PackVarCreation=True`, a value created from a suitably ranged signed type can retain this compact tag. The same number supplied as a normal script integer may instead be [`varInteger`](varInteger.md), so the exact code describes storage rather than a different mathematical kind.

[`VarAsType`](../../Functions/Variant/VarAsType.md) can request `varShortInt`. Validate range and integrality first: negative values below -128, values above 127, invalid text or fractional numeric input can cause narrowing, rounding or a Variant conversion/range/overflow exception depending on the source operation.

Automation compatibility settings can remap unsigned arguments to signed representations, but that does not make signed and unsigned byte contracts interchangeable. Preserve whether a protocol field is signed.

[`VarType`](../../Functions/Variant/VarType.md) performs no conversion. Mask flags before a base comparison.

The example is source-reviewed only; no narrowing conversion was executed.

**External references**

- [Embarcadero `ShortInt`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.ShortInt)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varShortInt`](https://www.freepascal.org/docs-html/rtl/system/varshortint.html)

<small>Created 2026-07-15</small>
