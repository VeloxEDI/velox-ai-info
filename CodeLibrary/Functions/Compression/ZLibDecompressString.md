---
title: "ZLibDecompressString"
description: "Expands zlib-wrapped bytes and decodes the result as a Delphi UTF-16LE Unicode string."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compression
  - zlib
  - unicode
---

```Delphi
Function ZLibDecompressString( const Data : TBytes) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Compressed: TBytes;
begin
  Compressed := ZLibCompressString('Fictional order 1001');
  Value := ZLibDecompressString(Compressed);
end;
```

### Usage

`ZLibDecompressString` expands zlib-wrapped bytes and decodes the result as a Velox UTF-16LE Unicode string.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Data` | `TBytes`, `const` | Complete zlib stream whose expanded payload is expected to be UTF-16LE text. |

**Behaviour**

Data produced by `ZLibCompressString` is encoded as UTF-16LE without a BOM and is intended to round-trip. Data produced by another system must use exactly that encoding after zlib expansion. A successful zlib checksum does not prove that the payload is valid or intended text.

**Errors**

All `ZDecompress` errors, allocation errors and encoding failures propagate. No partial string is returned.

**Usage notes**

Prefer [`ZLibDecompress`](ZLibDecompress.md) when the protocol specifies an encoding such as UTF-8. Decode the returned bytes using that encoding instead of assuming the UTF-16LE format used by this function.

### Additional Technical Info
`ZLibDecompressString` expands a zlib-wrapped byte array and decodes the result through Delphi `TEncoding.Unicode`. It is the intended inverse of [`ZLibCompressString`](ZLibCompressString.md), not a general-purpose compressed-text detector.

The example round-trips fictional text in memory. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The scripting import calls `vxCompression.ZLibDecompressString`, which delegates directly to installed `System.ZLib.ZDecompressStr`. The RTL copies the argument, calls `ZDecompress`, then passes the expanded bytes to `TEncoding.Unicode.GetString`.

**Edge cases and quirks**

- Empty compressed input raises `EZDecompressionError`; a valid zlib stream representing an empty string returns `''` subject to the underlying empty-array decoding implementation.
- Gzip, ZIP and raw deflate data are wrapper mismatches.
- Expanded output is not capped. During decoding, the compressed bytes, expanded bytes and managed Unicode string can coexist.
- The decoder does not negotiate UTF-8, inspect a content type or normalise Unicode. Use the byte function for any other encoding.
- Malformed or odd-length UTF-16 payloads are outside the matching-pair contract; do not use decoder output as a validity check for arbitrary binary data.

**Side effects**

None outside memory allocation.

**Performance and concurrency**

The operation is synchronous and can allocate several times the compressed size. It uses local state, but an attacker-controlled compression ratio can affect the whole process.

**Related entries**

- [`ZLibCompressString`](ZLibCompressString.md) creates the matching zlib/UTF-16LE payload.
- [`ZLibDecompress`](ZLibDecompress.md) returns bytes without interpreting text.
- [`GZipDecompressString`](GZipDecompressString.md) applies the same text decoding after custom gzip expansion.

**External references**

- [Embarcadero `System.ZLib.ZDecompressStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.ZLib.ZDecompressStr)
- [Embarcadero `System.SysUtils.TEncoding.Unicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.Unicode)
- [Free Pascal `UnicodeString`](https://www.freepascal.org/docs-html/rtl/system/unicodestring.html) - compatibility context only; it does not define the Delphi decompression/encoding sequence.

<small>Created 2026-07-15</small>
