---
title: Seek
description: Moves a concrete stream's cursor using a 64-bit byte offset and the three legacy Word origin constants, returning the new position.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, seek, position, offset, cursor]
---

```Delphi
function Seek(Offset: Int64; Origin: Word): Int64;
```

### Example

```Delphi
procedure MoveToLastFourBytes(Stream: TStream);
var
  NewPosition: Int64;
begin
  if Stream = nil then Exit;

  NewPosition := Stream.Seek(-4, soFromEnd);
end;
```

### Usage

`Seek` moves a stream's cursor using a 64-bit byte offset and the three legacy Word origin constants, returning the new position.

### Additional Technical Info
`Seek` moves the byte cursor and returns its new absolute position. Velox exposes the legacy Word origin values:

| Origin | Value | Calculation |
|---|---:|---|
| [`soFromBeginning`](../../../../Constants/Stream/soFromBeginning.md) | 0 | new position = Offset |
| [`soFromCurrent`](../../../../Constants/Stream/soFromCurrent.md) | 1 | new position = current Position + Offset |
| [`soFromEnd`](../../../../Constants/Stream/soFromEnd.md) | 2 | new position = Size + Offset |

Offsets and the return value are Int64 even though Velox's [`Position`](../Properties/Position.md) property is narrowed to LongInt. Seek is therefore the method-level route for large offsets, but later Position property access can still truncate or raise.

Actual support and bounds belong to the descendant. File and memory streams are seekable. Other streams can reject seeking. Seeking beyond the end may be allowed without immediately growing the stream; a later write can create a gap whose contents/physical representation are descendant-specific. Negative absolute positions are invalid for normal file/memory use and can raise or cause later operations to fail.

Seek changes shared mutable state and performs no synchronization. Do not move a stream cursor while another consumer is reading/writing it. A failed seek does not carry a general rollback guarantee.

Assigning Position calls Seek from the beginning; reading Size can itself seek on descendants that use TStream's default implementation.

The example is source-reviewed only; no cursor was moved.

**External references**

- [Embarcadero: `TStream.Seek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Seek) - native overloads and origin semantics.
- [Free Pascal: `TStream.Seek`](https://www.freepascal.org/docs-html/rtl/classes/tstream.seek.html) - compatible seek contract.

<small>Created 2026-07-15</small>
