---
title: CheckToken
description: Requires the current parser token to have one exact character code and raises a token-specific parser error when it does not.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, token, validation, exception]
---

```Delphi
procedure CheckToken(T: Char);
```

### Example

```Delphi
procedure RequireIdentifier(Parser: TParser);
begin
  if Parser = nil then Exit;

  Parser.CheckToken(toSymbol);
  // The current token is unchanged; read it before advancing.
end;
```

### Usage

`CheckToken` requires the current parser token to have one exact character code and raises a token-specific parser error when it does not.

### Additional Technical Info
`CheckToken` compares `T` with the current [`Token`](../Properties/Token.md). A match returns without changing parser state. A mismatch raises `EParserError`; it does not search ahead, consume input or recover.

The generated message depends on the requested code. `toSymbol` reports that an identifier was expected; `toString` and the native `toWString` code report a string; `toInteger` and `toFloat` report a number. Other values report the literal expected character. Delphi then appends the current [`SourceLine`](../Properties/SourceLine.md) through the common parser-error formatter.

Use this method before a type-specific getter when the grammar requires an exact kind:

- Check `toSymbol` before [`TokenComponentIdent`](TokenComponentIdent.md).
- Check `toInteger` before [`TokenInt`](TokenInt.md).
- Check `toFloat` before [`TokenFloat`](TokenFloat.md), or accept both integer and float deliberately if the grammar permits either.
- Check literal punctuation such as `'='`, `'('` or `'}'` directly.

`CheckToken` does not advance. Call [`NextToken`](NextToken.md) explicitly after consuming the value. Repeated successful checks are harmless; repeated failures continue to raise at the same token.

The constructor exposed to scripts installs no OnError callback, so the current Velox-created parser cannot suppress the exception. Handle it at the flow boundary when input can be invalid.

The example is source-reviewed only; no parser was executed.

**External references**

- [Embarcadero: `TParser.CheckToken`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.CheckToken) - native token-kind assertion.
- [Free Pascal: `TParser.CheckToken`](https://www.freepascal.org/docs-html/rtl/classes/tparser.checktoken.html) - compatible method contract.

<small>Created 2026-07-15</small>
