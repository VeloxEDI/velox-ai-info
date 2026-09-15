---
title: "'OF' expected"
description: "Where Velox requires the of keyword in array, set, open-array and case syntax."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - arrays
  - case
---

Velox reports `'OF' expected` when a supported construct has reached the point where `of` must connect its selector or container declaration to the following type or branch list.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  case Value
    1: Value := 'one'; // Error: 'OF' expected
  end;
end;
```

Add `of` after the completed selector expression:

```Delphi
case Value of
  1: Value := 'one';
else
  Value := 'other';
end;
```

## Compiler contexts

The current modified PascalScript compiler emits the same diagnostic in four syntax families:

- `case Expression of` before the first case label;
- `set of ElementType`;
- `array[IndexRange] of ElementType` and dynamic `array of ElementType`; and
- `array of ElementType` in an open-array parameter declaration parsed by the routine-declaration helper.

The token following `array`, `set` or the `case` selector is not interchangeable across these forms. For example, a static array must close its `]` before `of`.

## Correction procedure

1. Identify whether the parser is in a `case`, `set`, array or parameter declaration.
2. Complete the expression, range or closing bracket immediately before `of`.
3. Insert the keyword at that grammar boundary.
4. Check the following type or case label; a malformed preceding construct can make the reported token misleading.

## Edge cases and quirks

- The message does not identify which of the four parser contexts emitted it.
- In `case`, an error inside the selector expression can consume tokens up to the expected `of`; correct the earliest expression error first.
- In an array declaration, a missing `]` normally reports `Closing square bracket expected` before this message.
- `of` in exception-handler syntax is handled by a different parser path and does not use this emission family.

## Related reference

- `case` - selector types, labels and `else` behaviour.
- `Closing square bracket (']') expected` - an unfinished array range.
- `Unknown type` - `of` is present but the element type is unavailable.

## External references

- [Free Pascal: The Case statement](https://www.freepascal.org/docs-html/ref/refsu56.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
