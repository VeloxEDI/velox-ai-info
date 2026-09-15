---
title: SaveToStream
description: Writes the complete joined list text, optional encoding preamble and encoded bytes at the destination stream's current position.
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, savetostream, encoding, bom]
---

```Delphi
procedure SaveToStream(Stream: TStream);
```

### Example

```Delphi
procedure WriteLines(const Items: TStringList; const Destination: TStream);
begin
  Destination.Position := 0;
  Items.SaveToStream(Destination);
end;
```

### Usage

`SaveToStream` writes the complete joined list text, optional encoding preamble and encoded bytes at the destination stream's current position.

- Position and size the destination explicitly before writing.
- Avoid appending a BOM-bearing list representation unless the receiving format explicitly allows it.
- Nil, read-only and short-writing streams raise; already-written preamble/data is not rolled back.

### Additional Technical Info
`SaveToStream` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It does not own, clear, truncate or rewind the destination.

#### Source-backed behaviour

The registered overload uses the encoding retained by a prior load, or `DefaultEncoding` when none exists. It encodes the complete [`Text`](../Properties/Text.md) representation, writes the encoding preamble when `WriteBOM=True`, then calls `WriteBuffer` for all encoded bytes.

The destination's current `Position` is the write start. Existing trailing bytes remain if the destination is longer and is not separately truncated. A preamble is written even when starting in the middle or appending, so repeated calls can embed multiple BOM sequences.

#### Related members

[`SaveToFile`](SaveToFile.md) creates/truncates a destination file first. [`LoadFromStream`](LoadFromStream.md) detects BOMs and retains encoding.

#### Official RTL references

- [Embarcadero: TStrings.SaveToStream](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.SaveToStream)
- [Free Pascal: TStrings.SaveToStream](https://www.freepascal.org/docs-html/rtl/classes/tstrings.savetostream.html)

<small>Created 2026-07-15</small>
