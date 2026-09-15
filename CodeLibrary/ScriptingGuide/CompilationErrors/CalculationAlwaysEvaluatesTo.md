---
title: "Calculation always evaluates to"
description: "Meaning of the constant-result compiler warning and how to review the expression."
sidebar_position: 4
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - warning
  - boolean
---

This warning says that a Boolean `and` or `or` expression has a result fixed by a literal operand, regardless of the other operand. The formatted message includes that result, for example `Calculation always evaluates to False`.

Compilation can still succeed because this is a Warning, not an Error. It should nevertheless be reviewed: the expression may contain a typo, unreachable condition or side effect that will not run.

## Triggering forms

The current compiler emits this warning for these four patterns:

```Delphi
False and Expression  // Always False
Expression and False  // Always False
True or Expression    // Always True
Expression or True    // Always True
```

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  IsValid: Boolean;
begin
  IsValid := not VarIsNull(Value);
  if IsValid and False then // Warning: always evaluates to False
    Value := 'accepted';
end;
```

If the literal was accidental, use the intended condition:

```Delphi
if IsValid and (Value <> '') then
  Value := 'accepted';
```

If the literal is intentional temporary control logic, remove the dead expression and make that decision explicit in source control rather than retaining a misleading calculation.

## How Velox detects it

During compile-time result-type analysis, the modified PascalScript compiler recognises Boolean literals participating in `and` or `or`. It emits `ewCalculationAlwaysEvaluatesTo` with `True` or `False` as the message parameter. This is a compiler warning; it is not a runtime observation about actual Velox data.

Velox compiles with Boolean short-circuit evaluation enabled. Consequently, an operand whose value cannot affect the result may not be evaluated at runtime. Do not rely on a function call, property access or other side effect placed in that operand.

## Common causes

- A debugging literal such as `and False` left in production code.
- Using `or True` where a second comparison was intended.
- A generated expression that failed to substitute one condition.
- Assuming every operand is evaluated even when the result is already known.
- Confusing Boolean operators with bitwise operations on integers; this particular warning is emitted for Boolean result analysis.

## Review procedure

1. Read the result included in the warning.
2. Identify the literal operand that fixes that result.
3. Decide whether the other operand is genuinely unnecessary or whether the literal is wrong.
4. Remove the redundant branch or replace the literal with the intended expression.
5. Check the skipped operand for calls or property access whose side effects were mistakenly expected.

## Related reference

- `Boolean` — Boolean operators and short-circuit behaviour.
- `if` and `if..else` — branch selection from Boolean conditions.
- `Is not needed` — the companion warning for a redundant Boolean operand.

## External references

- [Free Pascal: Boolean operators](https://www.freepascal.org/docs-html/current/ref/refsu46.html)
- [Embarcadero DocWiki: Expressions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Expressions_%28Delphi%29)
