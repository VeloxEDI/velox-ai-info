---
title: CheckTokenSymbol
description: Requires the current token to be an identifier equal to supplied text under Delphi's case-insensitive comparison rules.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, symbol, identifier, comparison, exception]
---

```Delphi
procedure CheckTokenSymbol(S: string);
```

### Example

```Delphi
procedure RequireObjectKeyword(Parser: TParser);
begin
  if Parser = nil then Exit;

  Parser.CheckTokenSymbol('object');
  Parser.NextToken;
end;
```

### Usage

`CheckTokenSymbol` requires the current token to be an identifier equal to supplied text under Velox's case-insensitive comparison rules.

### Additional Technical Info
`CheckTokenSymbol` requires two conditions: the current token code must be `toSymbol`, and its text must compare equal to `S` using Delphi `SameText`. The comparison is case-insensitive, so `object`, `Object` and `OBJECT` normally match.

On success the current token and source position remain unchanged. On failure the method raises `EParserError` with a message equivalent to "symbol expected" plus the current source line. It does not advance to find a later occurrence.

This is a concise assertion around [`TokenSymbolIs`](TokenSymbolIs.md). Use TokenSymbolIs when branching is valid; use CheckTokenSymbol when the grammar makes the symbol mandatory. After a successful check, call [`NextToken`](NextToken.md) yourself.

The method compares Unicode Strings, but source decoding still follows the parser's constructor-selected encoding. Unicode identifier classification is available on the UTF-8 path; BOM-less non-ASCII text can remain dependent on the host default encoding. Case behavior comes from the installed Delphi Unicode comparison tables and is not an invariant ASCII-only fold.

An empty `S` cannot match a normal identifier because identifier tokens require at least one valid starting character.

The example is source-reviewed only; no parser was executed.

**External references**

- [Embarcadero: `TParser.CheckTokenSymbol`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.CheckTokenSymbol) - native symbol assertion.
- [Free Pascal: `TParser.CheckTokenSymbol`](https://www.freepascal.org/docs-html/rtl/classes/tparser.checktokensymbol.html) - compatible method contract.

<small>Created 2026-07-15</small>
