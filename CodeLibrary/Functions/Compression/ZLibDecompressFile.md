---
title: "ZLibDecompressFile"
description: "Reads a zlib-compressed file and returns its decompressed bytes."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compression
  - zlib
  - file
---

```Delphi
Function ZLibDecompressFile( const aFileName : string) : TBytes
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Base64EncodeBytes(ZLibDecompressFile('C:\Example\input.zlib'));
end;
```

### Usage

`ZLibDecompressFile` reads a zlib-compressed file and returns its decompressed bytes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `String`, `const` | Path to a zlib-wrapped source file under the executing Velox process identity. |

**Returns**

The complete expanded payload as `TBytes`.

**Behaviour**

The operation expects zlib framing regardless of filename extension. It returns bytes and preserves no filename, timestamp or content-type metadata.

**Errors**

File-open, access, read, allocation, stream and `EZDecompressionError` exceptions propagate. No partial result or Boolean failure is returned.

### Additional Technical Info
`ZLibDecompressFile` opens a file containing a zlib-wrapped deflate stream, expands it through Delphi's stream routine and returns the complete original bytes in memory. The source file is not modified.

The example path and extension are fictional; the function inspects the data, not the name. The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The direct registration calls `vxCompression.ZLibDecompressFile`. It opens a `TFileStream` with `fmOpenRead or fmShareDenyNone`, creates an empty `TBytesStream`, and calls `System.ZLib.ZDecompressStream`. The installed RTL uses 32 KiB input and output buffers and inflates until `Z_STREAM_END`, raising if it cannot complete. Velox then copies exactly the in-memory output stream size to a new result array.

**Edge cases and quirks**

- An empty file raises a decompression buffer error.
- A valid compressed empty payload produces a zero-byte expanded stream. Velox then evaluates `Move(lStream.Bytes[0], Result[0], 0)`; current project configurations enable range checking, so indexing the empty arrays raises a range-check exception even though the move count is zero.
- Expanded output is unbounded and retained completely in memory. A compression bomb can exhaust the Velox process.
- The source share mode permits concurrent writers, so a changing compressed stream may fail or, in a race, yield data not corresponding to a stable file snapshot.
- Gzip, raw deflate and ZIP input are not accepted as zlib merely because the extension is changed.
- The file stream is constructed before the byte stream and before the `try/finally`. If creating the byte stream fails, the already-open file stream is not freed by this routine.

**Side effects**

Opens and reads the nominated source. It allocates the complete expanded payload but writes no file.

**Performance and concurrency**

Compressed input is streamed in 32 KiB chunks, while all expanded data accumulates in memory and is copied once more into the result. The call is synchronous. Concurrent source modification is an external race.

**Remarks**

Only process trusted or size-governed inputs. If the flow requires a physical expanded file, a bounded streaming component is safer for large data than materialising the complete result in a script variable.

**Related entries**

- [`ZLibDecompress`](ZLibDecompress.md) expands bytes already in memory.
- [`ZLibCompressFile`](ZLibCompressFile.md) creates the matching zlib-wrapped bytes from a file.
- [`GZipDecompressFile`](GZipDecompressFile.md) is not a gzip equivalent in the current implementation because it returns the input unchanged.

**External references**

- [Embarcadero `System.ZLib.ZDecompressStream`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.ZLib.ZDecompressStream)
- [Free Pascal `TDecompressionStream`](https://www.freepascal.org/docs-html/fcl/zstream/tdecompressionstream.html) - compatible stream model; Velox runs the Delphi routine.

<small>Created 2026-07-15</small>
