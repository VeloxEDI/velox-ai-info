---
title: "Colon (':') expected"
description: "Where Velox requires a colon in declarations, labels and case branches."
sidebar_position: 9
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - colon
  - declarations
---

Velox reports this error when the current grammar requires `:` but finds another token. A colon separates a declared name from its type, a label from its statement, and a `case` selector from its branch statement.

## Common forms

```Delphi
var
  Name: string;

procedure DoWork(const Value: Variant);

case Status of
  1: Value := 'Ready';
end;
```

## Example

This declaration omits the separator between the variable name and type:

```Delphi
var
  Count Integer; // Error: Colon (':') expected
```

Correct it as follows:

```Delphi
var
  Count: Integer;
```

A `case` branch has the same requirement:

```Delphi
1 Value := 'Ready';  // Incorrect
1: Value := 'Ready'; // Correct
```

## How Velox detects it

The modified PascalScript compiler emits `ecColonExpected` from numerous declaration, parameter, record, label and `case` parsing paths. It is not tied to one specific statement. Velox reports the current token position where the colon was required.

Because the parser checks after reading the material to the left of the separator, the highlighted token is often the type name, branch statement or next declaration. An invalid name or missing comma before it can be the true root cause.

## Correction procedure

1. Determine whether the surrounding construct is a declaration, formal parameter, label or `case` branch.
2. Insert `:` only at the grammar boundary; do not replace assignment `:=` or equality `=`.
3. For a list of names sharing one type, use commas before the colon: `First, Second: Integer`.
4. Check the preceding name or selector for a missing comma, invalid token or incomplete expression.
5. Recompile from the earliest diagnostic.

## Common causes

- Writing `Name Type` rather than `Name: Type`.
- Using `:=` in a declaration.
- Forgetting `:` after a `case` value or label.
- Omitting a comma between multiple declared names, which shifts the expected colon position.
- Copying C-style parameter syntax where the type precedes the name.

## Related reference

- `Comma (',') expected` — separating names and values within lists.
- `Equals ('=') expected` — declaration forms that use equality instead.
- `case..of` — selector and branch syntax.

## External references

- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
