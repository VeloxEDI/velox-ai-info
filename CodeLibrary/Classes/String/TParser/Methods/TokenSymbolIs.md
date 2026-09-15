---
title: TokenSymbolIs
description: Tests whether the current token is an identifier equal to supplied text under Delphi's case-insensitive comparison.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, symbol, identifier, comparison, branching]
---

```Delphi
function TokenSymbolIs(S: string): Boolean;
```

### Example

```Delphi
procedure HandleKeyword(Parser: TParser);
begin
  if Parser = nil then Exit;

  if Parser.TokenSymbolIs('inherited') then
    Parser.NextToken;
end;
```

### Usage

`TokenSymbolIs` tests whether the current token is an identifier equal to supplied text under Velox's case-insensitive comparison.

### Additional Technical Info
`TokenSymbolIs` returns true only when the current [`Token`](../Properties/Token.md) is `toSymbol` and its [`TokenString`](TokenString.md) compares equal to `S` using Delphi `SameText`. The comparison is case-insensitive; the original token spelling is not changed.

If the current token is a number, string, punctuation or EOF, the result is false. The method does not raise for that kind mismatch. Use it for optional keywords and grammar branches; use [`CheckTokenSymbol`](CheckTokenSymbol.md) when a particular symbol is mandatory and a mismatch should raise.

The test does not call [`NextToken`](NextToken.md), consume the symbol or change the source position. After a true result, the caller must advance explicitly. Repeating the call with the same argument returns the same result until another operation changes parser state.

`S` is compared as a Unicode String after parser decoding. Non-ASCII identifier availability depends on the source encoding and the installed Delphi character-category logic. Do not use this method as a locale-independent security normalization or as proof that a named Velox object/component exists; it is only a lexical comparison.

An empty `S` returns false for every normal symbol because a symbol token always has a nonempty identifier start.

The example is source-reviewed only; no token comparison was executed.

**External references**

- [Embarcadero: `TParser.TokenSymbolIs`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.TokenSymbolIs) - native case-insensitive symbol test.
- [Free Pascal: `TParser.TokenSymbolIs`](https://www.freepascal.org/docs-html/rtl/classes/tparser.tokensymbolis.html) - compatible symbol predicate.

<small>Created 2026-07-15</small>
