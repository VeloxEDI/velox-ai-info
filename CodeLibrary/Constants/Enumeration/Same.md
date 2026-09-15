---
title: Same
description: Identifies the zero ordering result returned when a Velox numeric comparison treats two values as equal within tolerance.
sidebar_position: 185
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - constant
  - comparison
  - ordering
  - equality
  - epsilon
---

```Delphi
Same = 0
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Relationship: Integer;
begin
  Relationship := CompareValueEpsilon(10.0, 10.04, 0.05);

  if Relationship = Same then
    Value := 'Within tolerance';
end;
```

### Usage

`Same` identifies the zero ordering result returned when a Velox numeric comparison treats two values as equal within tolerance.

**Meaning of the result**

For finite values and a valid tolerance, `Same` means the absolute difference falls within an inclusive equality band. It means approximate equality under the chosen comparison, not bit-for-bit identity and not equality after decimal rounding.

- [`CompareValue`](../../Functions/Comparison/CompareValue.md) passes no epsilon, causing Velox to calculate a magnitude- and platform-dependent default.
- [`CompareValueEpsilon`](../../Functions/Comparison/CompareValueEpsilon.md) passes the script's absolute tolerance. A difference exactly equal to a positive epsilon still returns `Same`.
- Passing epsilon zero selects Velox's calculated default rather than exact numeric equality.

### Additional Technical Info
`Same` is the `LongInt` result code for the equal branch of Velox's three-way numeric comparison. In the example, the difference is inside the explicit `0.05` boundary, so [`CompareValueEpsilon`](../../Functions/Comparison/CompareValueEpsilon.md) returns zero and `Value` becomes `Within tolerance`. The example is source-reviewed and is not executed by the documentation workflow.

**Registration and implementation**

`vxCommonNumber` declares `Same` as zero, and the PascalScript compile-time import registers it as a `LongInt` constant. It has no mutable storage or runtime callback.

Velox delegates its three-way comparison functions to Delphi `System.Math.CompareValue`. Delphi defines `TValueRelationship` as `-1..1` and its equal member `EqualsValue` as zero. `Same` mirrors that result under a Velox-oriented name. Active native code returns this value through `CompareValue`; no active branch directly references the `Same` identifier itself.

**Edge cases and quirks**

- `Same` shares its numeric value with Boolean [`False`](False.md), but it is an ordering code. `if Relationship = Same` is clear; `if not Relationship` is not a valid or maintainable substitute.
- `NaN` values do not enter Delphi's equality branch. Equal same-signed infinities also subtract to `NaN` and are not classified as `Same` by the current implementation.
- With the calculated default tolerance, opposite infinities can produce an infinite tolerance and can classify as `Same`. Do not use the floating comparison as a total ordering for exceptional values.
- A negative or `NaN` explicit epsilon disables conventional equality, including for equal finite values. Validate a configurable epsilon before use.
- Default tolerance can vary with Delphi platform because `Extended` precision differs.

**Type and conversion boundaries**

The imported constant is `LongInt`, while Delphi's native return type is the bounded `TValueRelationship`. Accept only the documented `LessThan`, `Same` and `MoreThan` values when consuming a stored or dynamic relationship result.

**Side effects**

None. The constant is resolved at script compile time.

**Errors**

Referencing `Same` does not raise. Invalid numeric conversion can fail before a comparison produces the result.

**Performance and concurrency**

Reading the constant is allocation-free and has no shared mutable state.

**Related entries**

- [`LessThan`](LessThan.md) is the negative/lower result.
- [`MoreThan`](MoreThan.md) is the positive/greater result.
- [`SameValue`](../../Functions/Comparison/SameValue.md) returns the equality branch as a Boolean.
- [`SameValueEpsilon`](../../Functions/Comparison/SameValueEpsilon.md) accepts an explicit tolerance.

**External references**

- [Embarcadero `System.Math.CompareValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.CompareValue)
- [Embarcadero `System.Types.TValueRelationship`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Types.TValueRelationship)
- [Free Pascal `CompareValue`](https://www.freepascal.org/docs-html/rtl/math/comparevalue.html) - compatibility reference; current Delphi source defines Velox's exact result.

<small>Created 2026-07-15</small>
