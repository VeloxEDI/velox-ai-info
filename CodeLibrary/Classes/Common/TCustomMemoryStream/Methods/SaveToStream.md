---
title: SaveToStream
description: Writes the complete logical memory buffer from offset zero to the destination stream at its current position.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcustommemorystream, stream, save, buffer]
---

```Delphi
procedure SaveToStream(Stream: TStream);
```

### Example

```Delphi
procedure CopyWholeBuffer(const Buffer, Destination: TMemoryStream);
begin
  Destination.Position := Destination.Size;
  Buffer.SaveToStream(Destination);
end;
```

### Usage

`SaveToStream` writes the complete logical memory buffer from offset zero to the destination stream at its current position.

- Use [`TStream.CopyFrom`](../../../Stream/TStream/Methods/CopyFrom.md) when source-position semantics are required; reset `Position` explicitly if copying from the beginning.
- Do not expect this method to append unless the destination was positioned at its end first.
- Source and destination aliasing is not guarded. Saving a memory stream to itself can overwrite/grow the same storage while it is being read and should be avoided.

### Additional Technical Info
`SaveToStream` is declared by hidden ancestor `TCustomMemoryStream` and is normally used through [`TMemoryStream`](../../../Stream/TMemoryStream.md). Its contract differs from cursor-based copying: the source cursor is ignored.

#### Source-backed behaviour

When `Size` is nonzero, the installed RTL calls `Stream.WriteBuffer(Memory^, Size)`. Bytes always come from source offset zero through `Size - 1`; source `Position` is neither consulted nor changed. The destination write begins at the destination's current `Position` and advances it according to that stream's implementation.

`WriteBuffer` requires the destination to accept the complete byte count. A nil destination, read-only destination, short write or underlying I/O failure raises rather than returning a partial-count result. A zero-size source performs no destination call.

#### Operational guidance

- Use [`TStream.CopyFrom`](../../../Stream/TStream/Methods/CopyFrom.md) when source-position semantics are required; reset `Position` explicitly if copying from the beginning.
- Do not expect this method to append unless the destination was positioned at its end first.
- Source and destination aliasing is not guarded. Saving a memory stream to itself can overwrite/grow the same storage while it is being read and should be avoided.
- The method does not own or free the destination. Keep both streams alive for the complete call.

#### Related members

[`SaveToFile`](SaveToFile.md) is a destructive file wrapper around this exact operation. [`Position`](../../../Stream/TStream/Properties/Position.md) controls only the destination side here.

#### Official RTL references

- [Embarcadero: TCustomMemoryStream.SaveToStream](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCustomMemoryStream.SaveToStream)
- [Free Pascal: TCustomMemoryStream.SaveToStream](https://www.freepascal.org/docs-html/rtl/classes/tcustommemorystream.savetostream.html)

<small>Created 2026-07-15</small>
