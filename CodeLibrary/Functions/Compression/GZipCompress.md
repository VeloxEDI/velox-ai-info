---
title: "GZipCompress"
description: "Compresses a byte array into a gzip member through Velox's custom System.ZLib wrapper."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compression
  - gzip
  - bytes
---

```Delphi
Function GZipCompress( const Data : TBytes) : TBytes
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Data: TBytes;
begin
  Data := Base64DecodeBytes('RXhhbXBsZSBwYXlsb2Fk');
  Value := Base64EncodeBytes(GZipCompress(Data));
end;
```

### Usage

Use `GZipCompress` to convert a `TBytes` value into a new gzip-compressed byte array. It works with bytes, not text; encode text deliberately before compression and preserve the corresponding decoding contract for the receiver.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Data` | `TBytes`, `const` | Complete uncompressed byte array. The function does not interpret text or add an application-level filename. |

**Returns**

A new byte array containing one gzip member when compression completes successfully.

**Errors**

Allocation failures and array/range failures propagate. On a caught exception the function clears its result and re-raises.

**Usage notes**

Use [`GZipCompressString`](GZipCompressString.md) only when the intended payload is Velox UTF-16LE text. For arbitrary bytes, this function is the appropriate gzip entry, subject to the current growth and empty-input defects. Base64 is a transport representation and is not part of the gzip format.

### Additional Technical Info
`GZipCompress` attempts to encode the complete `TBytes` value as one gzip member at Delphi's default compression level. It is a Velox-owned adaptation of `System.ZLib.ZCompress`, changed to call `DeflateInit2` with window bits `31` so zlib emits a gzip header and trailer.

The example converts fictional Base64 text to bytes, compresses those bytes and converts the binary result back to Base64 for transport. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The PascalScript import registers `vxCompression.GZipCompress` directly. The implementation:

1. calculates an initial output allocation as the input length plus 10%, plus 12 bytes, rounded up to a 256-byte boundary;
2. points a zero-initialised `TZStreamRec` at the input and result arrays;
3. calls `System.ZLib.DeflateInit2` with the default zlib level, deflate method, window bits `31`, memory level `8` and default strategy;
4. calls `deflate(..., Z_FINISH)` until `Z_STREAM_END`; and
5. calls `deflateEnd` and shrinks the result to `total_out`.

Window bits `31` means a 15-bit deflate window plus gzip wrapper generation. The result is gzip data, not a ZIP archive or zlib-wrapped stream.

**Edge cases and quirks**

- For an empty input, the initial output length is zero. The implementation immediately evaluates `@Data[0]`; current Velox project configurations enable range checking, so the call raises a range-check exception before compression. A build without range checks would reach the separate zero-output-space/zlib-buffer-error boundary. Do not pass an empty array.
- The buffer-growth branch contains a source defect: after resizing, `next_out` is reset to `@Result[0]` instead of the current `total_out` offset. If that branch is reached, later output can overwrite the beginning of the gzip member and produce corrupt data. The normal initial allocation is deliberately generous, but the defect remains a correctness boundary for unusually large or overflow-affected inputs.
- Input and output sizes are held in 32-bit `Integer` fields and zlib counters. This is not a large-file or streaming interface.
- A gzip member created here carries no original filename, application metadata, encryption or authentication.

**Side effects**

No external side effect. The function allocates result and zlib working memory.

**Performance and concurrency**

Compression is synchronous and generally proportional to input size and compressibility. The entire input and complete result are simultaneously resident, in addition to zlib working memory. State is local to the call; no shared mutable compression context is used.

**Related entries**

- [`GZipDecompress`](GZipDecompress.md) is the intended byte-array inverse.
- [`GZipCompressFile`](GZipCompressFile.md) streams a file into a gzip result.
- [`ZLibCompress`](ZLibCompress.md) creates a zlib-wrapped stream instead.
- [`Zip`](Zip.md) creates a named multi-entry ZIP archive.

**External references**

- [Embarcadero `System.ZLib`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.ZLib) - the current page exposes the low-level `deflateInit2`/`deflate` APIs used by the wrapper.
- [Free Pascal `ZStream`](https://www.freepascal.org/docs-html/fcl/zstream/index.html) - compatibility context only; it does not define Velox's custom buffer logic.

<small>Created 2026-07-15</small>
