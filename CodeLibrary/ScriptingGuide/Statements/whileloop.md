---
title: "while loop"
description: "Pre-test repetition while a Velox script condition remains true."
sidebar_position: 6
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - statements
  - loops
---

Use `while` to repeat one statement while a Boolean condition remains `True`. The condition is tested before the first iteration, so the body may not run.

## Syntax

```Delphi
while BooleanExpression do
  Statement;
```

For a multi-statement body:

```Delphi
while BooleanExpression do
begin
  Statement1;
  Statement2;
end;
```

## How it works

`TPSPascalCompiler.ProcessWhile` emits the condition calculation at the start of the loop, converts/writes its result into the default Boolean temporary and conditionally jumps past the body when false. After the body, execution jumps back to the condition calculation.

`break` is patched to the instruction after the loop. `continue` is patched to the condition calculation, so it immediately performs the next test. Boolean `and` and `or` within the condition use Velox's short-circuit compiler option.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Remaining: Integer;
begin
  Remaining := 3;
  while Remaining > 0 do
  begin
    Remaining := Remaining - 1;
  end;
  Value := Remaining;
end;
```

The body runs three times and leaves `Value` as `0`.

## Common mistakes

- Failing to change state used by the condition, creating an unbounded loop.
- Expecting the body to run once when the condition starts false; use `repeat..until` for a post-test loop.
- Using a non-Boolean Variant directly as the condition. Prefer an explicit comparison or registered value test.
- Placing required progress logic after a `continue`; that logic is skipped.

## Edge cases and quirks

- The condition is recalculated on every iteration and after every `continue`.
- A false initial condition performs no body statements or their side effects.
- Short-circuit Boolean guards can prevent evaluation of an unsafe right operand, but Variant conversion and evaluated function calls can still raise runtime errors.
- The compiler detects `break` or `continue` outside a loop as an error. It also tracks invalid jumps across structured regions and can reject control flow that would enter or leave a loop unsafely.
- Velox does not impose an iteration limit. Termination is entirely the script author's responsibility.

## Errors and side effects

Missing `do`, an incompatible condition or malformed body causes compilation to fail. Runtime exceptions in the condition or body leave the loop through normal script exception propagation. Calls made by the condition occur once per test unless short-circuited.

## Performance and concurrency

Total cost is the condition plus body cost multiplied by the number of tests/iterations. Cache invariant expensive data outside the loop. A tight loop can delay the map event that owns it, and the statement provides no cancellation polling or synchronisation by itself.

## Related reference

- `for loop` — counted iteration.
- `repeat loop` — post-test iteration that always executes once.
- `Boolean` and `Relational (Comparison)` — condition construction and short-circuit rules.

## External references

- [Free Pascal: The While..do statement](https://www.freepascal.org/docs-html/current/ref/refsu61.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
