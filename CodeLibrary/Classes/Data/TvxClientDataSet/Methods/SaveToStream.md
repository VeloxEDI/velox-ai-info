---
title: SaveToStream
description: Serialises a complete Velox client-dataset packet at a caller-owned destination stream's current position.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, client-dataset, packet, stream, save]
---

```Delphi
procedure SaveToStream(Stream: TStream; Format: TDataPacketFormat)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Packet: TMemoryStream;
begin
  Packet := TMemoryStream.Create;
  try
    Packet.Size := 0;
    Packet.Position := 0;
    DATA1.SaveToStream(Packet, dfBinary);
    Value := Packet.Size;
  finally
    Packet.Free;
  end;
end;
```

### Usage

`SaveToStream` serialises a complete Velox client-dataset packet at a caller-owned destination stream's current position.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Stream` | `TStream` | Existing writable caller-owned destination. Writing begins at current Position and advances it. The caller remains responsible for lifetime, final Position, truncation and rollback. |
| `Format` | `TDataPacketFormat` | `dfBinary`, `dfXML` or `dfXMLUTF8`. Unlike SaveToFile, there is no filename-extension override. |

**Dataset effects**

`CheckBrowseMode` can post and validate a pending edit or insert. Provider completion can perform remote/provider work in configurations that enable it. Serialisation reads the entire dataset and its packet metadata, but it does not apply updates or commit an external transaction.

On an inactive dataset, no browse check occurs. If Velox has a previously saved packet, the method can write it; if no current or saved packet exists, the call silently writes nothing.

**Errors and partial output**

A nil or non-writable destination, pending-edit validation, provider fetch, allocation, MIDAS serialisation and stream writes can raise. The destination can contain a prefix or partial packet after failure; there is no rollback and the caller's stream is never freed.

Velox uses `TStream.Write`, not `WriteBuffer`, and ignores the returned byte count. A stream dataset can therefore return a short write without an exception and the method will treat it as success, leaving a truncated packet. Check the resulting Position/Size or use a destination stream with exact-write failure semantics when integrity matters.

### Additional Technical Info
`SaveToStream` serialises the client dataset as one complete MIDAS packet and writes it to an existing caller-owned stream at that stream's current position. It does not rewind, truncate, free or restore the destination.

The example uses a new memory stream and explicitly establishes replacement state. It was source-reviewed without being run.

**Signature**

The native format default is not present in the Velox script declaration; both arguments are mandatory.

**Implementation**

The inherited method calls `WriteDataPacket(Stream, False, Format)`. With `WriteSize` false, the stream receives raw packet bytes with no leading length field.

If the dataset is active, packet generation first calls `CheckBrowseMode`. If a provider is connected, is not at EOF, FetchOnDemand is enabled and PacketRecords is nonzero, the terminal fetches the remaining provider data before serialisation. Normal Velox `TvxClientDataSet` construction disables FetchOnDemand and normal activation detaches its SQL provider, so the usual result is the complete current in-memory snapshot.

The internal DSBase serialises the packet in the requested representation into a safe array. The method then calls `Stream.Write` once for the packet size and, on an ordinary active success, clears the temporary saved packet.

**Destination-position and reuse behaviour**

- A new empty stream receives exactly the packet and ends at its new Size.
- A reused stream is overwritten beginning at its current Position.
- Existing prefix bytes remain before that position.
- If the old stream is longer than the newly written packet, its stale tail remains because Size is never reduced.
- The stream ends immediately after the bytes it reports as written, not automatically at Position zero for a following load.

For deterministic replacement, set both `Size := 0` and `Position := 0` before calling. Setting Position alone does not remove an old tail, and calling `LoadFromStream` immediately afterward requires rewinding to the packet start.

**Format and compatibility**

`dfBinary` is the compact binary packet. `dfXML` is the MIDAS XML representation with escaped extended characters. `dfXMLUTF8` is the UTF-8 XML representation. These are client-dataset transport packets, not general-purpose CSV/JSON/XML exports.

Free Pascal's TMemDataset has its own stream format and does not establish compatibility with these packets. The applicable Free Pascal references below cover only the shared `TStream.Write` contract.

**Performance and concurrency**

Time is linear in packet size. Peak memory includes the whole temporary serialised packet plus the active dataset; XML is generally larger and more CPU-intensive than binary. The method is unsynchronised, so do not mutate the dataset or destination concurrently.

**Related entries**

- [`SaveToFile`](SaveToFile.md) creates/truncates a file and delegates here.
- [`LoadFromStream`](LoadFromStream.md) replaces a dataset from packet bytes at a source's current position.
- [`TDataPacketFormat`](../../../../Types/Enumerations/TDataPacketFormat.md) defines the three script enum values.

**External references**

- [Embarcadero DocWiki: `TCustomClientDataSet.SaveToStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TCustomClientDataSet.SaveToStream) - the inherited packet writer registered by Velox.
- [Embarcadero DocWiki: `TDataPacketFormat`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TDataPacketFormat) - authoritative packet-format meanings.
- [Embarcadero DocWiki: `TStream.Write`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Write) - establishes current-position and returned-byte-count behaviour.
- [Free Pascal: `TStream.Write`](https://www.freepascal.org/docs-html/rtl/classes/tstream.write.html) - compatible stream write semantics, not packet-format compatibility.

<small>Created 2026-07-15</small>
