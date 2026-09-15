---
title: "LoadFileToStream"
description: "Replaces a supplied memory stream's contents with all bytes from a file."
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - stream
  - memory stream
---

```Delphi
Procedure LoadFileToStream( const aFileName : string; var aStream : TMemoryStream)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    LoadFileToStream('C:\Fictional\Inbound\order.bin', Buffer);
    Value := Buffer.Size;
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`LoadFileToStream` replaces a supplied memory stream's contents with all bytes from a file.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string`, `const` | Path of the source file. Relative paths use the Velox process current directory. |
| `aStream` | `TMemoryStream`, `var` | Existing caller-owned destination. Its current content, size, position and capacity are discarded after the source opens successfully. The reference itself is not reassigned. |

**Returns**

This procedure has no return value. On success, `aStream.Size` equals the number of bytes copied and `aStream.Position` is normally at the end; an empty source leaves both at zero.

**Behaviour**

- A source-open failure leaves the destination unchanged because clearing occurs after the file stream is constructed.
- A successful empty-file load clears the destination and returns immediately.
- A successful non-empty load replaces, rather than appends to, the destination.
- The copied bytes are not decoded or transformed.

**Errors**

File-open, nil-object, allocation, seek, read and write failures propagate. The file handle is still closed, but the destination's previous content is not restored.

### Additional Technical Info
`LoadFileToStream` discards the existing contents of a caller-supplied `TMemoryStream` and copies the complete current file into it. The procedure does not create, replace or free the stream object.

The example reads a fictional file into a locally owned stream and guarantees cleanup. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The script registration binds directly to `vxFiles.LoadFileToStream`. It first opens a read-only `TFileStream` with `fmShareDenyNone`. Only after that succeeds does it call `aStream.Clear`. For a non-empty source it resets the file position to zero and calls Delphi `TStream.CopyFrom` with the file's live size. The source stream is closed in a `finally` block.

`TMemoryStream.Clear` frees the prior memory buffer and resets capacity, size and position. `CopyFrom` reads and writes buffered chunks and requires the requested byte count.

**Edge cases and quirks**

- `aStream` must already reference a valid `TMemoryStream`. A nil reference fails after the source has opened.
- Once `Clear` runs, the old content cannot be recovered by this procedure. A later copy exception can leave the destination empty or partially populated.
- Any saved pointer to the destination's old `Memory` buffer becomes invalid when `Clear` frees that buffer.
- `fmShareDenyNone` permits concurrent writers. File-size changes can make the copy incomplete or fail with a read error; the operation is not a stable snapshot.
- The `var` mode is part of the scripting declaration even though the current implementation mutates the object without assigning a different reference.

**Side effects**

Reads the file and destructively replaces the supplied stream's data, capacity, size and position.

**Performance and concurrency**

The call is synchronous and memory use grows with the full file size. `CopyFrom` uses a temporary buffer as well as the destination allocation. Do not access the destination from another thread while it is being cleared or filled, and coordinate external writers when consistency matters.

**Remarks**

Create the destination before calling and free it in the same ownership scope. If replacing valid existing data is risky, load into a separate temporary stream and adopt it only after success.

**Related entries**

- [`LoadFileToBytes`](LoadFileToBytes.md) returns a detached byte array.
- [`SaveStreamToFile`](SaveStreamToFile.md) writes a stream to a file.
- [`StreamToBytes`](../Conversion/StreamToBytes.md) copies a memory stream into a byte array.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create) and [`TMemoryStream.Clear`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TMemoryStream.Clear) - the Delphi open and destructive-clear contracts used by Velox.
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html), [`TMemoryStream.Clear`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.clear.html) and [`TStream.CopyFrom`](https://www.freepascal.org/docs-html/rtl/classes/tstream.copyfrom.html) - compatible stream context; installed Delphi defines the current copy implementation.

<small>Created 2026-07-15</small>
