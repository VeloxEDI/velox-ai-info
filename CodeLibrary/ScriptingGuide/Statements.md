---
title: Statements
description: Control-flow and block statements supported by the Velox Pascal scripting compiler.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords:
  - velox
  - scripting
  - statements
  - control-flow
  - pascal
---

Statements perform work or control which script code executes. Velox uses the PascalScript grammar, with generated child topics for compound blocks, conditions, case selection, `for`, `while` and `repeat` loops, and `try..except`/`try..finally` handling.

## Basic forms

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  I: Integer;
begin
  if VarIsNull(Value) then
    Value := ''
  else
  begin
    for I := 1 to 3 do
      Value := VarToStr(Value) + '.';
  end;
end;
```

The source-reviewed example shows a simple statement after `then` and a compound `begin..end` statement after `else`.

## Blocks and semicolons

`begin` and `end` group several statements wherever the grammar expects one statement. A semicolon separates statements; it is not conceptually part of `if`, `while` or another construct. In particular, do not put a semicolon between an `if` branch and its `else`.

The event procedure's final `end;` closes the procedure. A full Delphi program normally ends in `end.`, but Velox compiles event procedures and enables options that allow source without a traditional program main block.

## Conditions and loops

Conditions must produce Boolean-compatible values. Use explicit Variant tests before a Boolean conversion. A `for` loop evaluates a bounded ordinal range and changes its loop variable; a `while` loop tests before each pass; a `repeat` loop executes at least once and tests after the body.

Every loop in an integration must have a deterministic termination condition. Dataset loops normally advance with `Next`; omitting that call can hang the action. Long loops block the action thread and delay cancellation unless the called operations check it.

## Exceptions and cleanup

Use `try..except` when the script can safely handle a known failure and provide an appropriate result or log. Use `try..finally` to release a caller-owned object or restore state regardless of success. Do not free context-owned Velox objects in a finally block.

The surrounding Velox event boundary can also catch unexpected failures. Generated scripts must use `LogError` and explicit `Exit`/checked helper propagation rather than raising or swallowing errors. Preserve supported try..except handling and explicit finally cleanup. Logging alone neither exits nor triggers except nor rolls back prior effects. Follow [mandatory failure handling](../../instructions/scripts/failure-handling.md).

## Common mistakes

- A stray semicolon before `else`, producing a syntax error or changing control flow.
- Using `=` for assignment instead of `:=`.
- Writing a dataset `while not EOF` loop without `Next`.
- Using `repeat` when the body must not run for an initially false condition.
- Catching every exception and continuing with partially changed data.
- Creating an object and omitting `try..finally` when the entry says the caller owns it.

## Edge cases and quirks

- This landing page documents the generated supported family; a statement accepted by modern Delphi is not automatically accepted by the current PascalScript compiler.
- Boolean short-circuiting is enabled by Velox, which affects function calls inside `and`/`or` conditions.
- `Exit` leaves the current procedure immediately and preserves any changes already made through `var` parameters.
- Compiler errors can point into an included module; use the reported module and line rather than only the main editor line.

## Related reference

- **Operators** — expressions used by assignments and conditions.
- **Comments** — documenting non-obvious control flow.
- **Compilation errors** — missing delimiters and structural diagnostics.

## External references

- [Free Pascal: Statements](https://www.freepascal.org/docs-html/ref/refch13.html)
- [Embarcadero DocWiki: Program Control (Delphi)](https://docwiki.embarcadero.com/RADStudio/Athens/en/Program_Control_%28Delphi%29)
