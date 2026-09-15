---
title: "for loop"
description: "Counted to and downto iteration in Velox scripts."
sidebar_position: 5
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - statements
  - loops
---

Use a `for` loop to step an integer, enumeration or Variant counter upward with `to` or downward with `downto`.

## Syntax

```Delphi
for Counter := InitialExpression to FinalExpression do
  Statement;

for Counter := InitialExpression downto FinalExpression do
  Statement;
```

Use `begin..end` when the body contains more than one statement.

## How it works

The current `TPSPascalCompiler.ProcessFor` implementation:

1. Resolves `Counter` as a writable identifier. Accepted counter base types are signed and unsigned 8-, 16-, 32- and (when enabled) 64-bit integers, enumerations and Variant.
2. Evaluates `InitialExpression` and assigns it to the counter once.
3. Tests the counter against `FinalExpression` with `<=` for `to` or `>=` for `downto`. A false first test skips the body.
4. Runs the one statement following `do`.
5. Checks whether a fixed-size counter has reached its type's highest (`to`) or lowest (`downto`) representable value. If so, it exits without overflowing the counter.
6. Increments or decrements the counter and repeats the comparison.

`break` exits the loop. `continue` jumps to the boundary check and normal increment/decrement step before the next comparison.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  I: Integer;
  Total: Integer;
begin
  Total := 0;
  for I := 1 to 4 do
    Total := Total + I;
  Value := Total;
end;
```

The body runs for `I` values 1, 2, 3 and 4, producing `10`.

## Common mistakes

- Using a real, string or object counter. The compiler accepts only the listed integer, enumeration or Variant base types.
- Forgetting `begin..end` around a multi-statement body.
- Assuming `continue` skips the counter step. It proceeds through the loop's boundary guard and increment/decrement logic.
- Depending on the counter's value after normal completion. Treat it as loop-control state, not an output contract.
- Supplying a function with side effects as `FinalExpression`; in Velox it can be called repeatedly.

## Edge cases and quirks

- **The final expression is re-evaluated for every entry/iteration comparison.** The compiler emits its calculation inside the bytecode region to which the loop jumps. This differs from the Free Pascal reference, which evaluates the upper bound once, and from normal Delphi expectations. Store an expensive, mutable or state-changing bound in a local variable before the loop.
- The compiler does not prohibit assigning to the counter inside the loop body. Doing so changes subsequent boundary checks and increments and can cause skipped values, unexpected duration or a non-terminating loop. Do not modify the counter manually.
- A `to` loop whose initial value is already greater than the current final value runs zero times; the reverse applies to `downto`.
- Fixed-size counters receive an explicit high/low boundary guard before increment/decrement, preventing wraparound at the type limit. Variant counters do not have a compile-time type boundary for this guard.
- The initial and final expressions are checked as integer/enumeration/Variant-compatible, but conversions can still fail at runtime for a Variant containing an unsuitable value.
- `for..in` enumeration is a different language form and is not handled by this `ProcessFor` path.

## Errors and side effects

Compilation fails for a missing identifier, `:=`, `to`/`downto` or `do`, an unsuitable counter/bound type, or an incompatible assignment/comparison. Runtime errors from initial/final expressions or the body propagate through the current script exception handler. Repeated final-expression evaluation repeats its side effects.

## Performance and concurrency

The final expression's cost is paid for each comparison, so cache it locally when it is not a trivial constant or variable. The loop is synchronous and provides no locking; do not mutate shared map or dataset state from multiple execution contexts without an owning API contract.

## Related reference

- `while loop` — use when repetition is governed by a changing Boolean condition.
- `repeat loop` — use when the body must run before its first condition test.
- `break` and `continue` are compiler-recognised loop controls documented by the scripting statement model.

## External references

- [Free Pascal: The For..to/downto..do statement](https://www.freepascal.org/docs-html/current/ref/refsu58.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
