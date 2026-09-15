---
title: "Closing parenthesis expected"
description: "How to locate and correct a missing closing parenthesis in a Velox script."
sidebar_position: 7
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - parentheses
---

Velox reports this error when a construct opened with `(` cannot be completed because the parser does not find the required `)`. Parentheses are used by expressions, calls, casts, parameter declarations and some compiler-owned constructs, so inspect the complete surrounding construct.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if (Value = 'Ready' then // Error: Closing parenthesis expected
    Value := 'Processed';
end;
```

Balance the condition:

```Delphi
if (Value = 'Ready') then
  Value := 'Processed';
```

A malformed argument list can produce the same message:

```Delphi
Result := Copy(Value, 1, 3;   // Incorrect
Result := Copy(Value, 1, 3);  // Correct
```

## How Velox detects it

The modified PascalScript compiler emits `ecCloseRoundExpected` from multiple parser routines after an opening parenthesis has established a grouped expression, call, type conversion, parameter list or related construct. Velox formats the diagnostic using the current parser position.

That position is normally where `)` was required, not necessarily where the mistake began. A comma, semicolon, `then`, `do`, `]` or end of line can be highlighted because it is the first token that proves the parenthesised construct cannot continue.

## Correction procedure

1. Start at the reported token and scan left to the nearest unmatched `(`.
2. Check nested calls and expressions one level at a time rather than merely adding `)` at the end of the line.
3. Verify separators inside the pair: commas between arguments and semicolons between formal parameter groups.
4. Check quoted strings and comments; punctuation inside them does not balance source parentheses.
5. Recompile after correcting the earliest unmatched construct, because later parenthesis diagnostics can be consequential.

## Common causes

- Omitting `)` after an `if` or `while` condition.
- Closing an inner function call but not the outer call.
- Using `]` or `;` where `)` is required.
- Supplying a malformed prior argument that changes how the following comma is parsed.
- Copying code with an extra opening parenthesis.

## Related reference

- `Opening parenthesis expected` — constructs that require `(`.
- `Comma (',') expected` — separating call arguments and list items.
- `Syntax error` — punctuation that does not fit any current construct.

## External references

- [Embarcadero DocWiki: Expressions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Expressions_%28Delphi%29)
