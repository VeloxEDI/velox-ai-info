---
title: 'False'
description: Represents the Boolean false condition and the zero-valued member of PascalScript's Boolean type.
sidebar_position: 43
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - constant
  - boolean
  - 'false'
  - condition
---

```Delphi
False = 0
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  IsReady: Boolean;
begin
  IsReady := False;

  if not IsReady then
    Value := 'Not ready';
end;
```

### Usage

Represents the Boolean false condition and the zero-valued member of Velox scripting's Boolean type.

**Conditions and short-circuiting**

An `if`, `while` or Boolean expression treats `False` as the unsatisfied branch. Velox uses short-circuit Boolean evaluation. For Boolean operands:

- `False and RightExpression` does not need to evaluate `RightExpression`;
- `False or RightExpression` must evaluate `RightExpression` to determine the result; and
- `not False` evaluates to `True`.

Do not put required side effects in the right-hand side of an `and` expression, because they will not run when the left side is `False`.

### Additional Technical Info
`False` is the negative member of PascalScript's [`Boolean`](../../Types/DataTypes/Boolean.md) type. Use it for a logical condition that is not satisfied, a disabled switch or the initial state of a Boolean flag.

The example assigns a genuine Boolean value, so the `not` expression evaluates to `True` and sets `Value` to `Not ready`. It is source-reviewed and is not executed by the documentation workflow.

**Type and value**

Velox's modified PascalScript compiler creates the type as `Boolean = (False, True)`. `False` is therefore an enum member with ordinal zero, not a Velox-imported mutable variable and not merely an untyped numeric macro.

The compiler can use the ordinal representation internally, and converting a Boolean to an ordinal context produces zero for `False`. Keep the logical type in normal script code; its storage representation is not a good substitute for a documented integer or database flag contract.

**Conversion boundaries**

- `False` and the Velox comparison constant [`Same`](Same.md) both have a numeric representation of zero, but they express different domains. Use `Same` when testing the result of `CompareValue`; use `False` for a Boolean condition.
- A `Variant` can hold a Boolean, integer, string, `Null` or `Empty`. Test dynamic values and convert them deliberately rather than assuming every zero-like value is a Boolean `False`.
- Database and configuration flags may use `0`/`1`, `Y`/`N` or other conventions. Validate that external contract before assigning a Boolean.

**Side effects**

None. `False` is a compile-time language value.

**Errors**

Referencing `False` itself does not raise. Conversion of an incompatible dynamic or textual value to `Boolean` can fail before the assignment or condition is evaluated.

**Performance and concurrency**

Reading the value requires no allocation, I/O or shared mutable state. Short-circuiting can avoid evaluation of the right operand.

**Related entries**

- [`True`](True.md) is the other `Boolean` member.
- [`Boolean`](../../Types/DataTypes/Boolean.md) defines the logical type.
- [`Same`](Same.md) is the numeric zero result of Velox comparison functions; it is not a Boolean alias.
- [`Boolean operators`](../../ScriptingGuide/Operators/Boolean.md) explains logical expressions.

**External references**

- [Embarcadero Boolean types](https://docwiki.embarcadero.com/RADStudio/en/Boolean_Types_(Delphi))
- [Free Pascal Boolean types](https://www.freepascal.org/docs-html/ref/refsu4.html)

<small>Created 2026-07-15</small>
