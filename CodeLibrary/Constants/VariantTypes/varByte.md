---
title: varByte
description: Identifies an unsigned 8-bit Variant integer and the Automation-safe element type commonly used for binary byte arrays.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, byte, binary]
---

```Delphi
varByte = 17
```

### Example

```Delphi
function IsByteValue(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varByte;
end;
```

### Usage

`varByte` identifies an unsigned 8-bit Variant integer and the Automation-safe element type commonly used for binary byte arrays.

### Additional Technical Info
`varByte` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0011` for an unsigned 8-bit integer in the range 0..255. It is also the preferred Automation element type for raw binary data when combined with [`varArray`](varArray.md).

Delphi normally packs a newly created numeric Variant to the smallest applicable type while the process-global `PackVarCreation` setting is true. Consequently, a small positive value may report `varByte`, while the same numeric value produced by another cast/provider may report `varInteger`, `varWord` or another compatible tag. Test the exact code only when representation matters.

[`VarAsType`](../../Functions/Variant/VarAsType.md) with `varByte` performs a conversion. Negative values, values above 255, non-integral numbers and invalid text can round, reject or raise a Variant conversion/range/overflow exception according to the source operation; validate business input before narrowing.

For `varArray or varByte`, the flag identifies Automation byte-array storage, not a script `TBytes`. Bound allocations and indexes, and use the approved Variant-array access functions rather than assuming a raw pointer or zero-copy representation.

Type inspection performs no conversion or I/O. Mask before testing when flags may be present.

The example is source-reviewed only; no numeric cast or array allocation was executed.

**External references**

- [Embarcadero `VarArrayCreate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayCreate)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varByte`](https://www.freepascal.org/docs-html/rtl/system/varbyte.html)

<small>Created 2026-07-15</small>
