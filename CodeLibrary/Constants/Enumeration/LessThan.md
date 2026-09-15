---
title: LessThan
description: Identifies the negative ordering result returned when a Velox numeric comparison places the left value below the right value.
sidebar_position: 161
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - constant
  - comparison
  - ordering
  - less-than
---

```Delphi
LessThan = -1
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Relationship: Integer;
begin
  Relationship := CompareValue(9.5, 10.0);

  if Relationship = LessThan then
    Value := 'Below target';
end;
```

### Usage

`LessThan` identifies the negative ordering result returned when a Velox numeric comparison places the left value below the right value.

**Meaning of the result**

For ordinary finite inputs, a result of `LessThan` means the left operand is below the right operand after applying the comparison's equality tolerance. It does not necessarily mean the raw Pascal expression `A < B` is sufficient: values within the inclusive tolerance band return [`Same`](Same.md).

- [`CompareValue`](../../Functions/Comparison/CompareValue.md) omits epsilon, so Velox calculates a magnitude- and platform-dependent default tolerance.
- [`CompareValueEpsilon`](../../Functions/Comparison/CompareValueEpsilon.md) uses the explicit absolute tolerance supplied by the script; zero still selects Velox's calculated default.

### Additional Technical Info
`LessThan` is the `LongInt` result code for the lower branch of Velox's three-way numeric comparison. The example receives `-1` from [`CompareValue`](../../Functions/Comparison/CompareValue.md) and sets `Value` to `Below target`. It is source-reviewed and is not executed by the documentation workflow.

**Registration and implementation**

`vxCommonNumber` declares the value as `-1`. The PascalScript compile-time import registers it as a `LongInt` constant with enumeration classification; it has no mutable storage and needs no runtime function registration.

Velox's `CompareValue` and `CompareValueEpsilon` functions call Delphi's `System.Math.CompareValue`. Delphi returns a `TValueRelationship` in the range `-1..1`; `LessThan` deliberately mirrors its `LessThanValue` value. `LessThanValue` and `LessThanValueEpsilon` compare the Delphi result with this exact constant.

**Edge cases and quirks**

- The constant represents a result; it does not perform a comparison by itself.
- A difference exactly equal to a valid positive epsilon is classified as `Same`, not `LessThan`.
- With a `NaN` operand, Delphi's same test and `<` branch do not produce `LessThan`; the current implementation falls through to the greater result. Validate finite values when a total mathematical ordering is required.
- Default-tolerance results can differ between Win32 and Win64 because Delphi's `Extended` precision and resolution differ.
- Do not use `LessThan` as a generic negative status, sort callback result or error code unless that consumer explicitly accepts the Velox comparison contract.

**Type and conversion boundaries**

The imported type is `LongInt`, even though the value corresponds to Delphi's bounded `TValueRelationship`. Store it in `Integer`, `LongInt` or a carefully validated `Variant`; an arbitrary negative value is not automatically `LessThan`.

**Side effects**

None. The constant is resolved at script compile time.

**Errors**

Referencing the constant does not raise. The comparison that produces it can fail earlier if a dynamic input cannot convert to the required numeric type.

**Performance and concurrency**

Reading the constant is allocation-free and has no shared mutable state.

**Related entries**

- [`Same`](Same.md) is the zero/equal result.
- [`MoreThan`](MoreThan.md) is the positive/greater result.
- [`LessThanValue`](../../Functions/Comparison/LessThanValue.md) exposes this branch as a Boolean.
- [`LessThanValueEpsilon`](../../Functions/Comparison/LessThanValueEpsilon.md) exposes it with an explicit tolerance.

**External references**

- [Embarcadero `System.Math.CompareValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.CompareValue)
- [Embarcadero `System.Types.TValueRelationship`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Types.TValueRelationship)
- [Free Pascal `CompareValue`](https://www.freepascal.org/docs-html/rtl/math/comparevalue.html) - compatibility reference; current Delphi source defines Velox's exact result.

<small>Created 2026-07-15</small>
