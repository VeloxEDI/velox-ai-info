---
title: SourceLine
description: Reports the current token's one-based line counter, incremented only when the parser skips an LF byte.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, source-line, line-feed, diagnostics]
---

```Delphi
property SourceLine: Integer read;
```

### Example

```Delphi
procedure CaptureParserLine(Parser: TParser);
var
  LineNumber: Integer;
begin
  if Parser = nil then Exit;

  LineNumber := Parser.SourceLine;
end;
```

### Usage

`SourceLine` reports the current token's one-based line counter, incremented only when the parser skips an LF byte.

### Additional Technical Info
`SourceLine` is the parser's one-based line counter for the current token. It starts at 1. Whenever the parser's whitespace routine runs, including from [`NextToken`](../Methods/NextToken.md) and HexToBinary, each LF byte (`#10`) increments the counter before parsing continues.

CRLF input therefore increments once per physical line because CR is skipped and LF performs the increment. A CR-only file does not increment the counter and can report every token on line 1. Normalize line endings before parsing if reliable line diagnostics are required.

The property counts line-feed bytes encountered by the parser; it is not calculated from the stream on demand. An invalid newline inside a quoted string raises during token scanning instead of becoming normal whitespace. The reported line is thus best treated as parser diagnostic context rather than a complete text-editor line model.

Reading SourceLine does not advance or perform I/O. [`ErrorStr`](../Methods/ErrorStr.md) includes this value in the native `EParserError` message. Use [`SourcePos`](../Methods/SourcePos.md) when a byte offset is also required.

The value is mutable parser state and is not thread-safe. It remains unchanged until scanning crosses another LF.

The example is source-reviewed only; no property was read.

**External references**

- [Embarcadero: `TParser.SourceLine`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.SourceLine) - native current-line property.
- [Free Pascal: `TParser.SourceLine`](https://www.freepascal.org/docs-html/rtl/classes/tparser.sourceline.html) - compatible one-based parser line counter.

<small>Created 2026-07-15</small>
