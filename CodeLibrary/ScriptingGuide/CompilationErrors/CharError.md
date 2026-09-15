---
title: "Char error"
description: "Cause and correction of a malformed numeric character-code literal."
sidebar_position: 5
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - character
  - lexer
---

Velox reports `Char error` when the script lexer reads a `#` character-code literal that has no valid decimal or hexadecimal digits. This is more specific than a general text or encoding problem.

## Accepted lexical forms

The current lexer recognises a decimal character code after `#` and a hexadecimal code after `#$`:

```Delphi
#65      // Decimal character code
#$41     // Hexadecimal character code
```

A quoted value such as `'A'` is tokenised as a string literal, not through this character-code path.

## Example

These tokens are malformed:

```Delphi
Value := #;       // No decimal digits
Value := #$;      // No hexadecimal digits
Value := #12A;    // A letter follows the decimal form
```

Use a quoted string or a complete numeric code:

```Delphi
Value := 'A';
Value := #65;
Value := #$41;
```

## How Velox detects it

The modified PascalScript lexer scans digits following `#`. In the hexadecimal form, at least one `0`-`9`, `A`-`F` or `a`-`f` digit must follow `#$`. In the decimal form, at least one decimal digit is required and an immediately following letter or underscore makes the token invalid. The lexer raises `iCharError`; the compiler converts that to `ecCharError` and marks the parser as having failed.

An unterminated quoted literal follows the separate string-error path. If the visible source contains quotes rather than `#`, inspect the exact diagnostic before applying this page.

## Common causes

- Leaving a bare `#` or `#$` while editing a literal.
- Using a hexadecimal letter without the `$` marker, such as `#A`.
- Appending an identifier directly to a decimal code without an operator or delimiter.
- Copying a character-escape convention from another language, such as `\x41` or `\u0041`.
- Assuming the diagnostic validates whether a numeric code is meaningful for every downstream encoding. It validates the token form; later conversions still follow the target string/type rules.

## Correction procedure

1. Inspect the token beginning with `#` at or immediately before the reported position.
2. Supply decimal digits, or use `#$` followed by hexadecimal digits.
3. Add an operator or separator before any following identifier.
4. Prefer a quoted string when the intended value is ordinary readable text.
5. Recompile before investigating later parser messages, because this is a lexer-level failure.

## Related reference

- `String error` — malformed or unterminated quoted text.
- `String` — text operators and runtime representation.
- `Syntax error` — invalid tokens that do not use the character-specific path.

## External references

- [Free Pascal: Char or AnsiChar](https://www.freepascal.org/docs-html/current/ref/refsu6.html)
- [Embarcadero DocWiki: Fundamental Syntactic Elements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Fundamental_Syntactic_Elements_%28Delphi%29)

Both upstream pages describe `#` character-code syntax. Their character widths, accepted ranges and later string conversions do not override the Velox lexer rules documented above.
