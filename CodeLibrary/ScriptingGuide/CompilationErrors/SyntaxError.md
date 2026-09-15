---
title: "Syntax error"
description: "How to diagnose the Velox compiler's broad fallback for unsupported or misplaced source tokens."
sidebar_position: 39
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - syntax
  - parser
---

`Syntax error` is the compiler's broad fallback when the current token sequence matches no supported Velox PascalScript grammar and no more specific expected-token diagnostic applies. Fix the earliest error in the output; this message often reflects a parser that has already lost the intended structure.

## Exact string-token example

Two complete quoted strings are not implicitly concatenated:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := 'Velox' ' scripting'; // Error: Syntax error
end;
```

Use the string operator or one literal:

```Delphi
Value := 'Velox' + ' scripting';
```

## Current emission families

The modified compiler emits `ecSyntaxError` from these principal paths:

- the string reader encounters one string token immediately after another;
- the runtime-expression factor reader receives a token that cannot start a value, identifier, supported unary construct or parenthesised expression;
- the constant-expression factor reader receives an unsupported starting token; and
- the lexer reports its generic `iSyntaxError` parser-error kind.

More specific lexer failures are mapped separately: unterminated comments become `Comment error`, unterminated strings become `String error`, and malformed `#` character codes become `Char error`.

## Diagnostic procedure

1. Fix any earlier diagnostic before this one.
2. Inspect the token at the reported row and the complete expression or declaration immediately before it.
3. Check missing operators, assignment tokens, delimiters and reserved keywords.
4. Compare the construct with a working Velox Scripting Guide example, not with an arbitrary modern Delphi feature.
5. Reduce a copy to the smallest failing expression when the grammar remains unclear.

## Edge cases and quirks

- Velox embeds a modified PascalScript compiler, not the current full Delphi language. Valid Delphi syntax can still be unsupported here.
- The compiler may report the token where parsing became impossible, not where the original omission occurred.
- `'Don''t'` is one valid string token containing an apostrophe; `'Don' 't'` is two tokens and reaches the adjacent-string syntax error.
- A generic syntax error has no runtime side effect because compilation does not complete.

## Related reference

- `String error` - a string token is unclosed rather than adjacent.
- `Identifier expected` - the grammar knows specifically that a name is required.
- `Internal error` - an implementation failure, not an ordinary unsupported token sequence.
- `Scripting` - supported language scope and compilation pipeline.

## External references

- [Free Pascal: Character strings](https://www.freepascal.org/docs-html/ref/refse8.html)
- [Embarcadero DocWiki: Fundamental Syntactic Elements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Fundamental_Syntactic_Elements_%28Delphi%29)
