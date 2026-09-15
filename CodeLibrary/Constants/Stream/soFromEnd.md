---
title: soFromEnd
description: Makes TStream.Seek add a signed Int64 offset to Size, commonly using a negative value to reach bytes near the tail.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, stream, seek, end, size]
---

```Delphi
soFromEnd = 2
```

### Example

```Delphi
function MoveToLastFourBytes(Stream: TStream): Int64;
begin
  Result := Stream.Seek(-4, soFromEnd);
end;
```

### Usage

`soFromEnd` makes TStream.Seek add a signed Int64 offset to Size, commonly using a negative value to reach bytes near the tail.

### Additional Technical Info
`soFromEnd` makes [`TStream.Seek`](../../Classes/Stream/TStream/Methods/Seek.md) calculate `new position = Size + Offset`. Use a negative offset to move before the end, zero to position exactly at the end for append-style writing, or a positive offset to request a position beyond the current end.

Velox registers the legacy `LongInt` value 2 and exposes an Int64 offset/result with a Word origin. Current Delphi maps ordinal 2 to typed `soEnd` and dispatches to the concrete stream.

**Important cases**

- `Seek(-N, soFromEnd)` requires `N <= Size` for ordinary streams; otherwise the result would be negative and can fail.
- Seeking to end does not itself append, reserve bytes or lock the end. Another consumer can change Size before the later write.
- Seeking beyond end normally does not change Size immediately. A later write can extend the stream and create a gap whose contents and physical allocation are descendant/filesystem specific.
- This is cursor movement, not a stable tail snapshot. Synchronize externally when Size or content can change concurrently.

The Int64 return reports the resulting absolute position. Keep it rather than round-tripping a large value through Velox's LongInt Position property.

The example assumes Size is at least four bytes; production code should verify that precondition. It is source-reviewed only and was not executed.

**External references**

- [Embarcadero `TStream.Seek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Seek)
- [Free Pascal `TStream.Seek`](https://www.freepascal.org/docs-html/rtl/classes/tstream.seek.html)

<small>Created 2026-07-15</small>
