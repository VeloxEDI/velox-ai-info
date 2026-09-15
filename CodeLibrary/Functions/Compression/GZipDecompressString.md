---
title: "GZipDecompressString"
description: "Expands gzip bytes and decodes the result as a Delphi UTF-16LE Unicode string."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compression
  - gzip
  - unicode
---

```Delphi
Function GZipDecompressString( const Data : TBytes) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Compressed: TBytes;
begin
  Compressed := GZipCompressString('Fictional order 1001');
  Value := GZipDecompressString(Compressed);
end;
```

### Usage

`GZipDecompressString` expands gzip bytes and decodes the result as a Velox UTF-16LE Unicode string.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Data` | `TBytes`, `const` | Complete gzip member whose expanded bytes are expected to be Velox UTF-16LE text. |

**Returns**

The decoded Velox string. Empty input produces an empty byte result in `GZipDecompress` and therefore an empty string.

**Behaviour**

Data created by `GZipCompressString` is intended to round-trip. Gzip data created by common tools usually contains the original file bytes, often UTF-8 or an arbitrary binary format; passing that data here can return incorrect text even when decompression succeeds.

**Errors**

All gzip, allocation and Unicode-decoding failures propagate. No partial string is returned.

**Usage notes**

For arbitrary gzip payloads call [`GZipDecompress`](GZipDecompress.md) and interpret the returned bytes according to the integration's explicit wire format. Do not infer text encoding from the `.gz` function.

### Additional Technical Info
`GZipDecompressString` expands gzip bytes with Velox's custom decompressor and decodes the expanded payload through Delphi `TEncoding.Unicode`. Use it only for gzip data whose payload is UTF-16 little-endian text without a byte-order mark, such as data created by [`GZipCompressString`](GZipCompressString.md).

The example round-trips fictional text in memory. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The directly registered function copies the parameter to a local byte array, calls `vxCompression.GZipDecompress`, then calls `TEncoding.Unicode.GetString` on the expanded bytes. There is no BOM detection, UTF-8 fallback, content-type check or schema validation.

**Edge cases and quirks**

- The function inherits `GZipDecompress`'s no-progress defect: truncated input can cause repeated buffer growth rather than a prompt decompression exception.
- Expanded size is unlimited and the complete expanded byte array coexists with the resulting managed string.
- Decoding is explicitly UTF-16LE. No byte-order mark is required or removed as an encoding negotiation mechanism.
- Binary payloads, UTF-8 payloads and odd or malformed UTF-16 input are outside the intended contract; decoder behaviour must not be used as binary validation.

**Side effects**

None outside memory allocation.

**Performance and concurrency**

The compressed bytes, expanded bytes and decoded string can coexist in memory. The call is synchronous and uses local state.

**Related entries**

- [`GZipCompressString`](GZipCompressString.md) creates the matching UTF-16LE gzip payload.
- [`GZipDecompress`](GZipDecompress.md) returns bytes without text conversion.
- [`ZLibDecompressString`](ZLibDecompressString.md) applies the same text decoding to zlib-wrapped data.

**External references**

- [Embarcadero `System.SysUtils.TEncoding.Unicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.Unicode)
- [Embarcadero `System.ZLib`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.ZLib)
- [Free Pascal `UnicodeString`](https://www.freepascal.org/docs-html/rtl/system/unicodestring.html) - compatibility context only; Velox uses Delphi's encoding and custom gzip implementation.

<small>Created 2026-07-15</small>
