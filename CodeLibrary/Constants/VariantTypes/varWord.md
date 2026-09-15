---
title: varWord
description: Identifies an unsigned 16-bit Variant integer whose upper half exceeds signed SmallInt range.
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, word, uint16]
---

```Delphi
varWord = 18
```

### Example

```Delphi
function HasUnsigned16Storage(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varWord;
end;
```

### Usage

`varWord` identifies an unsigned 16-bit Variant integer whose upper half exceeds signed SmallInt range.

### Additional Technical Info
`varWord` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0012` for an unsigned 16-bit integer (0..65,535).

It is distinct from signed [`varSmallInt`](varSmallInt.md): values 32,768..65,535 require the unsigned range, while negative values cannot be Word. Delphi's packed Variant creation can choose [`varByte`](varByte.md) for smaller unsigned values, so exact tags vary with source and range.

[`VarAsType`](../../Functions/Variant/VarAsType.md) with `varWord` narrows/converts the source. Validate that the value is integral and within range; negative, fractional, invalid-text or oversized input can round, reject or raise a Variant conversion/range/overflow exception.

Current Delphi Automation dispatch can remap Word arguments to a signed `varSmallInt` code when the host-global `DispatchUnsignedAsSigned` compatibility setting is enabled. Values above 32,767 cannot preserve meaning through that remapping; make the external interface's signedness explicit.

[`VarType`](../../Functions/Variant/VarType.md) only reads the raw tag. Mask flags before base comparison.

The example is source-reviewed only; no unsigned conversion or dispatch occurred.

**External references**

- [Embarcadero `Word`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Word)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varWord`](https://www.freepascal.org/docs-html/rtl/system/varword.html)

<small>Created 2026-07-15</small>
