---
title: "Comment error"
description: "Cause and correction of an unterminated or invalid Velox script comment."
sidebar_position: 11
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - comments
  - lexer
---

Velox reports `Comment error` when the lexer reaches the end of the script before a block comment has closed. Line comments do not require a closing delimiter.

## Supported comments

```Delphi
// Continues to the end of the line

{ A brace-delimited block comment }

(* A parenthesis-star block comment *)
```

## Example

This brace comment never closes:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  { Explain the value
  Value := 'Ready';
end;
```

Close the comment before executable code resumes:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  { Explain the value }
  Value := 'Ready';
end;
```

The same rule applies to `(* ... *)` comments.

## How Velox detects it

The modified PascalScript lexer recognises `//`, `{...}` and `(*...*)`. A block comment scan that reaches end of input without its matching closing delimiter raises `iCommentError`. The compiler converts that lexer condition to `ecCommentError`, marks the parser as failed and prevents successful compilation.

Block comments are not nested. The first matching terminator closes the active comment; an opening comment marker inside it is just comment text. Mixing `{` with `*)`, or `(*` with `}`, does not close the block.

## Location behaviour

Because the failure is known only at end of input, the displayed row and column may be the final script position rather than the opening delimiter. Search backwards from the end, especially through recently disabled blocks of code. Text that appears to be executable may actually have been consumed as part of the comment.

## Correction procedure

1. Search for every `{` and `(*` before the reported end position.
2. Pair each with the correct `}` or `*)` delimiter.
3. Remove attempted nested block comments; use `//` inside a temporarily commented region if necessary.
4. Check whether a closing delimiter was itself removed or placed after text that the script editor does not include.
5. Recompile after correcting the earliest unclosed block.

## Common causes

- Commenting out a region that already contains block comments.
- Starting with one block-comment style and ending with the other.
- Deleting a closing delimiter while editing nearby code.
- Assuming braces inside quoted strings or other comment text create balanced nested comments.

## Related reference

- `Comments` — supported forms and recommended use.
- `Unexpected end of file` — incomplete source structures not classified as comments.
- `String error` — unterminated quoted text.

## External references

- [Free Pascal: Comments](https://www.freepascal.org/docs-html/current/ref/refse2.html)
- [Embarcadero DocWiki: Fundamental Syntactic Elements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Fundamental_Syntactic_Elements_%28Delphi%29)

Free Pascal can support nested comments in some modes, and Delphi permits some differently delimited comment combinations. The current Velox lexer does not nest either block-comment form; its implementation remains authoritative.
