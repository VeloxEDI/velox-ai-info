---
title: HexToBinary
description: Decodes whitespace-separated hexadecimal pairs through the next closing brace and writes bytes at a borrowed stream's current cursor.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, hexadecimal, binary, stream, partial-write]
---

```Delphi
procedure HexToBinary(Stream: TStream);
```

### Example

```Delphi
procedure DecodeBraceBody(const Text: String; Output: TStream);
var
  Source: TStringStream;
  Parser: TParser;
begin
  if Output = nil then Exit;

  Source := TStringStream.Create(Text); // Example: '{ 41 42 43 }'
  try
    Parser := TParser.Create(Source);
    try
      Parser.CheckToken('{');
      Parser.HexToBinary(Output);
      Parser.CheckToken('}');
    finally
      Parser.Free;
    end;
  finally
    Source.Free;
  end;
end;
```

### Usage

`HexToBinary` decodes whitespace-separated hexadecimal pairs through the next closing brace and writes bytes at a borrowed stream's current cursor.

### Additional Technical Info
`HexToBinary` decodes the hexadecimal body that follows the parser's current token and writes decoded bytes to `Stream`. Its intended component-text form is `{ 00 FF ... }`: call it while the current token is the opening brace.

The method starts at the parser's internal source cursor, skips bytes treated as whitespace, and processes complete hexadecimal pairs in chunks of at most 256 output bytes. Uppercase and lowercase `A` through `F` are accepted. Whitespace may occur between chunks, but not inside a two-digit byte pair.

Scanning stops only when the next nonblank character is `}`. The method then calls [`NextToken`](NextToken.md) while positioned on that character, so the current [`Token`](../Properties/Token.md) becomes the closing brace. It does not advance to the token after the brace.

#### Destination behavior

`Stream` is borrowed and is not freed. Bytes are written at its current Position; the method does not clear, resize, rewind or restore it. A nil or nonwritable stream fails through the native call.

Each decoded chunk is passed to native `TStream.Write`, and the returned byte count is ignored. A descendant that returns a short write without raising can therefore lose bytes silently. Exceptions can leave partial output and advanced source/destination state; the operation is not transactional.

#### Invalid and unbounded input

An invalid hex character or an incomplete final pair makes the chunk decoder return zero at that point and raises a parser error. There is no declared byte count and no destination-size limit: a very large well-formed brace body can grow a memory/file destination until a resource or I/O failure occurs. Apply an input-size boundary before parsing untrusted data.

The method works on raw encoded source bytes and recognizes only ASCII hexadecimal characters. It does not accept prefixes such as `$`, `0x`, separators such as commas, or an absent closing brace.

The example is source-reviewed only; no data was decoded or written.

**External references**

- [Embarcadero: `TParser.HexToBinary`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.HexToBinary) - native component-text hex decoder.
- [Free Pascal: `TParser.HexToBinary`](https://www.freepascal.org/docs-html/rtl/classes/tparser.hextobinary.html) - compatible brace-body decoder.

<small>Created 2026-07-15</small>
