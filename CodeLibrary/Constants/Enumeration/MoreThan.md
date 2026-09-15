---
title: MoreThan
description: Identifies the positive ordering result returned when a Velox numeric comparison places the left value above the right value.
sidebar_position: 173
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - constant
  - comparison
  - ordering
  - greater-than
---

```Delphi
MoreThan = 1
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Relationship: Integer;
begin
  Relationship := CompareValue(10.5, 10.0);

  if Relationship = MoreThan then
    Value := 'Above target';
end;
```

### Usage

`MoreThan` identifies the positive ordering result returned when a Velox numeric comparison places the left value above the right value.

**Meaning of the result**

For ordinary finite inputs, `MoreThan` means the left operand is above the right operand by more than the comparison's equality tolerance. Values inside or exactly on the inclusive tolerance boundary produce [`Same`](Same.md), not `MoreThan`.

- [`CompareValue`](../../Functions/Comparison/CompareValue.md) uses Velox's calculated default tolerance.
- [`CompareValueEpsilon`](../../Functions/Comparison/CompareValueEpsilon.md) uses the supplied absolute tolerance; zero requests the calculated default.

### Additional Technical Info
`MoreThan` is the `LongInt` result code for the upper branch of Velox's three-way numeric comparison. The example receives `1` from [`CompareValue`](../../Functions/Comparison/CompareValue.md) and sets `Value` to `Above target`. It is source-reviewed and is not executed by the documentation workflow.

**Registration and implementation**

`vxCommonNumber` declares the value as one. The PascalScript compile-time import registers it as a `LongInt` constant with enumeration classification; it has no mutable storage and no runtime function registration.

Velox's comparison wrappers call Delphi `System.Math.CompareValue`. The native routine returns a `TValueRelationship` in the range `-1..1`; `MoreThan` mirrors Delphi's `GreaterThanValue`. `MoreThanValue` and `MoreThanValueEpsilon` test the native result against this exact Velox constant.

**Edge cases and quirks**

- The constant labels a return branch and does not perform a comparison itself.
- Current Delphi logic tests approximate equality, then `A < B`, and otherwise returns the greater result. Consequently a `NaN` operand can produce `MoreThan` even though no mathematical greater-than relationship exists.
- Equal same-signed infinities can also reach the `MoreThan` fallback because their difference is `NaN`. Opposite infinities have separate default-tolerance surprises. Validate finiteness for strict ordering.
- A negative or `NaN` explicit epsilon can prevent equal finite operands from entering the same branch; because `<` is then false, equal operands can return `MoreThan`.
- Default-tolerance boundaries can differ between Win32 and Win64 due to Delphi `Extended` precision.

**Type and conversion boundaries**

`MoreThan` and Boolean [`True`](True.md) both have numeric representation one, but their meanings and intended types differ. Use `Relationship = MoreThan` for a comparison code and use `True` for a logical value. An arbitrary positive value is not automatically `MoreThan`.

**Side effects**

None. The constant is resolved at script compile time.

**Errors**

Referencing the constant does not raise. Dynamic input conversion can fail before a comparison returns it.

**Performance and concurrency**

Reading the constant is allocation-free and has no shared mutable state.

**Related entries**

- [`LessThan`](LessThan.md) is the negative/lower result.
- [`Same`](Same.md) is the zero/equal result.
- [`MoreThanValue`](../../Functions/Comparison/MoreThanValue.md) exposes this branch as a Boolean.
- [`MoreThanValueEpsilon`](../../Functions/Comparison/MoreThanValueEpsilon.md) exposes it with an explicit tolerance.

**External references**

- [Embarcadero `System.Math.CompareValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.CompareValue)
- [Embarcadero `System.Types.TValueRelationship`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Types.TValueRelationship)
- [Free Pascal `CompareValue`](https://www.freepascal.org/docs-html/rtl/math/comparevalue.html) - compatibility reference; current Delphi source defines Velox's exact result.

<small>Created 2026-07-15</small>
