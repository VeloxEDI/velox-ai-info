---
title: "is not needed"
description: "Meaning of the four redundant Boolean-literal warnings emitted by the Velox script compiler."
sidebar_position: 23
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

`is not needed` is a compiler warning, not an error. Velox has found a Boolean literal that does not change the result of an `and` or `or` expression and identifies the redundant text in the formatted message.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  IsValid: Boolean;
begin
  IsValid := Value <> '';
  if True and IsValid then // Warning: "True and" is not needed
    Value := 'valid';
end;
```

Remove the identity operand:

```Delphi
if IsValid then
  Value := 'valid';
```

## Exact warning forms

The current compiler emits only these four forms:

| Expression shape | Message parameter | Equivalent expression |
|---|---|---|
| `True and X` | `"True and"` | `X` |
| `X and True` | `"and True"` | `X` |
| `False or X` | `"False or"` | `X` |
| `X or False` | `"or False"` | `X` |

`False and X` and `True or X` instead produce the `Calculation always evaluates to` warning because the literal fixes the complete result.

## How Velox detects it

During expression type resolution and constant folding, the compiler checks Boolean `and` and `or` expressions when at least one operand is a compile-time value. It emits `ewIsNotNeeded` at the position of the redundant literal and continues compilation.

Velox enables short-circuit Boolean evaluation. Removing any of the four identity literals preserves both the logical result and evaluation of the meaningful operand: `X` is still the operand that must be evaluated to determine the expression.

## Edge cases and quirks

- The warning applies to Boolean operands. Integer bitwise `and`/`or` expressions are not this rule.
- `xor` has no identity warning in this implementation even though `X xor False` is logically `X`.
- A constant or alias that the compiler has already reduced to `True` or `False` can trigger the warning even when the source does not contain an obvious literal at first glance.
- The warning location belongs to the redundant constant operand, which may differ from the start of the complete expression.

## Related reference

- `Calculation always evaluates to` - a Boolean literal fixes the complete result.
- `Boolean` - operator precedence and short-circuit behaviour.

## External references

- [Free Pascal: Boolean operators](https://www.freepascal.org/docs-html/ref/refsu46.html)
- [Embarcadero DocWiki: Expressions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Expressions_%28Delphi%29)
