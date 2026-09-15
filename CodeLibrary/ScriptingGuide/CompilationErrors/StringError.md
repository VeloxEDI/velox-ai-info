---
title: "String error"
description: "Cause and correction of a single-quoted Velox string literal that reaches a line ending or file end unclosed."
sidebar_position: 37
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - strings
  - lexer
---

Velox reports `String error` when its lexer starts a single-quoted string and reaches a carriage return, line feed or end of source before a closing apostrophe. String literals cannot span physical source lines.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := 'Unclosed text; // Error: String error
end;
```

Close the literal on the same line:

```Delphi
Value := 'Closed text';
```

Represent an apostrophe by doubling it:

```Delphi
Value := 'Cameron''s mapping';
```

## How Velox detects it

The modified PascalScript lexer scans from the opening `'` until it finds an unpaired closing `'`. Two adjacent apostrophes inside the token are treated as one embedded apostrophe and scanning continues. If the scan instead reaches `#13`, `#10` or the terminating null character, it returns a string token and raises parser error kind `iStringError`; the compiler converts that to `ecStringError`.

Because the malformed text is still tokenised as a string for recovery, later diagnostics can be secondary consequences of the missing delimiter.

## Correction procedure

1. Start at the reported line and find the unmatched opening apostrophe.
2. Add its closing apostrophe before the physical line ending.
3. Double any apostrophe that belongs inside the text.
4. Use `+` and explicit line-break character values when constructing multi-line text; do not place a literal newline inside one quoted token.
5. Recompile and reassess later errors only after this lexer error is gone.

## Edge cases and quirks

- A backslash does not escape an apostrophe in Velox Pascal syntax.
- An empty string is `''` and is valid.
- Two separate quoted strings divided by whitespace are not implicit concatenation in this compiler; they reach the separate `Syntax error` path.
- The lexer operates on source characters before runtime encoding or Variant conversion. This error says nothing about the eventual string's code page or destination encoding.

## Related reference

- `Syntax error` - adjacent complete quoted-string tokens without an operator.
- `Char error` - malformed `#` numeric character-code syntax.
- `String Expected` - a grammar position requires a string token but receives another valid token.

## External references

- [Free Pascal: Character strings](https://www.freepascal.org/docs-html/ref/refse8.html)
- [Embarcadero DocWiki: E2052 Unterminated string (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/E2052_Unterminated_string_%28Delphi%29)
- [Embarcadero DocWiki: Fundamental Syntactic Elements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Fundamental_Syntactic_Elements_%28Delphi%29)
