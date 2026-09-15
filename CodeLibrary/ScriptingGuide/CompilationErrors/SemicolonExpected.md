---
title: "Semicolon (';') expected"
description: "Where the Velox compiler requires a semicolon between statements, declarations and routine boundaries."
sidebar_position: 36
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - semicolon
  - statements
---

Velox reports `Semicolon (';') expected` when the current statement, declaration or routine boundary must be terminated before the next token. The error is usually reported at that next token, so inspect the preceding construct first.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  TextValue: String;
begin
  TextValue := 'first' // Error reported when the next statement is read
  Value := TextValue;
end;
```

Separate the statements:

```Delphi
TextValue := 'first';
Value := TextValue;
```

## Compiler contexts

The modified PascalScript compiler uses this diagnostic across several grammar families, including:

- adjacent statements in a block;
- variable, constant, type, class, interface and routine declarations;
- procedure/function headers and a procedure body's final `end;`;
- `uses` entries and unit sections when unit syntax is enabled;
- external routine declarations; and
- some record, class-member and attribute declaration boundaries.

Because one message covers all these contexts, the row and column alone do not identify which semicolon is missing.

## Important `else` and `end` rules

The current statement parser does not require a separator when the next token is `else` or `end`. In an `if..then..else`, do not insert a semicolon immediately before `else`; it terminates the `then` statement and changes the grammar. A final statement before `end` can omit its semicolon, although consistent use often improves editing safety.

An inner procedure or function declaration is different: its completed body is a declaration and therefore ends with `end;`.

## Correction procedure

1. Inspect the complete statement or declaration immediately before the reported token.
2. Balance its parentheses and brackets first; an unclosed expression can consume the expected separator.
3. Add `;` only at the real statement/declaration boundary.
4. Check for `else`: remove a separator placed between the `then` branch and its `else`.
5. Recompile from the earliest punctuation error because later semicolon messages can be secondary.

## Edge cases and quirks

- A malformed property/member expression can sometimes fall through to this diagnostic instead of a more specific member error.
- An `external` declaration requires a semicolon both before the `external` directive and after its string argument in this parser.
- After that second semicolon, an unavailable external-procedure resolver also produces `Semicolon expected` even though the punctuation is already correct. The standard Windows Velox engine installs its DLL resolver, so this misleading branch normally indicates a non-standard host or platform/configuration problem rather than a missing semicolon.
- The compiler permits scripts without an outer `begin..end.` wrapper, but each declared routine still follows its own semicolon rules.
- This is compile-time parsing only; no earlier statement from the same script has executed.

## Related reference

- `END expected` - a block terminator is missing rather than its separator.
- `Closing parenthesis expected` - an expression remains open before the apparent boundary.
- `'THEN' expected` - the conditional header is incomplete.

## External references

- [Free Pascal: Compound statements](https://www.freepascal.org/docs-html/ref/refsu55.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
