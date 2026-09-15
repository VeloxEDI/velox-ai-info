---
title: TStream
description: Provides the common read, write, copy and positioning operations used by Velox streams.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, bytes, cursor, abstract, buffer]
---

```Delphi
TStream = class(TObject)
```

### Example

```Delphi
procedure RewindStream(Stream: TStream);
begin
  if Stream = nil then Exit;

  Stream.Position := 0;
end;
```

### Usage

`TStream` provides the common read, write, copy and positioning operations used by Velox streams. Do not create `TStream` itself; create a supported stream class such as `TMemoryStream`, `TFileStream` or `TStringStream`, or use a stream supplied by another Velox item.

`Read` and `Write` transfer bytes at the current `Position` and advance it. `Seek` moves the position, `Size` reports the available length where supported, and `CopyFrom` transfers data between streams. A stream can be read-only, write-only or unable to seek, so use only the operations supported by the stream you receive.

Velox exposes `Read`, `Write`, `ReadBuffer` and `WriteBuffer` with a `string` buffer but treats `Count` as a byte count; these calls do not perform text encoding. Size the string before reading, never pass a count larger than its available bytes, and prefer encoding helpers for text. `Position` and `Size` are limited to signed 32-bit values in scripts; use `Seek` for positions outside that range.

### Additional Technical Info
`TStream` is the abstract base contract for sequential and random-access byte storage. Do not construct TStream directly. Use a concrete descendant such as [`TMemoryStream`](TMemoryStream.md), [`TFileStream`](TFileStream.md), [`TStringStream`](TStringStream.md), or a stream returned/owned by another Velox API.

Every stream has one mutable cursor. [`Read`](TStream/Methods/Read.md) and [`Write`](TStream/Methods/Write.md) transfer bytes at that cursor and advance it. [`Seek`](TStream/Methods/Seek.md) and [`Position`](TStream/Properties/Position.md) move it. [`Size`](TStream/Properties/Size.md) represents logical length where supported. Capability, error and concurrency behavior comes from the actual descendant.

#### Velox scripting adapter differences

The PascalScript importer does not expose Delphi's untyped or TBytes buffer overloads. It declares Read, Write, ReadBuffer and WriteBuffer with a `string` buffer while preserving byte counts. These operations do not encode/decode text and do not resize the String. Allocate enough storage before a read and ensure Count never exceeds the available backing bytes for either direction. Prefer conversion helpers for text and [`CopyFrom`](TStream/Methods/CopyFrom.md) for stream-to-stream transfer.

Native Delphi Position and Size are Int64. Velox registers them as signed 32-bit LongInt and copies through LongInt runtime helpers, while Seek and CopyFrom expose Int64. Property access is therefore unsafe for sizes/positions outside the LongInt range and can truncate or raise depending on runtime checks.

The runtime importer uses TMemoryStream's Read/Write/Seek virtual slots to bind the abstract methods, so calls dispatch to the actual descendant. Presence in the API does not mean an operation is supported: read-only, write-only, forward-only or non-sized descendants can return short counts or raise.

#### Ownership and concurrency

TStream parameters are normally borrowed unless their owning API says otherwise. Do not free a borrowed stream. A stream created explicitly by the script is normally script-owned and must be freed. Streams and their cursor are not thread-safe; sharing one instance across concurrent work causes position races and interleaved data.

The example is source-reviewed only; no stream was repositioned.

**External references**

- [Embarcadero: `TStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream) - Delphi stream contract.
- [Free Pascal: `TStream`](https://www.freepascal.org/docs-html/rtl/classes/tstream.html) - compatible base class and descendant model.

<small>Created 2026-07-15</small>
