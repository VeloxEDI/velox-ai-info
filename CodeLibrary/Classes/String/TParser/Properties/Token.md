---
title: Token
description: Returns the character code for the parser's current identifier, string, number, punctuation or end-of-file token.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, token, kind, punctuation, eof]
---

```Delphi
property Token: Char read;
```

### Example

```Delphi
procedure InspectCurrentToken(Parser: TParser);
begin
  if Parser = nil then Exit;

  if Parser.Token = toEOF then Exit;
  if Parser.Token = toSymbol then
  begin
    // Read Parser.TokenString before calling NextToken.
  end;
end;
```

### Usage

Returns the character code for the parser's current identifier, string, number, punctuation or end-of-file token.

### Additional Technical Info
`Token` identifies the parser's current lexical item. [`Create`](../Methods/Create.md) reads the first token before returning, and each [`NextToken`](../Methods/NextToken.md) replaces the property with the newly scanned token code. Reading the property does not advance.

| Code | Meaning |
|---:|---|
| `toEOF` / 0 | End of input |
| `toSymbol` / 1 | Identifier/symbol |
| `toString` / 2 | Ordinary decoded string |
| `toInteger` / 3 | Integer-shaped source text |
| `toFloat` / 4 | Float-shaped source text |
| native `toWString` / 5 | Wide numeric-hash string; its intended getter is not exposed by Velox |
| any other Char | Literal punctuation character, such as `=`, `{` or `]` |

Velox registers `toEOF` through `toFloat` as hidden compiler constants: scripts can use those five names even though they do not appear as public Code Library entries. Native `toWString` is not registered. A numeric token code describes how text was scanned, not proof that it converts successfully; use [`TokenInt`](../Methods/TokenInt.md) or [`TokenFloat`](../Methods/TokenFloat.md) and handle conversion errors.

[`TokenString`](../Methods/TokenString.md) retrieves text for the current state. [`CheckToken`](../Methods/CheckToken.md) asserts a code without consuming it. [`TokenComponentIdent`](../Methods/TokenComponentIdent.md) is unusual: it can consume a dotted suffix while Token remains toSymbol.

[`HexToBinary`](../Methods/HexToBinary.md) also performs internal source consumption and finishes with Token set to the closing `}` rather than the token after it. Account for these method-specific state transitions before calling NextToken.

The property is unsynchronized mutable state. Do not inspect it concurrently with parser navigation from another execution path.

The example is source-reviewed only; no token was inspected.

**External references**

- [Embarcadero: `TParser.Token`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.Token) - native current-token property.
- [Free Pascal: `TParser.Token`](https://www.freepascal.org/docs-html/rtl/classes/tparser.token.html) - compatible token-code property.

<small>Created 2026-07-15</small>
