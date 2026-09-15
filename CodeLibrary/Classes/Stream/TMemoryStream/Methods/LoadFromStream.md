---
title: LoadFromStream
description: Rewinds a sized source, resizes the destination exactly and reads all bytes directly without resetting the destination cursor.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, memory, load, position, size]
---

```Delphi
procedure LoadFromStream(Stream: TStream);
```

### Example

```Delphi
procedure ReplaceBuffer(Source: TStream; Dest: TMemoryStream);
begin
  if (Source = nil) or (Dest = nil) then Exit;

  Dest.LoadFromStream(Source);
  Dest.Position := 0;
end;
```

### Usage

`LoadFromStream` rewinds a sized source, resizes the destination exactly and reads all bytes directly without resetting the destination cursor.

### Additional Technical Info
`LoadFromStream` replaces the destination's content with the complete logical content of `Stream`. Its exact sequence is:

1. set source Position to `0`;
2. read source Size;
3. resize the destination to that exact byte count;
4. if nonzero, call source ReadBuffer directly into destination memory.

The source is borrowed and remains positioned at its end after a successful read. It is not freed. The method requires a seekable source with a meaningful nonnegative Size, so it is unsuitable for forward-only/network streams whose size cannot be determined.

#### Destination Position quirk

The bytes are read directly into the memory pointer, not through the destination's Write method. Destination Position is therefore preserved when it remains within the new Size. If the old Position lies beyond a smaller new Size, SetSize clamps it to the new end. This differs from the common expectation that loading leaves Position at zero. Set it explicitly before consuming the new content.

The operation is not transactional. SetSize happens before ReadBuffer. If reading fails, Size already equals the advertised source size and the buffer may contain a mixture of new partial bytes and preserved/allocation contents. Validate Size limits and discard or clear the destination after a caught failure.

Passing the same TMemoryStream as both source and destination is not a copy operation. With the current implementation and an unchanged Size, it effectively copies the buffer onto itself and leaves Position at the end. Use distinct instances when a snapshot or independent cursor is required.

The example is source-reviewed only; no stream was loaded.

**External references**

- [Embarcadero: `TMemoryStream.LoadFromStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream.LoadFromStream) - source rewind, exact sizing and full read.
- [Free Pascal: `TMemoryStream.LoadFromStream`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.loadfromstream.html) - compatible full-buffer behavior and Size limitation.

<small>Created 2026-07-15</small>
