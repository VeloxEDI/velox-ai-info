---
title: varInteger
description: Identifies a signed 32-bit Variant integer, while packed creation may choose narrower tags for the same numeric value.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, integer, longint]
---

```Delphi
varInteger = 3
```

### Example

```Delphi
function HasIntegerStorage(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varInteger;
end;
```

### Usage

`varInteger` identifies a signed 32-bit Variant integer, while packed creation may choose narrower tags for the same numeric value.

### Additional Technical Info
`varInteger` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0003` for a signed 32-bit integer (-2,147,483,648..2,147,483,647), corresponding to the current Delphi `Integer`/`LongInt` width.

The current Delphi Variant engine defaults `PackVarCreation` to true and may store a small integer using [`varByte`](varByte.md), [`varShortInt`](varShortInt.md), [`varWord`](varWord.md) or [`varSmallInt`](varSmallInt.md). The same mathematical value can therefore have a different exact tag depending on its source, declared range or explicit cast.

Use exact comparison when a provider's physical representation matters. For business numeric logic, accept the intended numeric family and then validate/convert to the required range. [`VarAsType`](../../Functions/Variant/VarAsType.md) with `varInteger` forces a conversion and can raise for invalid, fractional or overflowing sources.

Automation dispatch can also map some unsigned values to signed codes under Delphi's host-global compatibility setting. Do not persist `TVarType` values as a cross-system schema.

[`VarType`](../../Functions/Variant/VarType.md) only reads the code; mask away array/by-reference flags for base classification. Arithmetic can promote or change the resulting tag.

The example is source-reviewed only; no integer conversion was executed.

**External references**

- [Embarcadero `Integer`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Integer)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varInteger`](https://www.freepascal.org/docs-html/rtl/system/varinteger.html)

<small>Created 2026-07-15</small>
