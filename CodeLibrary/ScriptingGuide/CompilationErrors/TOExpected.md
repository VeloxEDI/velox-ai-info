---
title: "'TO' expected"
description: "Why a Velox `for` loop requires `to` or `downto` after its initial value."
sidebar_position: 41
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - for-loop
  - to
  - downto
---

Velox reports `'TO' expected` after it has parsed the counter and initial value of a `for` statement but cannot find either direction keyword. Despite the message naming only `TO`, the compiler accepts both `to` and `downto`.

## Syntax

```Delphi
for Counter := InitialValue to FinalValue do
  Statement;

for Counter := InitialValue downto FinalValue do
  Statement;
```

## Example

This loop omits its direction:

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  I: Integer;
begin
  for I := 1 3 do // Error: 'TO' expected
    Value := I;
end;
```

Add `to` for an ascending loop or `downto` for a descending loop:

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  I: Integer;
begin
  for I := 1 to 3 do
    Value := I;
end;
```

## How Velox detects it

The `for` compiler performs these steps in order:

1. Resolve the counter as writable variable storage.
2. Require `:=` and parse the initial-value expression.
3. Test the next token for `to` or `downto`.
4. Emit `ecToExpected` if neither token is present.
5. Parse the final-value expression and then require `do`.

The diagnostic therefore points at the token after the initial value. A malformed initial expression can move that detection point or produce a more specific expression error first.

## Correction procedure

1. Check that the statement begins `for Counter := InitialValue`.
2. Insert exactly one direction keyword: `to` to increment or `downto` to decrement.
3. Supply the final value after the direction.
4. Check for the separate `do` keyword before the loop body.

## Edge cases and quirks

- The public message is inherited from PascalScript and says only `'TO' expected`; `downto` is equally valid.
- A misspelling such as `downToValue` is an identifier, not the `downto` keyword, and triggers this diagnostic at that token.
- Velox accepts integer-sized counters, enumeration counters and `Variant` counters in this compiler path. Unlike Delphi's general ordinal rule, the current counter-type check does not include `Char`; a character counter produces `Type mismatch` rather than `'TO' expected`.
- An invalid counter, initial value or final value produces `Variable Expected` or `Type mismatch`. Adding `to` does not correct those separate faults.
- The initial and final expressions are compiled before the loop body. The final expression is evaluated once when the loop starts, and Velox emits a boundary check to avoid wrapping an integer counter after its highest or lowest value.
- This is a compile-time error. The loop body does not execute partially.

## Related reference

- `DO expected` - the loop direction is present but the body separator is missing.
- `Type mismatch` - the counter or a bound has an unsupported type.
- `Variable Expected` - the counter is not writable variable storage.

## External references

- [Free Pascal: The For..to/downto..do statement](https://www.freepascal.org/docs-html/ref/refsu58.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
