---
title: "Unexpected end of file"
description: "Why the compiler reached the end of source before the current declaration or block was complete."
sidebar_position: 43
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - end-of-file
  - blocks
---

Velox reports `Unexpected end of file` when it reaches the end of the compiled source while a statement block or required outer source structure is still open. The reported end position is where the compiler proved that more source was required; the missing token is usually earlier.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Value = '' then
  begin
    Value := 'missing end';
end; // Error: the procedure block is still open at end of source
```

Close every nested block before closing the routine:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Value = '' then
  begin
    Value := 'complete';
  end;
end;
```

## How Velox detects it

There are two current emission paths:

- While compiling a routine or nested structured block, the statement compiler encounters the end-of-source token before the block's terminating keyword.
- At the outer compile loop, the parser reaches end of source while the required top-level structure remains incomplete.

Velox enables an embedded-compiler option that can relax the final outer `end` requirement for supported wrapper forms. That option does not close an unfinished procedure, `begin..end`, `case`, `try`, loop or other nested structure. Nested EOF still produces this error.

## Correction procedure

1. Repair the first diagnostic in the compiler output before this one.
2. Starting at the reported routine, pair every `begin` with `end`.
3. Check structured terminators such as `until`, `except` and `finally`, and the `end` belonging to `case`, `try`, class or record declarations.
4. Check included source as part of the same compilation; the opening construct and EOF can be in different physical inputs.
5. Recompile after the structural correction. Do not append `end` repeatedly without identifying which construct owns it.

## Edge cases and quirks

- An unterminated string or block comment is normally detected by the lexer as `String error` or `Comment error`, not this parser diagnostic.
- Missing closing parentheses, brackets or required punctuation can produce their specific diagnostic before EOF. Fix that earlier message first.
- A missing `end` can make the parser treat later valid statements as part of the wrong block; the last line is not necessarily defective.
- `if` and loop bodies consisting of one statement do not require an extra `begin..end`, but any `begin` that is present must be closed.
- Compiler options that accept a shortened outer wrapper do not make nested blocks optional.
- This is a compile-time error. No part of the event executes.

## Related reference

- `END expected` - the parser reached a token where a specific `end` was required.
- `BEGIN expected` - a required block body did not start.
- `Comment error` - a block comment reached end of source without closing.
- `String error` - a quoted string reached a line or source boundary without closing.

## External references

- [Free Pascal: Compound statements](https://www.freepascal.org/docs-html/ref/refsu55.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
