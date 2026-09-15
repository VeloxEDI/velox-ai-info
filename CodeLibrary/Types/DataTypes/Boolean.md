---
title: Boolean
description: Represents PascalScript's two logical values False and True with ordinals zero and one.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, boolean, 'true', 'false', condition]
---

```Delphi
Boolean = (False, True)
```

### Example

```Delphi
procedure SetReady(IsValid: Boolean; var Ready: Boolean);
begin
  Ready := IsValid and (not Ready);
end;
```

### Usage

`Boolean` represents Velox scripting's two logical values False and True with ordinals zero and one.

### Additional Technical Info
`Boolean` is the default PascalScript logical type. `False` has ordinal 0 and `True` has ordinal 1. Conditions, `and`, `or`, `xor` and `not` operate on logical values.

The two values have dedicated reference pages:

- [`False`](../../Constants/Enumeration/False.md) represents an unsatisfied condition and has ordinal zero.
- [`True`](../../Constants/Enumeration/True.md) represents a satisfied condition and has ordinal one.

**Velox compiler behaviour**

Velox's modified PascalScript compiler creates this built-in type with `AddTypeS('Boolean', '(False, True)')`. The values are therefore enum members supplied by the scripting language, not ordinary Velox-imported `LongInt` constants.

Velox also enables PascalScript's Boolean short-circuit option. When operands are Boolean, the right side of `False and RightExpression` and `True or RightExpression` is skipped because it cannot change the result. Do not place a required side effect in such a right-hand expression.

Do not use a Boolean as an undocumented integer flag or assume that any nonzero external value is automatically valid Boolean input. Native Delphi APIs also expose `ByteBool`, `WordBool`, `LongBool` and COM `VARIANT_BOOL` representations, but those are separate hidden/native interop types. Runtime importers are responsible for adapting them.

A `Variant` containing a Boolean is dynamically tagged; it is not the same as a statically typed Boolean variable. Test Null/Empty before converting a Variant to Boolean because conversion can raise or apply text/numeric conversion rules.

Use explicit Boolean names for configuration intent. When reading numeric/database flags, validate the accepted values and convert deliberately so invalid values are not silently treated as true.

The ordinal values overlap the Velox comparison-result constants: [`Same`](../../Constants/Enumeration/Same.md) is numeric zero and [`MoreThan`](../../Constants/Enumeration/MoreThan.md) is numeric one. They are not Boolean aliases. Preserve the domain explicitly, especially when a `Variant` or external serialization no longer communicates the declared type.

The example is source-reviewed only; no script was executed.

**External references**

- [Embarcadero Boolean types](https://docwiki.embarcadero.com/RADStudio/en/Boolean_Types_(Delphi)) - Delphi logical type semantics.
- [Free Pascal Boolean types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible Boolean language model.

<small>Created 2026-07-15</small>
