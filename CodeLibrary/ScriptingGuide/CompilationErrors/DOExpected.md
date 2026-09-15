---
title: "'DO' expected"
description: "Why a `for`, `while` or related statement requires the `do` keyword."
sidebar_position: 13
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - loops
  - do
---

Velox reports `'DO' expected` after the controlling part of a `for`, `while` or `with` statement when the required `do` keyword is absent.

## Required forms

```Delphi
for Index := First to Last do
  Statement;

while Condition do
  Statement;

with RecordOrObject do
  Statement;
```

A `repeat ... until Condition` loop does not use `do`.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Index: Integer;
begin
  for Index := 1 to 3 // Error: 'DO' expected
    Value := Index;
end;
```

Add the keyword between the loop range and body:

```Delphi
for Index := 1 to 3 do
  Value := Index;
```

Use a compound statement when the body contains several statements:

```Delphi
while HasMore do
begin
  ReadNext;
  ProcessCurrent;
end;
```

## How Velox detects it

The modified PascalScript compiler emits `ecDoExpected` in `ProcessFor`, `ProcessWhile` and `ProcessWith` after their control expression has been parsed. Velox reports the current token where `do` should have appeared.

If the control expression is incomplete, the highlighted first body token may be a consequence rather than the root cause. Check missing parentheses, the `to`/`downto` keyword and the loop-control assignment before inserting `do` mechanically.

## Common causes

- Omitting `do` after a `for` range or `while` condition.
- Writing `then`, copied from an `if` statement.
- Adding `do` to a `repeat` loop and thereby shifting later parsing.
- Starting the loop body before completing the condition.
- Forgetting `do` after a `with` expression because it is not visually a loop.

## Correction procedure

1. Identify the owning `for`, `while` or `with` keyword.
2. Complete its control clause first.
3. Add exactly one `do` before the body statement.
4. Wrap a multi-statement body in `begin..end`.
5. Recompile and resolve the earliest remaining structural diagnostic.

## Related reference

- `for loop` — `:=`, `to`/`downto` and counter behaviour.
- `while loop` — pre-test condition behaviour.
- `repeat loop` — the loop form that does not use `do`.
- `with` — record/class member context.

## External references

- [Free Pascal: The for statement](https://www.freepascal.org/docs-html/current/ref/refsu58.html)
- [Free Pascal: The while statement](https://www.freepascal.org/docs-html/current/ref/refsu61.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
