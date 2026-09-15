---
title: "'END' expected"
description: "How to find the unterminated block or structured statement that requires `end`."
sidebar_position: 15
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - end
  - blocks
---

Velox reports `'END' expected` when an opened compound or structured declaration cannot finish because the required `end` keyword is absent or another token appears first.

## Typical forms

```Delphi
begin
  Statements;
end;

case Value of
  1: Statement;
end;

try
  Statements;
except
  Statements;
end;
```

Class and record declarations also close with `end` in compiler-supported declaration contexts.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if VarIsNull(Value) then
  begin
    Value := 'missing';
  // Error is detected later: 'END' expected
end;
```

Close both the inner block and routine:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if VarIsNull(Value) then
  begin
    Value := 'missing';
  end;
end;
```

## How Velox detects it

The modified PascalScript compiler emits `ecEndExpected` from routine/block, `case`, `try`, class, record and related structured parsers. The current parser position is where the active construct could no longer accept another statement or declaration without its close.

Velox enables `icAllowNoEnd` for the outer script source, so some top-level wrapper-free event scripts can finish without a conventional outer `end`. This does not make `end` optional for a declared routine, nested `begin`, `case`, `try`, class or record.

## Why the location can be misleading

The parser cannot always know that `end` is missing at the line where it should appear. It may continue consuming subsequent source and report the next routine, `else`, end of file or other structural token. A missing semicolon, `until`, `except` or `finally` earlier can also alter which structure the parser believes is open.

## Correction procedure

1. Work backwards from the reported location and list every open `begin`, `case`, `try`, class and record.
2. Match each with the correct `end`; indentation is helpful but source keywords are authoritative.
3. Check whether the close requires `end;`, `end.` or a following `else` in its context.
4. Verify `repeat` loops close with `until`, not `end` unless their body also contains a nested `begin`.
5. Recompile after correcting the first unmatched structure.

## Common causes

- Closing an inner block but forgetting the owning routine's `end`.
- Omitting the final `end` of a `case` or `try` statement.
- Using `until` or `)` as if it closed a `begin` block.
- Adding/removing a `begin` during edits without changing the matching close.
- Relying on the top-level allow-no-end option inside a nested structure.

## Related reference

- `begin..end` — compound-statement rules.
- `'BEGIN' expected` — opening a declared routine body.
- `Unexpected end of file` — source ending while a different structure remains incomplete.

## External references

- [Free Pascal: Compound statements](https://www.freepascal.org/docs-html/current/ref/refsu55.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
