---
title: "repeat loop"
description: "Post-test repetition until a Velox script condition becomes true."
sidebar_position: 7
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - statements
  - loops
---

Use `repeat..until` when a sequence must execute at least once and then repeat until a Boolean condition becomes `True`.

## Syntax

```Delphi
repeat
  Statement1;
  Statement2;
until BooleanExpression;
```

The region between `repeat` and `until` already accepts a statement sequence; an additional `begin..end` wrapper is not required.

## How it works

`TPSPascalCompiler.ProcessRepeat` marks the start of the body, compiles statements until the `until` token, then emits the condition calculation. A false result jumps back to the body; a true result continues after the loop.

`break` jumps after the loop. `continue` jumps to the condition calculation, not directly to the first body statement. The condition therefore still determines whether another iteration begins. Boolean `and` and `or` use Velox short-circuit evaluation.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Attempts: Integer;
begin
  Attempts := 0;
  repeat
    Attempts := Attempts + 1;
  until Attempts >= 3;
  Value := Attempts;
end;
```

The body runs three times. Even if `Attempts` began at `3`, it would be incremented once before the first test.

## Common mistakes

- Writing a continuation condition as though this were `while`. The loop stops when the `until` condition is true.
- Adding `do` after the condition; `repeat..until` has no `do` keyword.
- Assuming `continue` skips the condition. It transfers control to that condition.
- Forgetting that all statements up to `until` are in the body, regardless of indentation.

## Edge cases and quirks

- The body always executes once before the first condition evaluation.
- The semicolon before `until` is optional for the final body statement, but retaining it is clearer and consistent with generated examples.
- A constant false condition creates an unbounded loop unless the body executes `break` or raises/exits. A constant true condition produces exactly one iteration.
- Short-circuiting affects only Boolean `and`/`or` subexpressions. Evaluated Variant operands retain their normal conversion and Null/error behaviour.
- The compiler patches structured `break`/`continue` jumps and rejects controls used outside a loop.

## Errors and side effects

A missing `until`, invalid condition or malformed body prevents compilation. Body side effects happen before every test, including the first. Runtime exceptions propagate unless an enclosing script `try..except` handles them.

## Performance and concurrency

Cost is at least one body execution plus one condition evaluation. No built-in timeout or iteration cap exists, so ensure some body path advances the termination condition. The loop is synchronous and adds no concurrency protection.

## Related reference

- `while loop` — tests before the body and may run zero times.
- `for loop` — counted iteration with automatic counter updates.
- `Boolean` and `Relational (Comparison)` — build the termination condition.

## External references

- [Free Pascal: The Repeat..until statement](https://www.freepascal.org/docs-html/current/ref/refsu60.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
