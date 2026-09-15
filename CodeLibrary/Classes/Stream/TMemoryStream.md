---
title: TMemoryStream
description: Provides a script-owned resizable in-memory byte stream with cursor-based I/O, full replacement and explicit lifetime rules.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, memory, buffer, bytes, io]
---

```Delphi
TMemoryStream = class(TCustomMemoryStream)
```

### Example

```Delphi
procedure BufferSource(Source: TStream);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    Buffer.CopyFrom(Source, 0, 65536);
    Buffer.Position := 0;
    // Pass Buffer to the next operation while it is still alive.
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`TMemoryStream` provides a script-owned resizable in-memory byte stream with cursor-based I/O, full replacement and explicit lifetime rules.

### Additional Technical Info
`TMemoryStream` stores bytes in a resizable heap buffer. Its hidden `TCustomMemoryStream` ancestor supplies inherited save operations, while the visible [`TStream`](TStream.md) surface supplies cursor, size, copy and raw byte I/O.

The no-argument constructor is inherited and callable as `TMemoryStream.Create`. A constructed stream is script-owned; release it with `Free` in `finally`. It owns its memory but does not own stream objects passed to [`LoadFromStream`](TMemoryStream/Methods/LoadFromStream.md) or CopyFrom.

#### State model

- Size is the number of logical bytes.
- Position is the next read/write byte offset.
- capacity is internal allocated storage and can exceed Size.
- writes at/after the end grow the stream as needed.
- [`Clear`](TMemoryStream/Methods/Clear.md) releases the allocation and resets Size/Position.

The visible Position and Size properties are registered as 32-bit LongInt even though the native stream uses Int64. Keep script-managed buffers below LongInt limits and check size before allocation. Memory exhaustion, range errors and host process pressure are real failure modes; do not buffer unbounded partner payloads without an external limit.

Raw Read/Write methods expose a PascalScript String as byte storage. They do not perform text encoding and do not allocate the String. Prefer higher-level conversion functions for text and CopyFrom for stream-to-stream movement.

Methods mutate the object in place and are not transactional or thread-safe. On an exception, Size, Position and some bytes can already have changed. Do not share one instance between concurrent flow work.

The example is source-reviewed only; no memory stream was created or copied.

**External references**

- [Embarcadero: `TMemoryStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream) - Delphi heap-backed stream.
- [Free Pascal: `TMemoryStream`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.html) - compatible class and lifetime behavior.

<small>Created 2026-07-15</small>
