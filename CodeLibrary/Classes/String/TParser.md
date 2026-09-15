---
title: TParser
description: Tokenizes Delphi component-text syntax from a borrowed stream with eager read-ahead, typed token access and source-position tracking.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, tokenizer, dfm, stream, component-text]
---

```Delphi
TParser = class(TObject)
```

### Example

```Delphi
procedure ListComponentTextTokens(const Text: String);
var
  Source: TStringStream;
  Parser: TParser;
begin
  Source := TStringStream.Create(Text);
  try
    Parser := TParser.Create(Source);
    try
      while Parser.Token <> toEOF do
      begin
        // Parser.TokenString returns the current token's text.
        Parser.NextToken;
      end;
    finally
      Parser.Free;
    end;
  finally
    Source.Free;
  end;
end;
```

### Usage

`TParser` tokenizes Velox component-text syntax from a borrowed stream with eager read-ahead, typed token access and source-position tracking.

### Additional Technical Info
`TParser` is Delphi's stateful tokenizer for textual component streams such as DFM content. It reads from a borrowed [`TStream`](../Stream/TStream.md), keeps one current token, exposes that token through [`Token`](TParser/Properties/Token.md), and advances only when [`NextToken`](TParser/Methods/NextToken.md) or a method with documented consumption behavior is called.

It is useful for component-text-shaped data, but it is not a general Pascal parser, expression parser, JSON parser or validation framework. It recognizes identifiers, Delphi quoted/hash-code strings, decimal and dollar-prefixed integers, permissively scanned floating-point text, single-character punctuation and end of file. It does not provide a configurable grammar.

#### Lifecycle and stream behavior

[`Create`](TParser/Methods/Create.md) immediately allocates a 4096-byte buffer, reads ahead and calls NextToken, so a new parser is already positioned on its first token. The source stream must be readable and seekable. TParser borrows it: the parser neither owns nor frees the stream.

Read-ahead means the source stream's visible Position can be well beyond the current token while the parser exists. On destruction, Delphi seeks the stream back to the start of the current token. Free the parser before reusing the stream, and do not let another consumer move or read the shared stream concurrently.

The exposed constructor has no error callback and no explicit format-settings overload. Parse failures therefore raise an exception, and float conversion uses the native default format-settings snapshot selected during construction.

#### Encodings and line limits

The parser accepts its installed Delphi implementation's ASCII/ANSI/default or UTF-8 paths. A UTF-8 BOM is detected and skipped. UTF-16 little- or big-endian BOMs are detected but rejected. BOM-less input uses `TEncoding.Default`, which makes non-ASCII interpretation host-dependent.

Buffer refill retains an incomplete physical line. A line that fills the parser buffer without a line boundary raises a line-too-long error; do not use this class for arbitrarily long unbroken input. [`SourceLine`](TParser/Properties/SourceLine.md) is one-based and increments on LF bytes.

#### Token model

Velox registers the first five token constants as hidden compiler constants, so scripts can compare them even though they have no public Constant pages. Native Delphi can also return a sixth code that Velox does not register:

| Constant | Character code | Meaning |
|---|---:|---|
| `toEOF` | 0 | End of input |
| `toSymbol` | 1 | Identifier/symbol text |
| `toString` | 2 | Ordinary decoded string token |
| `toInteger` | 3 | Integer text |
| `toFloat` | 4 | Floating-point text |
| native `toWString` | 5 | Wide hash-string token; neither this constant nor TokenWideString is registered for scripts |

Any other Token value is the literal punctuation character read from the stream. Whitespace has no token. Methods such as [`CheckToken`](TParser/Methods/CheckToken.md), [`CheckTokenSymbol`](TParser/Methods/CheckTokenSymbol.md) and [`TokenSymbolIs`](TParser/Methods/TokenSymbolIs.md) inspect current state without advancing it.

The installed UTF-8 identifier classifier is not a strict UTF-8 validator. In its four-byte code-point calculation it uses the third continuation byte for both the third and fourth positions. Non-BMP identifier characters can therefore be classified incorrectly, and malformed sequences can also reach category lookup. Keep portable identifiers within ASCII unless the exact host behavior has been independently established.

#### PascalScript adaptations

Velox narrows native `SourcePos: NativeInt` to LongInt and native `TokenInt: Int64` to LongInt. Large streams and integer literals therefore cross a 32-bit boundary. The registered `Error(Integer)` declaration also disagrees with the current native String/resource-pointer overloads; use [`ErrorStr`](TParser/Methods/ErrorStr.md), not Error, for an intentional script-generated parser failure.

TParser is mutable and not thread-safe. Treat input as untrusted: malformed data raises, large input can consume processing time or grow a destination passed to HexToBinary, and no parser operation is transactional.

The example is source-reviewed only; no parser or stream was executed.

**External references**

- [Embarcadero: `TParser`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser) - Delphi class and token-navigation model.
- [Free Pascal: `TParser`](https://www.freepascal.org/docs-html/rtl/classes/tparser.html) - compatible component-text parser overview.

<small>Created 2026-07-15</small>
