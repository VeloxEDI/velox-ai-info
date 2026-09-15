---
title: "StreamToBytes"
description: "Copies an entire memory stream into a new byte array after rewinding the stream."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - stream
  - bytes
  - memory stream
---

```Delphi
function StreamToBytes(const aStream: TMemoryStream): TBytes;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
  Data: TBytes;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamUTF8('ABC', Buffer);
    Data := StreamToBytes(Buffer);
    Value := Length(Data);  // 3
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StreamToBytes` copies an entire memory stream into a new byte array after rewinding the stream.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aStream` | `TMemoryStream`, `const` | Existing readable memory stream. `const` protects only the object reference; the function changes the object's `Position`. |

**Returns**

A newly allocated zero-based byte array whose length is the stream's `Size`. An empty stream returns an empty array.

**Errors**

Nil-object, seek, read and allocation exceptions propagate. There is no rollback to the incoming position and no explicit short-read error.

**Usage notes**

Use this function when an API requires a detached byte array. If the consumer can use a stream directly, avoiding this copy reduces peak memory.

### Additional Technical Info
`StreamToBytes` returns a new `TBytes` containing the complete current content of a `TMemoryStream`. It always reads from offset zero, regardless of the stream's incoming position. The caller continues to own the stream and owns the returned managed array.

The example copies a fictional three-character UTF-8 payload in memory. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox stream import binds directly to `vxStream.StreamToBytes`. The wrapper assigns `Position := 0`, saves the `Int64` `Size`, allocates that many result bytes, exits for size zero, and otherwise calls `Read(Result[0], Size)` once.

The function ignores the returned read count. A normal, unchanged `TMemoryStream` supplies all bytes. A descendant with unusual read behaviour, or concurrent mutation despite the declared parameter type, could return fewer bytes; the unwritten tail of the newly allocated array then remains zero-filled.

**Edge cases and quirks**

- The incoming position is discarded. After a successful non-empty read, position is normally at the end; an empty stream remains at zero.
- `const` does not make the object immutable. Code that needs the previous position must save and restore it outside this function.
- A `nil` reference fails when `Position` is assigned.
- The result length follows the complete `Int64` size. Allocation or platform dynamic-array limits can fail for very large streams.
- The function takes `TMemoryStream`, not an arbitrary `TStream`; it performs a copy rather than exposing the stream's internal buffer.

**Side effects**

Mutates `aStream.Position`. It does not change stream bytes, size or ownership.

**Performance and concurrency**

Time and additional memory are linear in stream size. The complete stream and copied array coexist. Do not read or mutate the same stream concurrently without external coordination.

**Related entries**

- [`BytesToStream`](BytesToStream.md) clears a memory stream and copies bytes into it.
- [`StreamToHex`](StreamToHex.md) returns a hexadecimal representation without exposing a byte array.

**External references**

- [Embarcadero `TStream.Read`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Read) - the Delphi read contract reached by the Velox wrapper.
- [Free Pascal `TStream.Read`](https://www.freepascal.org/docs-html/rtl/classes/tstream.read.html) - compatible stream-read context; Velox executes Delphi's `TMemoryStream` implementation.

<small>Created 2026-07-15</small>
