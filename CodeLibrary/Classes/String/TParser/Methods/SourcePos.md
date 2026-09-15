---
title: SourcePos
description: Returns the current token's zero-based byte offset from the stream position where parsing began, narrowed to a script LongInt.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, position, byte-offset, longint, narrowing]
---

```Delphi
function SourcePos: LongInt;
```

### Example

```Delphi
procedure RecordTokenOffset(Parser: TParser);
var
  Offset: LongInt;
begin
  if Parser = nil then Exit;

  Offset := Parser.SourcePos;
end;
```

### Usage

`SourcePos` returns the current token's zero-based byte offset from the stream position where parsing began, narrowed to a script LongInt.

### Additional Technical Info
`SourcePos` returns the byte offset at which the current token starts. Offset zero is the source stream Position captured when parsing began, not necessarily byte zero of the underlying stream. Whitespace skipped before the token is included in the offset.

The result is a source-byte position, not a Unicode character index and not the source stream's current Position. UTF-8 characters can occupy multiple bytes, while parser read-ahead can leave the stream cursor thousands of bytes ahead. Use [`SourceLine`](../Properties/SourceLine.md) for a line number and SourcePos for diagnostics or slicing against the exact original encoded bytes.

[`TokenComponentIdent`](TokenComponentIdent.md) can consume a dotted suffix while retaining the original current token start, so SourcePos continues to identify the first identifier segment. Calling [`NextToken`](NextToken.md) updates it to the next token start. At EOF it identifies the parser's end position relative to its starting origin.

The installed native return type is `NativeInt`, but Velox registers `LongInt`. The direct runtime method binding therefore narrows the value to signed 32-bit script storage. Inputs beyond the LongInt range can truncate, wrap or raise depending on the active runtime checks. Do not rely on SourcePos for multi-gigabyte streams; maintain an application-level bounded input size.

The method only reads parser state and does not seek or advance. The state is nevertheless mutable and unsynchronized, so another consumer must not call NextToken concurrently.

The example is source-reviewed only; no source position was read.

**External references**

- [Embarcadero: `TParser.SourcePos`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.SourcePos) - native source-position method.
- [Free Pascal: `TParser.SourcePos`](https://www.freepascal.org/docs-html/rtl/classes/tparser.sourcepos.html) - compatible source-offset concept.

<small>Created 2026-07-15</small>
