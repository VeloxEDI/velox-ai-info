---
title: "if"
description: "Conditional execution of one Velox script statement or compound block."
sidebar_position: 2
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - statements
  - conditions
---

Use `if` to execute one statement only when a Boolean expression evaluates to `True`.

## Syntax

```Delphi
if BooleanExpression then
  Statement;
```

For several statements, make the branch a compound statement:

```Delphi
if BooleanExpression then
begin
  Statement1;
  Statement2;
end;
```

## How it works

`TPSPascalCompiler.ProcessIf` compiles the expression between `if` and `then`, writes its result to the compiler's default Boolean temporary, and emits a conditional jump over the following statement when the result is false. The condition is evaluated once each time execution reaches the `if`.

The expression must be assignable to the script compiler's Boolean type. Numeric, string, object and Variant values are not a substitute for an explicit test merely because some host-language contexts might treat them as truthy. Compare values directly or call an appropriate registered test such as `VarIsNull`.

Velox enables Boolean short-circuit evaluation. In a Boolean `A and B`, `B` is skipped when `A` is false. In `A or B`, `B` is skipped when `A` is true. This applies to Boolean `and` and `or`; integer bitwise operations evaluate both operands.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if VarIsNull(Value) then
    Value := 'No value supplied';
end;
```

The assignment runs only for a Null Variant. Empty strings, numeric zero and `False` are distinct values and do not satisfy `VarIsNull`.

## Common mistakes

- Writing `if Value then` when `Value` is a Variant whose runtime content is not reliably Boolean. Use an explicit type/value test.
- Expecting an indented second line to belong to the `if`. Indentation is for readers; only one statement follows `then` unless `begin..end` groups more.
- Using assignment (`:=`) instead of equality (`=`) in the condition. Assignment is a statement, not a relational expression.
- Depending on a function call in the right operand of short-circuited `and` or `or` for a required side effect. The call may not occur.

## Edge cases and quirks

- A semicolon immediately after `then` creates an empty controlled statement, so the following statement runs unconditionally.
- The compiler's short-circuit option is fixed by the Velox host setup. Do not rely on Delphi compiler directives to change it from an individual script.
- Variant operations inside the condition can still raise runtime conversion, Null or type errors. Short-circuit guards are useful for preventing an unsafe right-hand access, but only when the left operand is itself safe.
- A bare `if` has no value result. It controls statement execution; it is not Delphi's newer conditional expression syntax.

## Errors and side effects

A malformed expression or non-Boolean-compatible result produces a compile-time syntax/type error. Runtime errors from evaluated operands propagate through the current script exception path. Any function calls made while evaluating the condition keep their normal side effects, except when short-circuiting prevents their evaluation.

## Performance and concurrency

The branch itself is constant-time. Cost and thread-safety are determined by the condition and the selected statement, particularly calls into datasets or shared module objects.

## Related reference

- `if..else` — adds an alternative branch.
- `Boolean` — documents `and`, `or` and `xor` operand rules.
- `Relational (Comparison)` — documents the comparisons normally used to form conditions.
- `Testing values` — distinguishes Null, Empty, empty text, zero and `False`.

## External references

- [Free Pascal: The If..then..else statement](https://www.freepascal.org/docs-html/current/ref/refsu57.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
