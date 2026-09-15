---
title: "Equals ('=') expected"
description: "Where a declaration or construct requires `=` rather than assignment or comparison syntax."
sidebar_position: 16
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - equals
  - declarations
---

Velox reports this error when a type alias or constant declaration has supplied its name but not the required `=` separator. In this context `=` introduces the declared type or constant value; it is not an assignment statement.

## Required forms

```Delphi
type
  Identifier = TypeDefinition;

const
  Identifier = ConstantExpression;
```

## Example

```Delphi
const
  MaximumRetries := 3; // Error: Equals ('=') expected
```

Use `=` in the declaration:

```Delphi
const
  MaximumRetries = 3;
```

Runtime storage still uses `:=`:

```Delphi
RetryCount := MaximumRetries;
```

## How Velox detects it

The modified PascalScript compiler emits the internal error enum `ecIsExpected` after reading a name in a `type` or `const` block when the next token is not `=`. Velox overrides the public message text to `Equals ('=') expected` and displays it as an Error.

The internal enum name is an implementation detail and does not mean the script should contain the word `is`. The required source token is exactly `=`.

## Distinguishing the operators

- `Name = Value` in a `const` block defines a compile-time constant.
- `Name = TypeDefinition` in a `type` block defines a type.
- `Target := Expression` in executable code stores a runtime value.
- `Left = Right` inside an expression compares two values and produces a Boolean.

The token has to be interpreted from its surrounding grammar, not from its English meaning.

## Correction procedure

1. Find the owning `type` or `const` block.
2. Confirm that the declaration has a valid identifier before the separator.
3. Replace `:=` or an omitted token with `=`.
4. Ensure the right side is a valid type definition or compile-time constant expression, not an executable statement.
5. Check the preceding declaration for a missing semicolon if the visible line already uses `=`.

## Common causes

- Using assignment syntax in a constant declaration.
- Writing a C-style type declaration.
- Omitting the separator during an edit.
- Missing the previous semicolon, causing the next identifier to be parsed in the wrong declaration.
- Assuming the message requests an equality comparison in executable code.

## Related reference

- `Assignment (':=') expected` — the executable storage operator.
- `Constants` — values registered or declared for scripts.
- `Types` — type aliases and exposed type definitions.

## External references

- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
