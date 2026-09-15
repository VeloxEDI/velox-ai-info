---
title: LoadFromStream
description: Replaces a Velox client dataset from the packet bytes remaining at a caller-owned stream's current position.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, client-dataset, packet, stream, load]
---

```Delphi
procedure LoadFromStream(Stream: TStream)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Packet: TMemoryStream;
begin
  Packet := TMemoryStream.Create;
  try
    DATA1.SaveToStream(Packet, dfBinary);
    Packet.Position := 0;  // Loading starts here; it does not rewind itself.
    DATA2.LoadFromStream(Packet);
    Value := DATA2.RecordCount;
  finally
    Packet.Free;
  end;
end;
```

### Usage

`LoadFromStream` replaces a Velox client dataset from the packet bytes remaining at a caller-owned stream's current position.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Stream` | `TStream` | Existing readable, seekable caller-owned stream containing a complete packet from its current Position onward. The method reads Size and Position, advances Position, and neither frees nor restores the stream. |

**Dataset effects**

The close/open cycle can post or validate a pending edit and invokes normal dataset lifecycle events. A successful replacement recreates fields and cursor state; retained field references, bookmarks and record positions are invalid. It does not apply updates or commit any external database.

**Errors and partial reads**

A nil, non-seekable, size-less or unreadable stream; pending-edit validation; allocation; packet decoding; field creation; dataset events; or MIDAS errors can raise. The complete-packet allocation makes untrusted declared stream sizes a memory-exhaustion risk.

Because Velox uses `Read` rather than `ReadBuffer` and ignores its result, a stream dataset that returns fewer bytes without raising is treated as if the packet were complete. Opening that incomplete buffer will normally fail, but there is no explicit short-read error or rollback.

The Int64 remaining byte count is stored in an `Integer`; packets larger than `MaxInt` are unsupported and may fail or be mis-sized according to the compiled range-checking behaviour.

### Additional Technical Info
`LoadFromStream` closes the dataset and replaces it with a MIDAS client-dataset packet read from the caller's current stream position through its size. It accepts packets produced in binary, XML or UTF-8 XML representation.

The example assumes two configured Velox data variables, copies a packet entirely in memory and frees the script-owned stream. It is destructive and was source-reviewed without being run.

**Signature**

**Implementation**

The inherited terminal calls `Close`, `ReadDataPacket(Stream, False)` and `Open` in that order. `ReadDataPacket` calculates `Stream.Size - Stream.Position`, narrows that count to an `Integer`, allocates a one-dimensional byte safe array of that complete size, and calls `Stream.Read` once.

There is no size prefix because the internal `ReadSize` argument is false. The method does not rewind the source, loop until the requested count is satisfied or check the byte count returned by `Read`. The packet parser recognises its binary/XML representation during `Open`; there is no Format argument.

**Stream-position behaviour**

- Position zero loads the whole stream.
- A positive Position intentionally skips a prefix and treats every remaining byte as the packet.
- Position equal to Size supplies no new packet.
- A reused stream must be positioned deliberately. `SaveToStream` leaves Position at the end, so directly loading that same stream without rewinding triggers the empty-source quirk.

Successful reading advances Position by the number of bytes the stream reports as read. The method does not restore it on success or failure.

**Replacement and empty-source quirk**

Closing an active standalone client dataset normally serialises its current content into an internal saved packet before releasing its fields and cursor. `ReadDataPacket` clears that saved packet only when the new remaining size is greater than zero.

Consequently, a zero-length stream or a stream positioned at its end can cause `Open` to reopen the old saved packet. This method is not a way to empty the dataset. Use `EmptyDataSet` or `DeleteAll` when the intent is to remove records.

A nonempty source clears the saved packet before reading. A corrupt or short source can therefore replace the recoverable old packet and leave the dataset inactive when `Open` fails.

**Performance and concurrency**

Time is linear in the remaining byte count. Peak memory includes the entire safe-array packet plus the opened dataset's internal representation. The operation is unsynchronised; do not share the stream or navigate the dataset concurrently.

**Related entries**

- [`LoadFromFile`](LoadFromFile.md) creates a read-only file stream and delegates here.
- [`SaveToStream`](SaveToStream.md) produces a compatible packet at a destination's current position.
- [`EmptyDataSet`](EmptyDataSet.md) is the explicit local bulk-reset operation.

**External references**

- [Embarcadero DocWiki: `TCustomClientDataSet.LoadFromStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TCustomClientDataSet.LoadFromStream) - the inherited packet loader registered by Velox.
- [Embarcadero DocWiki: `TStream.Read`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Read) - establishes current-position, up-to-count and returned-byte-count semantics.
- [Free Pascal: `TStream.Read`](https://www.freepascal.org/docs-html/rtl/classes/tstream.read.html) - compatible stream read semantics; Free Pascal's TMemDataset serialisation is not the Delphi MIDAS packet format.

<small>Created 2026-07-15</small>
