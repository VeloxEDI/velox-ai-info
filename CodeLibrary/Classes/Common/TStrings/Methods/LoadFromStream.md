---
title: LoadFromStream
description: Replaces the list with decoded lines read from the source stream's current position through its reported size.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, loadfromstream, encoding, position]
---

```Delphi
procedure LoadFromStream(Stream: TStream);
```

### Example

```Delphi
procedure ReadRemainingLines(const Source: TStream; const Items: TStringList);
begin
  Source.Position := 0;
  Items.LoadFromStream(Source);
end;
```

### Usage

`LoadFromStream` replaces the list with decoded lines read from the source stream's current position through its reported size.

- Set `Position` explicitly and use a stable, seekable stream whose `Size` is accurate.
- Do not pass nil, a stream positioned beyond its size, or a source changing concurrently.
- Loading is not transactional and can leave partial/new content after exceptions.

### Additional Technical Info
`LoadFromStream` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). The caller owns the source stream and controls its starting position.

#### Source-backed behaviour

The installed overload calculates `Size := Stream.Size - Stream.Position`, batches updates and detects a BOM or falls back to `DefaultEncoding`. For native line breaks and remaining size at least `$15000000` (336 MiB), it uses `TStreamReader` with automatic BOM detection and adds lines incrementally. Otherwise it allocates a byte array for the reported remaining size, performs one `Read`, detects encoding and replaces text.

The ordinary branch ignores the actual byte count returned by `Read`; a short-reading, concurrently changing or nonstandard stream can leave zero-filled/unread tail bytes in the decode buffer. Existing entries are cleared by the text replacement. The source is not freed.

#### Related members

[`LoadFromFile`](LoadFromFile.md) supplies a shared-read file stream. [`Text`](../Properties/Text.md) describes line splitting. [`SaveToStream`](SaveToStream.md) writes at a destination's current position.

#### Official RTL references

- [Embarcadero: TStrings.LoadFromStream](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.LoadFromStream)
- [Free Pascal: TStrings.LoadFromStream](https://www.freepascal.org/docs-html/rtl/classes/tstrings.loadfromstream.html)

<small>Created 2026-07-15</small>
