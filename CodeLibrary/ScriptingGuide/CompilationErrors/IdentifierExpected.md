---
title: "Identifier expected"
description: "Why the parser requires a valid name at the reported declaration or expression position."
sidebar_position: 19
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - identifiers
  - parser
---

Velox reports `Identifier expected` when the grammar requires a name but the current token cannot be used as one. An identifier names a variable, constant, type, routine, parameter, label, member or other declared item.

## Example

This variable declaration has a type but no name:

```Delphi
var
  : Integer; // Error: Identifier expected
```

Supply a valid name:

```Delphi
var
  ItemCount: Integer;
```

A missing member after a period can produce the same diagnostic:

```Delphi
Value := Helper.;          // Incorrect
Value := Helper.Member;    // Correct when Member is exposed
```

## Where the diagnostic is used

The modified PascalScript compiler emits `ecIdentifierExpected` from many parsing paths, including:

- variable, constant, type, routine and parameter declarations;
- program/unit and label declarations;
- a member name following `.`;
- address/operator forms that require a named target;
- record/class members and compiler attribute syntax.

The message therefore describes the expected token category, not one particular feature.

## Identifier rules and resolution

The current Velox lexer accepts an ASCII letter (`A`-`Z` or `a`-`z`) or underscore as the first character, followed by ASCII letters, digits or underscores. Reserved keywords such as `begin`, `end`, `if` and `var` are tokens in their own right and cannot stand in an ordinary identifier position. Velox script lookup is case-insensitive.

Modern Delphi also permits Unicode identifier characters and an `&` escape for some keyword-like identifiers. Those extensions are not implemented by the current PascalScript tokeniser; use the narrower Velox form above.

This diagnostic occurs before name resolution. A syntactically valid name that is not declared produces `Unknown identifier` instead.

## Location behaviour

Velox records the token found where a name was required. The true cause may be an omitted name immediately before that token, or a missing delimiter earlier that moved the parser into a declaration/member context. For example, the displayed colon in `var : Integer` is not itself invalid; it arrives before the required variable name.

## Correction procedure

1. Identify which construct owns the reported position.
2. Add or correct the required name without using a reserved keyword.
3. Check the token immediately before the location for an extra period, comma or declaration keyword.
4. If a valid identifier is already visible, inspect the preceding line for a missing semicolon or close delimiter.
5. Recompile and then address any `Unknown identifier` or duplicate-name diagnostic separately.

## Common causes

- Omitting a variable, parameter, type or routine name.
- Leaving a trailing period in a member expression.
- Using a reserved word as a name.
- Starting an identifier with an unsupported character or digit.
- A malformed prior declaration causing the next token to be read in the wrong context.

## Related reference

- `Unknown identifier` — a valid name that cannot be resolved.
- `Duplicate identifier` — a name already declared in the relevant scope.
- `Colon (':') expected` — the separator after declaration names.

## External references

- [Embarcadero DocWiki: Fundamental Syntactic Elements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Fundamental_Syntactic_Elements_%28Delphi%29)
