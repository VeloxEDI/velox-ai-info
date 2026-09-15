---
title: "GZipCompressFile"
description: "Reads a file and returns its contents as gzip-compressed bytes."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compression
  - gzip
  - file
---

```Delphi
Function GZipCompressFile( const aFileName : string) : TBytes
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Base64EncodeBytes(GZipCompressFile('C:\Example\input.txt'));
end;
```

### Usage

`GZipCompressFile` reads a file and returns its contents as gzip-compressed bytes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `String`, `const` | Path to the source file, resolved under the executing Velox process's Windows identity and working environment. |

**Returns**

The complete gzip member as a new byte array.

**Behaviour**

The gzip payload is exactly the file bytes read. The gzip member does not preserve the source filename, Windows attributes or the source modification time. Other processes are allowed to read or write the source while Velox has it open.

**Errors**

File-not-found, access-denied, sharing, read, allocation and compression exceptions propagate to the script. There is no Boolean failure result, retry or partial-data return.

### Additional Technical Info
`GZipCompressFile` opens a file for reading, streams its complete contents into a gzip compression stream and returns the resulting gzip member as `TBytes`. It does not create a `.gz` file or modify the source; the caller decides where and how to store the returned bytes.

The path in the example is fictional. The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The direct runtime registration calls `vxCompression.GZipCompressFile`. It opens a `TFileStream` with `fmOpenRead or fmShareDenyNone`, creates an in-memory `TBytesStream`, then creates `System.ZLib.TZCompressionStream` with `zcDefault` and window bits `31`. `CopyFrom` transfers `lFile.Size` bytes through the compression stream. The compression stream must be destroyed to emit its final deflate blocks and gzip trailer; only then does Velox copy the exact in-memory stream size into the result.

**Edge cases and quirks**

- A concurrently modified file is not guaranteed to produce a coherent snapshot. `lFile.Size` is captured for `CopyFrom`, but the share mode permits writers.
- The gzip result is retained completely in a `TBytesStream` and then copied to a second exact-length result array.
- Resource construction occurs before the `try/finally`. Failure while constructing the byte stream or compression stream can leak resources. If `CopyFrom` raises, the compression stream is not freed by the `finally`, so its zlib state can leak and the member is not finalised.
- The exact-size copy indexes byte zero even when the stream size is zero. A normal finalised gzip stream is non-empty, but exceptional or changed upstream behaviour could expose a range-check boundary.
- The source length and stream copy count are subject to the integer/count limits of the compiled stream implementation.

**Side effects**

Opens and reads the nominated file. It allocates an in-memory compressed stream and result but does not write a destination file.

**Performance and concurrency**

Input is streamed rather than loaded in one separate byte array, but the complete compressed result is held in memory and then copied. The call is synchronous. No shared compression state is used, although concurrent modification of the source remains an external race.

**Remarks**

Run this under a service account only with an allow-listed, controlled path. If the integration needs a physical `.gz` file, write the returned bytes through a governed file operation; this helper itself performs only the read and compression.

**Related entries**

- [`GZipCompress`](GZipCompress.md) compresses an existing byte array.
- [`GZipDecompress`](GZipDecompress.md) decompresses gzip bytes.
- [`GZipDecompressFile`](GZipDecompressFile.md) is currently defective and must not be treated as the file inverse.
- [`ZLibCompressFile`](ZLibCompressFile.md) uses a zlib wrapper rather than gzip.

**External references**

- [Embarcadero `System.ZLib.TZCompressionStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.ZLib.TZCompressionStream)
- [Free Pascal `TCompressionStream.Create`](https://www.freepascal.org/docs-html/fcl/zstream/tcompressionstream.create.html) - compatibility context, including the requirement to destroy a compression stream before all output is complete.

<small>Created 2026-07-15</small>
