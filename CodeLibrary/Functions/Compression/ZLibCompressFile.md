---
title: "ZLibCompressFile"
description: "Reads a file and returns its contents as zlib-compressed bytes."
sidebar_position: 9
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
Function ZLibCompressFile( const aFileName : string) : TBytes
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Base64EncodeBytes(ZLibCompressFile('C:\Example\input.dat'));
end;
```

### Usage

`ZLibCompressFile` reads a file and returns its contents as zlib-compressed bytes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `String`, `const` | Source path resolved under the executing Velox process identity. |

**Returns**

The file content as one zlib-wrapped deflate stream in memory.

**Behaviour**

The returned payload has zlib framing and carries no source filename, timestamps, attributes or content type. Because sharing denies neither reads nor writes, another process can change the source while it is being compressed.

**Errors**

File-open, access, read, allocation, stream-write and `EZCompressionError` exceptions propagate. No partial result or Boolean error indication is returned.

**Usage notes**

Use an allow-listed stable input path. If a physical compressed artefact is needed, store the returned bytes separately and use a temporary-file/atomic-move policy appropriate to the flow.

### Additional Technical Info
`ZLibCompressFile` opens a source file, streams it through Delphi's zlib compressor at the default level and returns the complete compressed stream as `TBytes`. It does not write a compressed file or modify the source.

The example path is fictional. The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The direct registration calls `vxCompression.ZLibCompressFile`. It opens `TFileStream` with `fmOpenRead or fmShareDenyNone`, creates an empty `TBytesStream`, and passes both to `System.ZLib.ZCompressStream(..., zcDefault)`. The installed RTL reads and writes through 32 KiB buffers, finalises deflate, and returns. Velox then allocates an exact-size result and copies only `lStream.Size` bytes rather than the capacity of the byte stream.

**Edge cases and quirks**

- Input is streamed, but the complete compressed output remains in `TBytesStream` and is then copied to the result.
- A zero-byte file is still represented by a non-empty, valid zlib stream after the compressor is finalised.
- The source file is not locked against writers, so the result is not a guaranteed point-in-time snapshot.
- The exact-result copy uses element-zero expressions. A normal compressed stream is non-empty, but the expression remains dependent on compiler range behaviour if upstream output were ever empty.
- The file stream is constructed before the byte stream and before the `try/finally`. If creating the byte stream fails, the already-open file stream is not freed by this routine.
- No maximum source size, output size, timeout or cancellation mechanism is exposed to the script.

**Side effects**

Opens and reads the file and allocates output memory. It performs no destination write.

**Performance and concurrency**

The file is processed in 32 KiB chunks, while the complete compressed output is retained and copied. Compression is synchronous. Product compression state is local, but concurrent source writers are an external race.

**Related entries**

- [`ZLibCompress`](ZLibCompress.md) accepts bytes already in memory.
- [`ZLibDecompressFile`](ZLibDecompressFile.md) reads a zlib-wrapped file and returns expanded bytes.
- [`GZipCompressFile`](GZipCompressFile.md) emits gzip rather than zlib framing.

**External references**

- [Embarcadero `System.ZLib.ZCompressStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.ZLib.ZCompressStream)
- [Free Pascal `TCompressionStream.Create`](https://www.freepascal.org/docs-html/fcl/zstream/tcompressionstream.create.html) - compatible streaming/finalisation context; Velox uses Delphi's `ZCompressStream` routine.

<small>Created 2026-07-15</small>
