---
title: Stream
description: "Seek-origin constants that make stream offsets relative to the beginning, current cursor or end of content."
sidebar_position: 4
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, constants, stream, seek, cursor, offset]
---

## Available constants

| Constant | Ordinal | Offset interpretation |
|---|---:|---|
| [`soFromBeginning`](Stream/soFromBeginning.md) | 0 | Absolute signed byte offset from position zero. |
| [`soFromCurrent`](Stream/soFromCurrent.md) | 1 | Signed byte displacement from the stream's current cursor. |
| [`soFromEnd`](Stream/soFromEnd.md) | 2 | Signed byte displacement from `Size`; negative offsets address data before the end. |

Velox registers these legacy names as `LongInt` constants and exposes `TStream.Seek(Offset: Int64; Origin: Word): Int64`. The compiled Delphi stream maps Word ordinals 0, 1 and 2 to the modern `TSeekOrigin` members `soBeginning`, `soCurrent` and `soEnd`. The typed modern enum/names are not themselves part of the generated script surface. A constant selects the reference point only; it does not move a stream until passed to `Seek`.

```Delphi
Stream.Seek(0, soFromBeginning);
```

## Cursor and bounds

A stream cursor is mutable shared state on the stream instance. A read, write or another seek can move it. Reusing one stream concurrently without external synchronization can therefore make relative seeks and subsequent I/O race even when the underlying bytes are otherwise thread-safe.

Offsets are signed `Int64`. `soFromCurrent` and `soFromEnd` are the normal choices for negative displacement. A negative final position, arithmetic overflow, seeking beyond the end, or seeking at all is handled by the concrete stream class: some streams reject it, some permit a position beyond `Size`, and forward-only/custom streams may not support seeking. Seeking beyond the end does not itself guarantee zero-filled allocation or a later successful write.

The return value is the new absolute position. Check or retain it when exact positioning matters. The imported Int64 overload deliberately avoids the older `Seek(LongInt, Word)` overload's 2 GB signed offset/result limit, but the origin argument remains the legacy numeric Word contract.

Reading these constants has no side effect. No file, memory, network or compression stream was executed while documenting this group.

**External references**

- [Embarcadero `TSeekOrigin`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TSeekOrigin)
- [Embarcadero `TStream.Seek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Seek)
- [Free Pascal `TSeekOrigin`](https://www.freepascal.org/docs-html/rtl/classes/tseekorigin.html)
- [Free Pascal `TStream.Seek`](https://www.freepascal.org/docs-html/rtl/classes/tstream.seek.html)

<small>Created 2026-07-15</small>
