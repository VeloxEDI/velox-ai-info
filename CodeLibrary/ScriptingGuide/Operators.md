---
title: Operators
description: Assignment, Boolean, relational, arithmetic, string and unary operators available to Velox scripts.
sidebar_position: 10
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - operators
  - expressions
  - pascal
---

Operators combine or transform values inside an expression. The generated child topics cover assignment, Boolean, relational, arithmetic, string and unary operations supported by the current scripting compiler.

## Core distinction

```Delphi
Value := Total + Tax;       // assignment uses :=
if Value = Expected then   // equality comparison uses =
  LogInfo('Matched');
```

The source-reviewed example shows the most important Pascal distinction: `:=` stores a result, while `=` compares two operands.

## Evaluation

Operator precedence determines grouping. Unary operations bind tightly; multiplication/division-class operations bind before addition-class operations; relational operations bind later. Use parentheses when a business rule would otherwise depend on remembering precedence.

Velox explicitly enables Boolean short-circuit evaluation. In `A and B`, `B` is not evaluated when `A` is false. In `A or B`, `B` is not evaluated when `A` is true. This is useful for guards:

```Delphi
if Assigned(DATA_Order) and not DATA_Order.EOF then
  Value := DATA_Order['OrderNumber'].Value;
```

The second operand is not evaluated when the object is unavailable. The exact configured variable remains context-specific.

## Types and Variants

The operand types determine the operation and result. `+` can add numeric values or concatenate compatible strings. `and`, `or`, `xor` and `not` can be Boolean or bitwise depending on registered types. `/`, `div` and `mod` have different numeric result rules.

Variant operands defer type selection and conversion until runtime. A comparison with `Null` can return a Null Variant rather than an ordinary Boolean; use `VarIsNull`. Arithmetic can overflow, divide by zero or raise a type conversion error. String comparison can be case-, locale- or helper-specific; use a documented comparison function when those semantics matter.

## Common mistakes

- Using `=` where `:=` is required.
- Relying on implicit precedence in a long business expression.
- Comparing a Variant directly with `Null`.
- Using `/` when integer `div` was intended, or assuming negative `div`/`mod` behaviour without checking the exact compiler/runtime rule.
- Calling a side-effecting function in a Boolean operand without accounting for short-circuiting.
- Assuming `+` concatenates every non-string value automatically.

## Edge cases and quirks

- The PascalScript parser and runtime are the authority for Velox. Current Delphi and Free Pascal have additional operators and dialect differences that may not apply.
- Short-circuiting is set by Velox's compiler options rather than left to a script directive.
- Expression errors can be compile-time type mismatches or runtime Variant/conversion errors depending on operand types.
- Parentheses document intent and protect the expression from a later change that introduces an operator with different precedence.

## Related reference

- **Testing values** — Null and Variant-safe guards.
- **Statements** — assignments and conditional/loop expressions.
- **Functions** — calls used as operands and their side effects.

## External references

- [Free Pascal: Expressions](https://www.freepascal.org/docs-html/ref/refch12.html)
- [Embarcadero DocWiki: Expressions (Delphi)](https://docwiki.embarcadero.com/RADStudio/Athens/en/Expressions_%28Delphi%29)
