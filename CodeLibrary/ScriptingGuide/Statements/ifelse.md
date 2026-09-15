---
title: "if..else"
description: "Two-branch conditional execution and else association in Velox scripts."
sidebar_position: 3
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - statements
  - conditions
---

Use `if..else` when exactly one of two statement branches must run, selected by a Boolean condition.

## Syntax

```Delphi
if BooleanExpression then
  TrueStatement
else
  FalseStatement;
```

Use compound statements for multi-statement branches:

```Delphi
if BooleanExpression then
begin
  TrueStatement1;
  TrueStatement2;
end
else
begin
  FalseStatement1;
  FalseStatement2;
end;
```

There is deliberately no semicolon between the `end` of the true branch and `else`.

## How it works

The modified PascalScript compiler evaluates the condition into a Boolean temporary. A false result jumps to the `else` branch; a true result executes the first branch and then jumps past the alternative. Only one branch executes.

When `if` statements are nested without explicit blocks, an `else` binds to the nearest preceding `if` that does not already have an `else`. This is implemented by the compiler's one-line `if` sub-block and its handling of the `else` token. Use `begin..end` to make a different association explicit.

Boolean `and` and `or` within the condition use the Velox short-circuit setting, with the same operand and failure rules as a plain `if`.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Score: Integer;
begin
  Score := 72;
  if Score >= 50 then
    Value := 'pass'
  else
    Value := 'review';
end;
```

Only one assignment is made. The example omits a semicolon after the true-branch assignment because the next token is `else`.

## Common mistakes

- Writing a semicolon before `else`, including `end; else`. This closes the true statement and leaves an unmatched `else`; use `end else`.
- Relying on indentation to pair an `else` with an outer `if`. The parser uses the nearest unmatched `if`, not visual alignment.
- Repeating the same expensive or state-changing test in each branch. Evaluate it once into a local value when consistent results matter.
- Using deeply nested branches where a `case` statement or an early guard would make the choices clearer.

## Edge cases and quirks

- Either branch may be an empty statement, but an explicit empty compound block is clearer.
- A branch may contain another `if..else`; use blocks whenever the intended pairing is not immediately obvious.
- The condition is evaluated once, but only the chosen branch's calls and side effects occur.
- Velox supports the statement form documented here. Do not assume newer Delphi conditional-expression syntax is accepted by the PascalScript parser.

## Errors and side effects

Compile-time errors include a missing `then`, unmatched `else`, invalid condition or incompatible assignment in either branch. Both branches must compile even though only one runs. Runtime exceptions propagate only from the evaluated condition and selected branch.

## Performance and concurrency

Branch overhead is negligible. Avoid hiding expensive dataset navigation or external module operations inside a condition whose cost is not obvious. `if..else` provides no synchronisation for shared objects.

## Related reference

- `if` — executes a branch without an alternative.
- `case` — expresses several mutually exclusive choices.
- `begin..end` — groups multiple statements and disambiguates nested branches.
- `Boolean` and `Relational (Comparison)` — form source-safe conditions.

## External references

- [Free Pascal: The If..then..else statement](https://www.freepascal.org/docs-html/current/ref/refsu57.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
