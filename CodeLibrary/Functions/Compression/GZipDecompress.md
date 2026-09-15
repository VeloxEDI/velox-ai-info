---
title: "GZipDecompress"
description: "Expands a gzip byte array through Velox's custom decompressor."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compression
  - gzip
  - decompression
---

```Delphi
Function GZipDecompress( const Data : TBytes) : TBytes
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Compressed: TBytes;
begin
  Compressed := GZipCompressString('Fictional payload');
  Value := Base64EncodeBytes(GZipDecompress(Compressed));
end;
```

### Usage

`GZipDecompress` expands a gzip byte array through Velox's custom decompressor.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Data` | `TBytes`, `const` | Complete gzip bytes. A zlib stream, raw deflate stream or ZIP archive is a different format. |

**Returns**

The expanded payload bytes. An empty input returns an empty result without calling zlib.

**Behaviour**

Valid gzip data is expanded without interpreting the payload. The function does not verify a media type or convert text; use `GZipDecompressString` only when the expanded bytes are known to be Velox UTF-16LE text.

**Errors**

Negative zlib statuses other than `Z_BUF_ERROR` become `EZDecompressionError`. CRC/header/data errors, allocation failures and integer/range failures propagate. On a caught exception the result is cleared and the exception is re-raised. The suppressed-buffer-error loop means some truncated inputs may not fail promptly.

**Usage notes**

Apply a trusted-source and expected-size policy before using this function. Where possible, reject obviously oversized input earlier and validate the expanded payload against the integration's schema. This API provides no maximum-output parameter.

### Additional Technical Info
`GZipDecompress` expands one gzip member into a new byte array. It is a Velox-owned adaptation of Delphi's `ZDecompress`, using `InflateInit2` with window bits `31` to require a gzip wrapper.

The example builds its input in memory and represents the expanded UTF-16LE bytes as Base64. It is source-reviewed and is not executed by the documentation workflow. Do not use the example as evidence that hostile or truncated gzip input is safely rejected.

**Implementation**

The direct PascalScript registration calls `vxCompression.GZipDecompress`. For non-empty data it rounds the compressed size up to a 256-byte multiple and uses that as both the initial output allocation and later growth increment. It initialises inflate with window bits `31`, repeatedly calls `inflate(..., Z_NO_FLUSH)`, grows the result and resumes at `total_out`, then calls `inflateEnd` and shrinks to the reported output size.

**Edge cases and quirks**

- Empty input returns empty bytes. This differs from Delphi's current `ZDecompress`, which raises a buffer error for an empty zlib input.
- The wrapper deliberately suppresses `Z_BUF_ERROR`, but its loop does not check whether input remains or whether inflate made progress. A truncated gzip member can therefore cause repeated output growth after no more bytes can be consumed, potentially ending only in memory exhaustion or integer/allocation failure.
- Expansion is not capped. Valid highly compressible input can also allocate a very large result.
- Only the gzip wrapper selected by window bits `31` is accepted. The loop stops at the first `Z_STREAM_END` and does not check `avail_in`, so bytes after the first completed member are ignored. It does not expand later members in a concatenated gzip stream.
- Sizes and increments are 32-bit integers. Very large data can overflow or fail allocation before a useful result is returned.

**Side effects**

No external side effect. The function allocates expanding memory.

**Performance and concurrency**

The entire compressed input and expanded result are resident together. CPU time is proportional to the deflate work, but untrusted compression ratios and the no-progress defect make resource use unbounded from the script's perspective. State is local to the call.

**Related entries**

- [`GZipCompress`](GZipCompress.md) creates gzip bytes.
- [`GZipDecompressString`](GZipDecompressString.md) also decodes the expanded bytes as UTF-16LE.
- [`GZipDecompressFile`](GZipDecompressFile.md) is currently defective and does not invoke this function.
- [`ZLibDecompress`](ZLibDecompress.md) expects a zlib wrapper and has a stricter no-progress check in the installed Delphi RTL.

**External references**

- [Embarcadero `System.ZLib`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.ZLib)
- [Free Pascal `TDecompressionStream`](https://www.freepascal.org/docs-html/fcl/zstream/tdecompressionstream.html) - compatibility context only; Velox uses a custom buffer loop rather than this Free Pascal class.

<small>Created 2026-07-15</small>
