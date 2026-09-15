---
title: TokenString
description: Returns decoded ordinary string content or the encoded source span for the current non-string token without advancing.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, token, string, decoding, wide-string]
---

```Delphi
function TokenString: string;
```

### Example

```Delphi
procedure ReadSymbolText(Parser: TParser);
var
  Text: String;
begin
  if Parser = nil then Exit;

  Parser.CheckToken(toSymbol);
  Text := Parser.TokenString;
  Parser.NextToken;
end;
```

### Usage

`TokenString` returns decoded ordinary string content or the encoded source span for the current non-string token without advancing.

### Additional Technical Info
`TokenString` returns a String representation of the current token and does not advance it. Its exact result depends on the token kind.

| Current token | Result |
|---|---|
| `toString` | Decoded content assembled from adjacent quoted and numeric-hash segments; quote delimiters, doubled-quote escapes and `#` notation are removed. |
| `toSymbol` | Identifier text decoded with the parser's selected encoding. After TokenComponentIdent, this includes the full dotted path. |
| `toInteger` / `toFloat` | Original numeric source text. A float suffix remains in this String even though TokenFloat temporarily excludes it for conversion. |
| Literal punctuation | That one-character source token. |
| `toEOF` | Empty String. |

Ordinary quoted text can contain a quote represented as `''`. Decimal forms such as `#65` and hex forms such as `#$41` contribute a character, and adjacent segments are concatenated. Numeric code zero can produce an embedded NUL in the Delphi String; String length, rather than C-style termination, governs downstream behavior.

#### Encoding behavior

ASCII token bytes use a fast direct conversion. If a token span contains high bytes, Delphi decodes it with the encoding chosen at construction. UTF-8 input is therefore decoded as UTF-8, while BOM-less input can use the host's default encoding.

There is an important wide-hash-string gap. If any numeric hash code exceeds 127, native [`NextToken`](NextToken.md) produces `toWString` and stores the decoded value in `TokenWideString`. Velox exposes neither TokenWideString nor a normal public entry for `toWString`. Calling TokenString in that state follows the non-toString path and returns the original source notation instead of the intended decoded wide value. Avoid such input when consuming strings through this scripting surface.

Numeric hash values are accumulated without an explicit Unicode range validation in the scanner. Very large codes are narrowed by the native wide-character assignment. Treat malformed or out-of-range hash syntax as untrusted rather than a portable escaping scheme.

TokenString does not assert a kind. Use [`CheckToken`](CheckToken.md) when the grammar requires one, and call NextToken separately after using the returned text.

The example is source-reviewed only; no token text was decoded.

**External references**

- [Embarcadero: `TParser.TokenString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.TokenString) - native current-token String conversion.
- [Free Pascal: `TParser.TokenString`](https://www.freepascal.org/docs-html/rtl/classes/tparser.tokenstring.html) - compatible token-text getter.

<small>Created 2026-07-15</small>
