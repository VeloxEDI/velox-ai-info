---
title: "begin..end"
description: "Compound-statement blocks and statement separators supported by Velox scripts."
sidebar_position: 1
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - statements
  - blocks
---

Use `begin` and `end` to group zero or more statements into one compound statement. A compound statement is useful anywhere the grammar accepts one statement, including an event body, an `if` branch or a loop body.

## Syntax

```Delphi
begin
  Statement1;
  Statement2;
end;
```

The semicolon separates statements; it is not part of the `begin` or `end` keywords. The final statement before `end` may omit its semicolon, although retaining it makes later edits safer. A semicolon after `end` is needed when another statement follows at the same level.

## How it works

Velox compiles scripts with its modified PascalScript compiler. `TPSPascalCompiler.ProcessSub` enters a nested block when it reads `begin`, compiles each contained statement in source order, and leaves the block at the matching `end`. The block itself does not create an independently callable routine or transaction.

Velox enables `icAllowNoBegin` and `icAllowNoEnd` for the outer script. Consequently, a complete script supplied to an event can omit an otherwise conventional outer program `begin..end` wrapper. This option does not remove the need for `begin..end` when several statements must occupy a grammar position that accepts only one statement.

Blocks may be nested. Local variable declarations still belong at the start of their procedure or function; placing a `var` declaration inside an executable block is not supported by this grammar.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := 'started';
  begin
    Value := Value + ' and completed';
  end;
end;
```

The nested block is legal but unnecessary here; it demonstrates that its statements execute at the point where the block appears.

## Common mistakes

- Omitting `begin..end` after an `if` or loop when more than one statement is intended. Only the immediately following statement belongs to that branch or loop.
- Adding a semicolon before the `else` of an `if..else`. That terminates the `then` statement and prevents the parser from associating the `else` correctly.
- Missing the matching `end`. Compilation fails, commonly with an `END expected` or related structural error at the point where the parser can no longer complete the block.
- Assuming a block isolates failures or rolls back changes. It provides syntax grouping only; called functions, object setters and dataset operations keep their normal side effects.

## Edge cases and quirks

- An empty block (`begin end`) is accepted and performs no operation.
- A stand-alone semicolon is an empty statement. Multiple semicolons therefore compile, but usually indicate accidental or unclear code.
- The main script can omit its outer `begin` or final `end` because of Velox compiler options. Examples retain a conventional procedure block because event signatures still need a clear executable body.
- `begin..end` does not introduce block-local variable scope in the way braces do in some other languages.

## Performance and concurrency

The block adds no material runtime work beyond its contained statements. It provides no locking or concurrency boundary; any shared objects exposed by Velox retain their own lifetime and thread-safety rules.

## Related reference

- `if` and `if..else` — use a compound block when a branch must execute several statements.
- `for loop`, `while loop` and `repeat loop` — blocks define a multi-statement loop body.
- `try..except` and `try..finally` — these statements use block-like regions but also install runtime exception handling.

## External references

- [Free Pascal: Compound statements](https://www.freepascal.org/docs-html/current/ref/refsu55.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
