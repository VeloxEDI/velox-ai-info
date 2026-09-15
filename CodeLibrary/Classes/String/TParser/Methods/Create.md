---
title: Create
description: Creates a parser over a borrowed readable seekable stream, performs buffered encoding detection and positions it on the first token.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, constructor, stream, encoding, ownership]
---

```Delphi
constructor Create(Stream: TStream);
```

### Example

```Delphi
procedure ReadFirstToken(const Text: String);
var
  Source: TStringStream;
  Parser: TParser;
begin
  Source := TStringStream.Create(Text);
  try
    Parser := TParser.Create(Source);
    try
      // Parser.Token already describes the first token.
    finally
      Parser.Free;
    end;
  finally
    Source.Free;
  end;
end;
```

### Usage

Creates a parser over a borrowed readable seekable stream, performs buffered encoding detection and positions it on the first token.

### Additional Technical Info
`Create` constructs a `TParser` over `Stream`. The stream is borrowed: the parser stores its reference but does not free it. Keep the stream alive until after the parser is freed, then release the parser before releasing the stream.

Construction is eager, not lazy. The installed Delphi implementation:

1. Stores a snapshot of the process's default `FormatSettings`.
2. Allocates a 4096-byte buffer and reads from the stream's current Position.
3. Detects an encoding/preamble and skips a recognized UTF-8 BOM.
4. Rejects an encoding object other than ASCII, ANSI/default or UTF-8; in particular, detected UTF-16 input is rejected.
5. Calls [`NextToken`](NextToken.md), leaving [`Token`](../Properties/Token.md) on the first token before Create returns.

BOM-less input uses `TEncoding.Default`, so non-ASCII bytes can decode differently on hosts with different default code pages. Use a UTF-8 BOM or constrain source text to ASCII when portability matters.

The stream must support Read and later Seek. Buffering moves its visible cursor ahead of the logical token. When the parser is destroyed, Delphi seeks backward so the stream is positioned at the start of the current token. This cleanup seek can itself fail on a nonseekable or prematurely freed stream. Do not inspect or move the stream Position concurrently with the parser.

Only the one-argument scripting constructor is exposed. Native overloads that accept an `OnError` callback or explicit `TFormatSettings` are unavailable. Parse errors during construction raise and no parser instance is returned. The stream remains caller-owned and may already have been read or repositioned by constructor cleanup.

A nil stream is not checked explicitly; the first buffered Read dereferences it and fails. Validate the reference before construction.

The example is source-reviewed only; no parser or stream was executed.

**External references**

- [Embarcadero: `TParser.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.Create) - native constructor overloads and parser initialization.
- [Free Pascal: `TParser.Create`](https://www.freepascal.org/docs-html/rtl/classes/tparser.create.html) - compatible eager first-token behavior.

<small>Created 2026-07-15</small>
