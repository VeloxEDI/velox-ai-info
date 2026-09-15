---
title: "'BEGIN' expected"
description: "Why a Velox script routine or block requires `begin` at the reported location."
sidebar_position: 3
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - begin
---

Velox reports `'BEGIN' expected` when the compiler has finished reading declarations and requires the executable body of a procedure, function or structured source unit to start with `begin`.

## Required form

```Delphi
procedure DoWork;
var
  Count: Integer;
begin
  Count := 1;
end;
```

Declarations such as `var`, `const`, nested routines and type definitions appear before `begin`. Executable statements appear after it.

## Example

This routine starts executing statements without opening its body:

```Delphi
procedure ScriptEvent(var Value: Variant);
  Value := 'Ready'; // Error: 'BEGIN' expected
end;
```

Add the required compound statement:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := 'Ready';
end;
```

## How Velox detects it

The modified PascalScript compiler's routine and source-unit parsers emit `ecBeginExpected` when the next token cannot begin the required body. Velox records the parser's current module, row and column and renders the result with Error severity.

Velox enables the compiler option `icAllowNoBegin`, so a top-level event script may omit a conventional outer program wrapper. That option does not make `begin` optional in a declared procedure or function, nor where several statements must be grouped into one compound statement.

## Common causes

- Omitting `begin` between a routine's declaration section and its first statement.
- Placing an executable statement among `var`, `const` or `type` declarations.
- Ending a routine heading incorrectly, so the parser continues treating following text as declarations.
- Missing `end;` for a preceding nested routine, which changes the context in which the next `begin` is expected.
- Copying a top-level wrapper-free script pattern into a procedure or function body.

## Correction procedure

1. Find the procedure, function or source-unit heading that owns the reported location.
2. Complete all declarations before the executable body.
3. Insert `begin` before the first executable statement and ensure there is a matching `end`.
4. Check nearby nested routines and block terminators if `begin` is already present.
5. Recompile from the first diagnostic; structural errors commonly produce follow-on messages.

## Related reference

- `begin..end` — compound statements, separators and the top-level Velox exception.
- `'END' expected` — locating a missing closing keyword.
- `Semicolon (';') expected` — routine headings and statement separation.

## External references

- [Free Pascal: Compound statements](https://www.freepascal.org/docs-html/current/ref/refsu55.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
