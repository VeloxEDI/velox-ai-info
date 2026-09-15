---
title: soFromBeginning
description: Makes TStream.Seek interpret its signed Int64 offset as an absolute byte position from the start of the stream.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, stream, seek, beginning, position]
---

```Delphi
soFromBeginning = 0
```

### Example

```Delphi
function MoveToByte(Stream: TStream; Offset: Int64): Int64;
begin
  Result := Stream.Seek(Offset, soFromBeginning);
end;
```

### Usage

`soFromBeginning` makes TStream.Seek interpret its signed Int64 offset as an absolute byte position from the start of the stream.

### Additional Technical Info
`soFromBeginning` makes [`TStream.Seek`](../../Classes/Stream/TStream/Methods/Seek.md) treat `Offset` as the new absolute byte position. For ordinary seekable streams, the calculation is `new position = Offset`, where byte 0 is the start.

Velox registers this legacy name as a `LongInt` constant and exposes `Seek(Offset: Int64; Origin: Word): Int64`. Current Delphi internally maps ordinal 0 to typed `soBeginning`. The modern `TSeekOrigin` type/name is not part of the generated script surface.

**Boundaries**

- A negative absolute position is invalid for normal memory/file streams and can fail immediately or make later operations fail according to the descendant.
- Seeking past Size can be allowed without immediately changing Size. A later write can extend the stream and create a descendant/filesystem-specific gap.
- Seek returns the new Int64 position. Keep that result for offsets outside the script-visible [`Position`](../../Classes/Stream/TStream/Properties/Position.md) property's LongInt range.
- Seeking moves shared mutable cursor state; it does not read, write, reserve or synchronize bytes.

Assigning Position also seeks from the beginning, but the direct method exposes the wider offset/result contract. Stream ownership is unchanged.

The example is source-reviewed only; no stream cursor was moved.

**External references**

- [Embarcadero `TStream.Seek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Seek)
- [Free Pascal `TStream.Seek`](https://www.freepascal.org/docs-html/rtl/classes/tstream.seek.html)

<small>Created 2026-07-15</small>
