---
title: soFromCurrent
description: Makes TStream.Seek add a signed Int64 offset to the stream's current shared byte cursor.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, stream, seek, current, relative]
---

```Delphi
soFromCurrent = 1
```

### Example

```Delphi
function SkipBytes(Stream: TStream; Count: Int64): Int64;
begin
  Result := Stream.Seek(Count, soFromCurrent);
end;
```

### Usage

`soFromCurrent` makes TStream.Seek add a signed Int64 offset to the stream's current shared byte cursor.

### Additional Technical Info
`soFromCurrent` makes [`TStream.Seek`](../../Classes/Stream/TStream/Methods/Seek.md) move relative to the live cursor: `new position = current position + Offset`. A positive offset moves forward, zero queries/retains the position through the seek dispatch, and a negative offset moves backward when the descendant permits the result.

The constant is the legacy `LongInt` ordinal 1. Velox's current script method accepts `Origin: Word` and an Int64 offset; Delphi maps ordinal 1 to typed `soCurrent` before virtual descendant behavior runs.

**State and error behavior**

- Repeated calls accumulate. Reads, writes and other consumers also advance the same cursor, so a relative operation depends on all preceding stream activity.
- A negative move before byte 0 is invalid for ordinary file/memory streams. A positive move beyond Size may be allowed without extending the stream until a write occurs.
- The operation is unsynchronised. Do not use relative seeking while another consumer can read, write or seek the same instance.
- The Int64 return is the resulting absolute position and is safer than the narrowed script Position property for large streams.

The constant does not imply that every `TStream` descendant is seekable. Unsupported descendants can raise or otherwise reject the operation.

The example is source-reviewed only; no stream cursor was moved.

**External references**

- [Embarcadero `TStream.Seek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Seek)
- [Free Pascal `TStream.Seek`](https://www.freepascal.org/docs-html/rtl/classes/tstream.seek.html)

<small>Created 2026-07-15</small>
