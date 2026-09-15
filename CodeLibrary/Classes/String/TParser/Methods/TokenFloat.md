---
title: TokenFloat
description: Converts current numeric token text to Extended using construction-time format settings and temporarily removes a Delphi float suffix.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, float, extended, locale, conversion, suffix]
---

```Delphi
function TokenFloat: Extended;
```

### Example

```Delphi
procedure ReadFloatingValue(Parser: TParser);
var
  Number: Extended;
begin
  if Parser = nil then Exit;

  Parser.CheckToken(toFloat);
  Number := Parser.TokenFloat;
  Parser.NextToken;
end;
```

### Usage

`TokenFloat` converts current numeric token text to Extended using construction-time format settings and temporarily removes a Velox float suffix.

### Additional Technical Info
`TokenFloat` passes the current token text to Delphi `StrToFloat` and returns an `Extended`. It does not itself verify that [`Token`](../Properties/Token.md) is `toFloat`; call [`CheckToken`](CheckToken.md) or implement an intentional integer-or-float branch first.

The parser scanner accepts digits and any subsequent combination of `.`, `e`, `E`, `+` and `-`. It can therefore classify malformed text such as `1+2` or `1..2` as a float. TokenFloat is the conversion step that raises `EConvertError` when that text is invalid.

#### Format settings

Conversion uses the `TFormatSettings` snapshot passed to the native constructor. Velox exposes only `Create(Stream)`, which supplies the process's default FormatSettings at construction. The lexer always recognizes a period as part of numeric text, but StrToFloat applies the captured decimal separator. On a host configured for a comma decimal separator, a normal component-text value containing `.` can therefore fail. This is a native/importer limitation because the explicit-format-settings constructor is not exposed.

#### Delphi suffixes and failure mutation

If [`NextToken`](NextToken.md) sees a trailing `c`, `d`, `s` or `f` (either case), it classifies the token as toFloat and records the suffix. TokenFloat temporarily decrements the internal source cursor so the suffix is excluded from conversion, then restores the cursor after a successful StrToFloat.

There is no `try/finally` around that temporary change. If conversion raises for a suffixed token, the cursor remains one byte before its previous position. Catching the exception and continuing can therefore expose the suffix again or otherwise desynchronize the parse. Treat a TokenFloat exception as terminal for that parser unless the input is restarted from a known stream position.

The suffix does not change the returned PascalScript type; every successful call returns Extended. The method does not advance on success.

The example is source-reviewed only; no numeric conversion was executed.

**External references**

- [Embarcadero: `TParser.TokenFloat`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.TokenFloat) - native token conversion.
- [Free Pascal: `TParser.TokenFloat`](https://www.freepascal.org/docs-html/rtl/classes/tparser.tokenfloat.html) - compatible numeric-token getter.

<small>Created 2026-07-15</small>
