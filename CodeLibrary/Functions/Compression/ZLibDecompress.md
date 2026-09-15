---
title: "ZLibDecompress"
description: "Expands a zlib-wrapped byte array into its original bytes."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compression
  - zlib
  - decompression
---

```Delphi
Function ZLibDecompress( const Data : TBytes) : TBytes
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Compressed: TBytes;
begin
  Compressed := ZLibCompressString('Fictional payload');
  Value := Base64EncodeBytes(ZLibDecompress(Compressed));
end;
```

### Usage

`ZLibDecompress` expands a zlib-wrapped byte array into its original bytes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Data` | `TBytes`, `const` | Complete zlib stream. |

**Returns**

The expanded byte sequence in a newly allocated `TBytes` value.

**Behaviour**

A successful result is binary data. If it represents a string, record the encoding separately or use `ZLibDecompressString` only for the exact UTF-16LE contract of the matching Velox compressor.

**Errors**

Corrupt headers, checksums, truncated input, extra input, dictionaries and other zlib failures raise `EZDecompressionError`. Allocation and range errors propagate. The RTL clears the result on its protected exception path.

### Additional Technical Info
`ZLibDecompress` expands a complete zlib-wrapped deflate stream and returns its original bytes. It does not decode text or read ZIP/gzip containers.

The example represents the expanded UTF-16LE bytes as Base64. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The direct registration calls `vxCompression.ZLibDecompress`, which selects `System.ZLib.ZDecompress(const inBuffer: TBytes; out outBuffer: TBytes; outEstimate)` with estimate `0`. The installed Studio 37.0 RTL uses the compressed length rounded to 256 bytes as its initial size and growth increment, calls `InflateInit`, and checks both progress and trailing/unconsumed input before accepting `Z_STREAM_END`.

**Edge cases and quirks**

- Empty input raises `EZDecompressionError` with a zlib buffer-error message; it does not return empty bytes.
- A gzip member, raw deflate stream or ZIP archive is a wrapper mismatch and normally raises a decompression error.
- The RTL rejects a stream that ends while compressed input remains, so concatenated streams or trailing bytes are not silently accepted by this overload.
- Output size is not capped. A small valid stream can allocate a large result.
- Buffer sizes and zlib counters are 32-bit; very large results can fail or overflow before completion.

**Side effects**

No external side effect. The function allocates expanding output memory.

**Performance and concurrency**

The complete compressed and expanded arrays coexist. Work is synchronous and depends on compressed and expanded sizes. State is local, but untrusted compression ratios can exhaust process resources.

**Remarks**

Apply an expected maximum expanded size before accepting external compressed data. This API cannot enforce that maximum during inflate, so high-risk inputs should be handled by a bounded integration component rather than directly in a Velox script.

**Related entries**

- [`ZLibCompress`](ZLibCompress.md) creates the expected wrapper.
- [`ZLibDecompressString`](ZLibDecompressString.md) decodes the expanded bytes as UTF-16LE.
- [`GZipDecompress`](GZipDecompress.md) expects gzip and has different empty/truncated behaviour.

**External references**

- [Embarcadero `System.ZLib.ZDecompress`](https://docwiki.embarcadero.com/Libraries/Alexandria/en/System.ZLib.ZDecompress)
- [Free Pascal `TDecompressionStream`](https://www.freepascal.org/docs-html/fcl/zstream/tdecompressionstream.html) - compatible inflate context only; it is not the exact Delphi array overload.

<small>Created 2026-07-15</small>
