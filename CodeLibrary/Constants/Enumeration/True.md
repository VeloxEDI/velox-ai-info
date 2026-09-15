---
title: 'True'
description: Represents the Boolean true condition and the one-valued member of PascalScript's Boolean type.
sidebar_position: 189
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - constant
  - boolean
  - 'true'
  - condition
---

```Delphi
True = 1
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  IncludeRecord: Boolean;
begin
  IncludeRecord := True;

  if IncludeRecord then
    Value := 'Included';
end;
```

### Usage

Represents the Boolean true condition and the one-valued member of Velox scripting's Boolean type.

**Conditions and short-circuiting**

An `if`, `while` or Boolean expression treats `True` as the satisfied branch. Velox uses short-circuit Boolean evaluation. For Boolean operands:

- `True or RightExpression` does not need to evaluate `RightExpression`;
- `True and RightExpression` must evaluate `RightExpression` to determine the result; and
- `not True` evaluates to `False`.

Do not rely on a function call in the right-hand side of an `or` expression for a required side effect, because it will not run when the left side is `True`.

### Additional Technical Info
`True` is the affirmative member of PascalScript's [`Boolean`](../../Types/DataTypes/Boolean.md) type. Use it when a logical condition is satisfied or when explicitly enabling a Boolean option.

The example takes the `if` branch and sets `Value` to `Included`. It is source-reviewed and is not executed by the documentation workflow.

**Type and value**

Velox's modified PascalScript compiler creates `Boolean` from `(False, True)`. `True` is consequently the enum member with ordinal one. It is a built-in language value, not a Velox-imported mutable variable or a general-purpose numeric flag.

Although converting the enum member to an ordinal context produces one, keep it Boolean in ordinary script logic. External systems may use other true representations, and native Delphi also has interop Boolean types with different sizes or true bit patterns.

**Conversion boundaries**

- `True` and the Velox comparison constant [`MoreThan`](MoreThan.md) both have numeric representation one, but one is logical and the other is an ordering code. Do not substitute one name for the other.
- Do not assume every nonzero integer, nonempty string or populated `Variant` is automatically a valid Boolean. Validate and convert dynamic input explicitly.
- When exporting a Boolean to a database, text file or API, map it to the exact representation required by that target rather than relying on the internal ordinal.

**Side effects**

None. `True` is a compile-time language value.

**Errors**

Referencing `True` itself does not raise. Invalid conversion from a dynamic value can fail before a Boolean assignment or expression is evaluated.

**Performance and concurrency**

Reading the value requires no allocation, I/O or shared mutable state. Short-circuiting can avoid evaluation of the right operand.

**Related entries**

- [`False`](False.md) is the other `Boolean` member.
- [`Boolean`](../../Types/DataTypes/Boolean.md) defines the logical type.
- [`MoreThan`](MoreThan.md) is the numeric one result used by Velox comparison functions; it is not a Boolean alias.
- [`Boolean operators`](../../ScriptingGuide/Operators/Boolean.md) explains logical expressions.

**External references**

- [Embarcadero Boolean types](https://docwiki.embarcadero.com/RADStudio/en/Boolean_Types_(Delphi))
- [Free Pascal Boolean types](https://www.freepascal.org/docs-html/ref/refsu4.html)

<small>Created 2026-07-15</small>
