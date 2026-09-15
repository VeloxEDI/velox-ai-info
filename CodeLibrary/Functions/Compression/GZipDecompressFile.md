---
title: "GZipDecompressFile"
description: "Reads a named file through the current GZip file helper; despite its name, the implementation returns the file's compressed bytes unchanged."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compression
  - gzip
  - defect
---

```Delphi
Function GZipDecompressFile( const aFileName : string) : TBytes
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Current behaviour: this encodes the original .gz file bytes, not its payload. }
  Value := Base64EncodeBytes(GZipDecompressFile('C:\Example\input.gz'));
end;
```

### Usage

Do not use `GZipDecompressFile` when expanded content is required. Despite its name, current Velox returns the file's original compressed bytes unchanged.

Use `GZipDecompress(LoadFileToBytes(Path))` instead, after applying appropriate file-size, expansion-size and trust limits. The replacement reads and expands the complete content in memory.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `String`, `const` | Path of the file to read under the executing Velox process identity. The extension is not inspected. |

**Returns**

The original file bytes in a new `TBytes` value. This is current defective behaviour, not the intended decompressed result.

**Behaviour**

For a stable, readable, non-empty file, the result is a byte-for-byte copy of the file. A `.gz` extension has no special effect. The source is not modified.

**Errors**

File-open, access, read, allocation, stream-construction and range errors propagate. A well-formedness error in the gzip data normally does not occur because the gzip bytes are never read through the decompressor.

**Usage notes**

Treat scripts using this identifier as candidates for remediation. A safe replacement pattern is `GZipDecompress(LoadFileToBytes(Path))`, but it still inherits the custom decompressor's unbounded-expansion and truncated-input loop, so it requires explicit source trust and expected-size controls.

### Additional Technical Info
**Warning - current implementation defect:** `GZipDecompressFile` does **not** decompress the file in the current product source. It returns the bytes stored in the nominated file unchanged. Do not use this function where expanded content is required. Load the file bytes and call [`GZipDecompress`](GZipDecompress.md) only after applying the size and trust controls described on that page.

The fictional example demonstrates the actual result so an existing script can be recognised and corrected. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The direct registration calls `vxCompression.GZipDecompressFile`. It opens the file for shared reading and creates an empty `TBytesStream`. It then constructs a `TZDecompressionStream` over that **empty** byte stream, but never reads from the decompression stream. Instead, it copies `lFile.Size` bytes directly from the file into the underlying byte stream and copies those same bytes to the result. Freeing the unused decompression stream cannot retroactively transform the bytes.

**Edge cases and quirks**

- The implementation defect is unconditional in the traced source: no decompression read occurs.
- The file is opened with `fmShareDenyNone`, so another process can write it while the copy is running. The requested copy count is the size observed before copying.
- A full copy is held in the byte stream and then copied again to the result.
- The file, byte stream and decompression stream are constructed before entering the protected block. Constructor failures can leak earlier resources.
- For a zero-byte file, the exact-size `Move` still indexes element zero of both empty arrays. Current Velox project configurations enable range checking, so an empty file raises a range-check exception even though the move count is zero.

**Side effects**

Opens and reads the nominated file. It performs no destination write.

**Performance and concurrency**

The operation is a synchronous whole-file memory copy with an unnecessary decompression-stream allocation. Concurrent writers can make the read inconsistent. No shared product state is changed.

**Related entries**

- [`GZipDecompress`](GZipDecompress.md) performs actual gzip decompression on bytes.
- [`GZipDecompressString`](GZipDecompressString.md) decompresses and interprets a UTF-16LE payload.
- [`ZLibDecompressFile`](ZLibDecompressFile.md) is a functioning file adapter for zlib-wrapped data, not gzip.

**External references**

- [Embarcadero `System.ZLib.TZDecompressionStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.ZLib.TZDecompressionStream) - the stream must be read to produce decompressed bytes; the current Velox helper never does so.
- [Free Pascal `TDecompressionStream`](https://www.freepascal.org/docs-html/fcl/zstream/tdecompressionstream.html) - compatibility context describing the same read-to-decompress stream model.

<small>Created 2026-07-15</small>
