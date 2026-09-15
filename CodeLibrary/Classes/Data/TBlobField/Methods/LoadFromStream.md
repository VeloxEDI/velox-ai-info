---
title: LoadFromStream
description: Rewinds a caller-owned source stream and replaces the current record's BLOB with its complete contents.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, blob, stream, destructive]
---

```Delphi
procedure LoadFromStream(Stream: TStream);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Blob: TBlobField;
  Source: TMemoryStream;
begin
  Source := TMemoryStream.Create;
  try
    StringToStreamUTF8('Fictional payload', Source);
    DATA_Self.Edit;
    Blob := TBlobField(DATA_Self.FieldByName('Payload'));
    Blob.LoadFromStream(Source);
    Value := Source.Position;  // Equal to Source.Size after success.
  finally
    Source.Free;
  end;
end;
```

### Usage

`LoadFromStream` rewinds a caller-owned source stream and replaces the current record's BLOB with its complete contents.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Stream` | `TStream` | Existing readable, seekable caller-owned source. It must support Position and Size. The method does not free or restore it. |

**Errors**

Dataset state, read-only field, invalid record, nil object, seek, size, allocation, read and write failures can raise. After `bmWrite` construction there is no restoration of the prior BLOB, and partial data can remain. Dataset-specific stream finalisation can handle or route its own commit error through the host exception callback.

**Usage notes**

If only a source suffix should be loaded, copy that suffix into a separate stream first; setting Position alone is ineffective because this method rewinds it. Keep the source alive until the call returns and use the normal dataset cancel/post/apply sequence.

### Additional Technical Info
`LoadFromStream` rewinds a caller-owned source to zero and replaces the BLOB buffer for the current dataset record with the stream's complete contents. The incoming source position is ignored.

The example creates and frees its own stream, writes fictional UTF-8 bytes and leaves posting to the surrounding flow. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Delphi `TBlobField.LoadFromStream` creates a BLOB stream from the owning dataset in `bmWrite` mode, calls installed Delphi `TStream.CopyFrom(Stream, 0)`, then frees the internal stream.

The installed `CopyFrom` implementation treats Count zero as a whole-source request: it assigns source Position zero, reads source Size, allocates a buffer of up to 1 MiB and performs exact buffered reads and writes. This matches Delphi's public contract. Free Pascal documents the same rewind/whole-stream rule, but its implementation is compatibility context rather than proof of Velox behaviour.

On the common client-dataset path, `bmWrite` requires edit, insert or new-value state and truncates the old BLOB immediately. Freeing the internal stream writes the modified memory buffer back to the current record and marks the field modified; posting and applying updates remain separate.

**Edge cases and quirks**

- The method copies from offset zero, not from the source's incoming Position. Successful completion normally leaves the source at Size.
- A nil, non-seekable, size-less or unreadable source fails after the destination BLOB stream may already have truncated the old value.
- A zero-size source performs no Write call. The common client dataset can consequently store null rather than a distinct non-null empty BLOB.
- The method neither validates a file format nor decodes text. The bytes are copied unchanged.

**Side effects**

Mutates the source Position, replaces the current record's BLOB buffer and marks dataset state according to the owner. It does not free the source, post the record or commit external storage.

**Performance and concurrency**

Time is linear in source size. The copy uses a bounded temporary buffer, but the common client-dataset stream also holds the complete replacement BLOB in memory. Do not share either stream or dataset cursor concurrently without external coordination.

**Related entries**

- [`LoadFromFile`](LoadFromFile.md) opens a file and delegates to this method.
- [`SaveToStream`](SaveToStream.md) copies the current BLOB into a caller-owned destination stream.

**External references**

- [Embarcadero DocWiki: `Data.DB.TBlobField.LoadFromStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TBlobField.LoadFromStream) - the Delphi method registered by Velox.
- [Embarcadero DocWiki: `System.Classes.TStream.CopyFrom`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.CopyFrom) - the exact Count-zero rewind and copy terminal.
- [Free Pascal: `TBlobField.LoadFromStream`](https://www.freepascal.org/docs-html/fcl/db/tblobfield.loadfromstream.html) and [`TStream.CopyFrom`](https://www.freepascal.org/docs-html/rtl/classes/tstream.copyfrom.html) - compatible whole-stream/seek requirements.

<small>Created 2026-07-15</small>
