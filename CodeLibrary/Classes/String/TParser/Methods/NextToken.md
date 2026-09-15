---
title: NextToken
description: Skips component-text whitespace, scans the next Delphi token and replaces the parser's current token state.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, tokenizer, identifier, string, number, punctuation]
---

```Delphi
function NextToken: Char;
```

### Example

```Delphi
procedure AdvanceIfPresent(Parser: TParser);
var
  Kind: Char;
begin
  if Parser = nil then Exit;

  Kind := Parser.NextToken;
  if Kind = toSymbol then
  begin
    // Parser.TokenString is now the new symbol text.
  end;
end;
```

### Usage

`NextToken` skips component-text whitespace, scans the next Velox token and replaces the parser's current token state.

### Additional Technical Info
`NextToken` advances from the current token to the next component-text token, stores its character code in [`Token`](../Properties/Token.md), and returns the same code. `Create` calls it once automatically, so do not call NextToken merely to obtain the first token.

The method first skips input bytes 0 through 32. LF (`#10`) increments [`SourceLine`](../Properties/SourceLine.md); CR is skipped without a separate increment. A buffer sentinel triggers another source read. Reaching a sentinel with no more bytes returns `toEOF` (`Char(0)`).

#### Recognized tokens

| Input shape | Token code | Notes |
|---|---|---|
| Letter/underscore identifier | `toSymbol` | Continues through letters, combining/connector categories and digits. UTF-8 Unicode categories are attempted on the UTF-8 path. |
| Quoted/hash-code string | `toString` or native `toWString` | Adjacent `'text'`, doubled quotes, `#123` and `#$7B` segments are combined. A code above 127 selects the wide path. |
| `$` followed by hex digits | `toInteger` | The scanner does not require at least one digit; conversion validates later. |
| `-` or digit-led numeric text | `toInteger` or `toFloat` | Any later `.`, `e`, `E`, `+` or `-` makes it a float; optional `c/d/s/f` suffix also makes it a float. |
| Any other nonblank byte | that literal Char | Punctuation such as `=`, `[`, `]`, `{` and `}` is a one-character token. |

Numeric scanning is intentionally lexical and permissive. Text such as `1+2`, `1..2`, `-` or `$` can receive a numeric token code and then fail in [`TokenFloat`](TokenFloat.md) or [`TokenInt`](TokenInt.md). A leading `+` is punctuation, not part of a number. Validate conversion exceptions rather than treating the token code as proof of a valid value.

Quoted strings cannot cross CR/LF or EOF. Two consecutive quote characters inside a quoted segment represent one quote. Hash-code segments accept decimal or dollar-prefixed hex digits; the current implementation does not require a digit after `#`, so malformed forms can create a zero code rather than failing immediately.

If any hash code is above 127, native Delphi returns `toWString` and stores decoded content in `TokenWideString`. Velox exposes neither that getter nor the token constant as a documented public entry. [`TokenString`](TokenString.md) therefore does not provide the intended decoded wide value for that state; avoid wide `#nnn` strings in script-parsed input.

The installed Delphi UTF-8 identifier helper does not fully validate continuation bytes. Its four-byte code-point expression also uses the third continuation byte twice and never incorporates the fourth. Non-BMP characters can consequently receive the wrong Unicode category and be accepted or rejected inconsistently. ASCII identifiers avoid this implementation defect.

NextToken changes the parser state even when later conversion fails. It performs buffered stream reads and can raise for an invalid string, unsupported encoding, line exceeding the fixed buffer, or underlying I/O failure. It is not thread-safe and does not roll back.

The example is source-reviewed only; no token was advanced.

**External references**

- [Embarcadero: `TParser.NextToken`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.NextToken) - native navigation method.
- [Free Pascal: `TParser.NextToken`](https://www.freepascal.org/docs-html/rtl/classes/tparser.nexttoken.html) - compatible token-advance contract.

<small>Created 2026-07-15</small>
