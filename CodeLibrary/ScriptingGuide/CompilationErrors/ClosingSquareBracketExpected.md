---
title: "Closing square bracket (']') expected"
description: "How to correct an unclosed array, set or indexed-expression bracket."
sidebar_position: 8
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - brackets
  - arrays
---

This error means the compiler entered a bracketed construct with `[` but did not find the required `]`. In Velox scripts, bracketed constructs include array or string indexing, set constructors and certain type declarations.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Text: string;
begin
  Text := 'ABC';
  Value := Text[1; // Error: Closing square bracket (']') expected
end;
```

Close the indexed expression before ending the statement:

```Delphi
Value := Text[1];
```

## Contexts to inspect

- `Value[Index]` or a multi-dimensional/indexed access.
- A set constructor such as `[FirstValue, SecondValue]`.
- An array or set type declaration that contains a bracketed range.
- Nested forms such as `Rows[GetIndex(Names[1])]`, where the unmatched bracket can be inside another call.

Attributes use the same punctuation but have a separate `Attributes not closed` diagnostic when a registered attribute list reaches its final delimiter check.

## How Velox detects it

The modified PascalScript compiler emits `ecCloseBlockExpected` after parsing the content of an index, array/set construct or bracketed type. Velox records the current parser position, which is commonly the semicolon, comma, parenthesis or following operator at which `]` was required.

The diagnostic only proves that the current bracketed production could not close. An invalid expression inside the brackets can cause the parser to reach the same condition even when a visible `]` exists later.

## Correction procedure

1. Find the closest unmatched `[` before the reported location.
2. Confirm whether it is an index, set value or type declaration; each permits different content.
3. Balance parentheses nested inside the brackets before adding a final `]`.
4. Check commas and range operators inside array/set declarations or constructors.
5. Correct the first malformed bracketed expression, then recompile.

## Common causes

- Omitting `]` from an index.
- Typing `)` instead of `]`.
- Closing an outer bracket while an inner index remains open.
- Supplying an incomplete index expression, so the following token cannot be parsed as the close.
- Using square brackets around ordinary grouping where parentheses are required.

## Related reference

- `Opening square bracket ('[') expected` — constructs that require an opening bracket.
- `Arrays` — registered and script-declared array types.
- `Sets` — set values and membership operations.

## External references

- [Embarcadero DocWiki: Expressions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Expressions_%28Delphi%29)
