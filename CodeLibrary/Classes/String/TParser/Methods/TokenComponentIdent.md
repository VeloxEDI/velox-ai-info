---
title: TokenComponentIdent
description: Validates and consumes an immediately dotted component identifier while retaining it as the current symbol token.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, component, identifier, dotted-name, token]
---

```Delphi
function TokenComponentIdent: string;
```

### Example

```Delphi
procedure ReadQualifiedName(Parser: TParser);
var
  Name: String;
begin
  if Parser = nil then Exit;

  Name := Parser.TokenComponentIdent; // Example: Form1.Button1.Caption
  Parser.NextToken;
end;
```

### Usage

`TokenComponentIdent` validates and consumes an immediately dotted component identifier while retaining it as the current symbol token.

### Additional Technical Info
`TokenComponentIdent` returns the current identifier plus every immediately adjacent `.identifier` segment. It is designed for component paths such as `Form1.Panel1.Caption`.

The current token must be `toSymbol`; otherwise [`CheckToken`](CheckToken.md) raises. Starting at the parser cursor just after that symbol, the method repeatedly accepts a literal period followed immediately by a valid identifier-start character and then its continuation characters. Whitespace around a period is not accepted as part of the path.

This method consumes the dotted suffix by moving the internal source cursor, but it does not call [`NextToken`](NextToken.md) and it does not change [`Token`](../Properties/Token.md) from `toSymbol`. [`TokenString`](TokenString.md) then spans the complete dotted name, and [`SourcePos`](SourcePos.md) still points to its first segment. The caller should call NextToken once after using the result; doing so advances from the end of the whole path.

If an immediately adjacent period is not followed immediately by a valid identifier start, the method raises a parser error after consuming state up to the failure; whitespace after that period is therefore an error. The operation is not rolled back. If whitespace occurs before the period, scanning stops before it and a later NextToken returns the period as punctuation.

Identifier rules match [`NextToken`](NextToken.md): ASCII letters and underscore are valid starts, digits are continuation-only, and supported UTF-8 Unicode letter categories can participate. Case is preserved; no component lookup or existence check occurs.

The example is source-reviewed only; no component identifier was parsed.

**External references**

- [Embarcadero: `TParser.TokenComponentIdent`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.TokenComponentIdent) - native dotted-component identifier parser.
- [Free Pascal: `TParser.TokenComponentIdent`](https://www.freepascal.org/docs-html/rtl/classes/tparser.tokencomponentident.html) - compatible method contract.

<small>Created 2026-07-15</small>
