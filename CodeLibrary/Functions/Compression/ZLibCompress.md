---
title: "ZLibCompress"
description: "Compresses a byte array into a zlib-wrapped deflate stream at Delphi's default level."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compression
  - zlib
  - bytes
---

```Delphi
Function ZLibCompress( const Data : TBytes) : TBytes
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Data: TBytes;
begin
  Data := Base64DecodeBytes('RXhhbXBsZSBwYXlsb2Fk');
  Value := Base64EncodeBytes(ZLibCompress(Data));
end;
```

### Usage

`ZLibCompress` compresses a byte array into a zlib-wrapped deflate stream at Velox's default level.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Data` | `TBytes`, `const` | Complete uncompressed payload. No character encoding or content schema is applied. |

**Returns**

A new byte array containing zlib framing, deflate data and the zlib checksum.

**Behaviour**

The function preserves bytes, not semantic values. A successful round-trip through [`ZLibDecompress`](ZLibDecompress.md) returns the original byte sequence.

**Errors**

Velox raises `EZCompressionError` for zlib failures. Allocation and range errors can also propagate. The RTL clears its output on its protected exception path.

**Usage notes**

Use this function only when the peer expects zlib framing. Protocols that require raw deflate, gzip or ZIP need their corresponding function/container rather than the same bytes with a different extension.

### Additional Technical Info
`ZLibCompress` compresses a complete byte array as a zlib-wrapped deflate stream at Delphi's `zcDefault` level. The result is not a gzip member and is not a ZIP archive.

The example compresses fictional bytes and represents the binary result as Base64. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The scripting import registers `vxCompression.ZLibCompress` directly. The wrapper selects the `System.ZLib.ZCompress(const inBuffer: TBytes; out outBuffer: TBytes; level)` overload with `zcDefault`. In the installed Studio 37.0 RTL, Delphi allocates an estimate rounded to 256 bytes, calls `DeflateInit`, repeatedly finishes deflate while growing by 256 bytes, calls `deflateEnd` and shrinks the output to `total_out`.

**Edge cases and quirks**

- For an empty array, the current RTL starts with a zero-length output array and takes element-zero addresses before zlib can grow the output. With ordinary production compiler settings this can produce a valid compressed empty stream, but range-check settings make those zero-index expressions an implementation boundary. Do not assume identical behaviour in a differently compiled runtime.
- The zlib format includes its own lightweight integrity check but provides no authentication or confidentiality.
- Input, estimates and zlib counters are bounded by 32-bit sizes in this overload. This is not a streaming large-file API.
- `zcDefault` delegates the actual compression level to the embedded zlib implementation; scripts cannot select another level through this entry.

**Side effects**

None outside memory allocation.

**Performance and concurrency**

The complete input and result coexist in memory. Compression is synchronous and CPU cost varies with size and compressibility. All stream state is local to the call.

**Related entries**

- [`ZLibDecompress`](ZLibDecompress.md) is the byte-array inverse.
- [`ZLibCompressString`](ZLibCompressString.md) first encodes Delphi text as UTF-16LE.
- [`GZipCompress`](GZipCompress.md) emits gzip framing through custom Velox code.
- [`Zip`](Zip.md) creates a file archive.

**External references**

- [Embarcadero `System.ZLib.ZCompress`](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.ZLib.ZCompress)
- [Free Pascal `ZStream`](https://www.freepascal.org/docs-html/fcl/zstream/index.html) - compatible deflate-stream context only; Free Pascal does not define the exact Delphi overload used here.

<small>Created 2026-07-15</small>
