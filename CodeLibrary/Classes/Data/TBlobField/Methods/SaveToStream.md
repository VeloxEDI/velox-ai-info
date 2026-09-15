---
title: SaveToStream
description: Copies the current record's complete BLOB at a caller-owned destination stream's current position.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, blob, stream, position]
---

```Delphi
procedure SaveToStream(Stream: TStream);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Blob: TBlobField;
  Output: TMemoryStream;
begin
  Blob := TBlobField(DATA_Self.FieldByName('Payload'));
  Output := TMemoryStream.Create;
  try
    Blob.SaveToStream(Output);
    Value := Output.Size;
  finally
    Output.Free;
  end;
end;
```

### Usage

`SaveToStream` copies the current record's complete BLOB at a caller-owned destination stream's current position.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Stream` | `TStream` | Existing writable caller-owned destination. Copying begins at its current Position. The method does not free, clear, resize or restore it. |

**Behaviour**

- A new empty destination receives exactly the BLOB bytes and ends at its new Size.
- A reused destination is overwritten from its current Position. Existing prefix bytes remain, and any old tail beyond the new end also remains because this method does not truncate.
- A null or zero-length BLOB writes no bytes and leaves the destination content and Position unchanged.
- The method does not edit the dataset or transfer ownership of either object.

**Errors**

Inactive datasets, invalid records, deferred fetches, allocation, nil objects, seeking, reading and destination writes can raise errors. The destination stream remains the caller's responsibility and can contain partial output after an error.

### Additional Technical Info
`SaveToStream` copies the current record's complete BLOB into an existing caller-owned stream. The BLOB source is rewound automatically; the destination is neither rewound nor truncated.

The example writes into a new empty memory stream and guarantees cleanup. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Delphi `TBlobField.SaveToStream` creates a BLOB stream from the owning dataset in `bmRead` mode and calls `Stream.CopyFrom(BlobStream, 0)`. It frees only the internal BLOB stream.

Installed Delphi `TStream.CopyFrom` treats Count zero as a whole-source request: it sets the BLOB source Position to zero, reads its Size and transfers exact buffered chunks. It writes to the destination's existing Position and advances that position by the copied byte count.

**Edge cases and quirks**

- A nil, read-only or capacity-limited destination fails after the internal BLOB stream has been created.
- If a complete replacement is required, set destination Size and Position appropriately before calling. Merely setting Position zero does not remove a longer stale tail.
- A mid-copy exception can leave partial bytes and advanced source/destination positions. There is no rollback.
- Dataset movement or closure invalidates the field context; the current record at call time is authoritative.

**Side effects**

Writes and advances the caller's destination stream. It may make the owning dataset fetch deferred BLOB data, but it does not post, modify or free the dataset/field.

**Performance and concurrency**

Time is linear in BLOB size. CopyFrom uses a bounded buffer, while the dataset implementation may separately load the entire BLOB. Do not navigate the dataset or write the destination from another execution context during the copy.

**Remarks**

For deterministic replacement of a reused memory stream, set `Stream.Size := 0` and `Stream.Position := 0` before calling. Save and restore the incoming position yourself only when appending/overwriting is intentional and later code needs that position.

**Related entries**

- [`SaveToFile`](SaveToFile.md) creates/truncates a file before delegating to this method.
- [`LoadFromStream`](LoadFromStream.md) replaces the current BLOB from a whole source stream.

**External references**

- [Embarcadero DocWiki: `Data.DB.TBlobField.SaveToStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TBlobField.SaveToStream) - the Delphi method registered by Velox.
- [Embarcadero DocWiki: `System.Classes.TStream.CopyFrom`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.CopyFrom) - establishes source rewind, destination position and exact-copy behaviour.
- [Free Pascal: `TBlobField.SaveToStream`](https://www.freepascal.org/docs-html/fcl/db/tblobfield.savetostream.html) and [`TStream.CopyFrom`](https://www.freepascal.org/docs-html/rtl/classes/tstream.copyfrom.html) - compatible stream-copy context.

<small>Created 2026-07-15</small>
