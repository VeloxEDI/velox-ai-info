---
title: varInt64
description: Identifies a signed 64-bit Variant integer whose exact values can exceed script LongInt and Double precision boundaries.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, int64, integer]
---

```Delphi
varInt64 = 20
```

### Example

```Delphi
function HasInt64Storage(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varInt64;
end;
```

### Usage

`varInt64` identifies a signed 64-bit Variant integer whose exact values can exceed script LongInt and Double precision boundaries.

### Additional Technical Info
`varInt64` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0014` for a signed 64-bit integer from -9,223,372,036,854,775,808 through 9,223,372,036,854,775,807.

The tag matters when source values exceed 32-bit script `LongInt` range. Do not route identifiers, counters or monetary minor units through [`varDouble`](varDouble.md): Double cannot represent every integer above 2^53 exactly. Use an Int64-capable operation or validated decimal text when a script API narrows the value.

An ordinary Delphi `Variant` created from Int64 uses `varInt64`. The separate `OleVariant` conversion path also preserves Int64 while `OleVariantInt64AsDouble` remains at its default false; native host code can change that process-global for legacy Automation compatibility, causing an Automation-bound Int64 to become Double. A COM boundary can therefore alter representation even when the original Variant was Int64.

[`VarAsType`](../../Functions/Variant/VarAsType.md) can request `varInt64`; fractional, invalid or out-of-range sources can round, reject or raise. `PackVarCreation` can give smaller values a narrower integer tag, so exact type equality is not a general “is integer” test.

Mask [`VarType`](../../Functions/Variant/VarType.md) when flags may be present. Validate range before assigning to a narrower script, database or partner field.

The example is source-reviewed only; no 64-bit conversion was executed.

**External references**

- [Embarcadero `Int64`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Int64)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varInt64`](https://www.freepascal.org/docs-html/rtl/system/varint64.html)

<small>Created 2026-07-15</small>
