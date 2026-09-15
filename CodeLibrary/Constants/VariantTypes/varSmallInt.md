---
title: varSmallInt
description: Identifies a signed 16-bit Variant integer that Delphi may select as the smallest type for a source value.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, smallint, integer]
---

```Delphi
varSmallInt = 2
```

### Example

```Delphi
function HasSigned16Storage(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varSmallInt;
end;
```

### Usage

`varSmallInt` identifies a signed 16-bit Variant integer that Velox may select as the smallest type for a source value.

### Additional Technical Info
`varSmallInt` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0002` for a signed 16-bit integer (-32,768..32,767).

With Delphi's default `PackVarCreation=True`, Variant construction can select a compact integer tag that reflects the source type/range. The same number can therefore be [`varShortInt`](varShortInt.md), `varSmallInt`, [`varInteger`](varInteger.md) or another compatible representation. Exact tag equality is not a complete numeric-family test.

[`VarAsType`](../../Functions/Variant/VarAsType.md) with `varSmallInt` narrows/converts the source. Validate range and integrality before doing so; invalid text, fractional values and numbers outside the 16-bit range can round, reject or raise a conversion/range/overflow exception.

Do not confuse the code with unsigned [`varWord`](varWord.md). Values 32,768..65,535 fit Word but not SmallInt, while negative SmallInt values cannot be Word.

[`VarType`](../../Functions/Variant/VarType.md) only reads the raw tag. Mask away flags for a base comparison.

The example is source-reviewed only; no conversion was executed.

**External references**

- [Embarcadero `SmallInt`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SmallInt)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varSmallInt`](https://www.freepascal.org/docs-html/rtl/system/varsmallint.html)

<small>Created 2026-07-15</small>
