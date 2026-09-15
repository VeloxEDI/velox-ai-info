---
title: "ZLibCompressString"
description: "Encodes a Delphi Unicode string as UTF-16LE and returns zlib-compressed bytes."
sidebar_position: 10
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
Function ZLibCompressString( const S : string) : TBytes
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Base64EncodeBytes(ZLibCompressString('Fictional order 1001'));
end;
```

### Usage

`ZLibCompressString` encodes a Velox Unicode string as UTF-16LE and returns zlib-compressed bytes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `String`, `const` | Text to encode and compress. |

**Behaviour**

Text created here is intended to round-trip through [`ZLibDecompressString`](ZLibDecompressString.md). Other consumers must explicitly expand zlib and decode UTF-16LE. The payload is not UTF-8 and contains no encoding negotiation metadata.

**Errors**

Encoding allocation failures, `EZCompressionError`, range and allocation failures propagate. There is no partial result.

**Usage notes**

Adopt this function only where both endpoints explicitly agree on Velox UTF-16LE text. For a protocol-defined encoding such as UTF-8, encode to bytes according to that protocol and call [`ZLibCompress`](ZLibCompress.md).

### Additional Technical Info
`ZLibCompressString` encodes a Delphi Unicode string as UTF-16 little-endian bytes without a byte-order mark and returns those bytes in a zlib-wrapped deflate stream.

The example converts the binary result to Base64 for transport. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The direct registration calls `vxCompression.ZLibCompressString`, which calls the installed `System.ZLib.ZCompressStr(S, zcDefault)`. In Studio 37.0, `ZCompressStr` obtains bytes through `TEncoding.Unicode.GetBytes(S)` and calls `ZCompress`. The current RTL implementation does not forward its `level` parameter to that inner call; this makes no visible difference here because Velox always requests the default level.

**Edge cases and quirks**

- The empty string reaches the dynamic-array empty-input boundary in `ZCompress`; production builds can produce a valid compressed empty payload, but range-check settings can affect element-zero address expressions.
- `TEncoding.Unicode.GetBytes` does not add a byte-order mark to the returned content.
- Supplementary characters use UTF-16 surrogate pairs. No Unicode normalisation is performed.
- The exposed function offers no compression-level parameter. The installed RTL also ignores the level argument inside `ZCompressStr`, although Velox passes only `zcDefault`.

**Side effects**

None outside memory allocation.

**Performance and concurrency**

The UTF-16 byte array, zlib result and working memory can coexist. The call is synchronous and uses local state.

**Related entries**

- [`ZLibDecompressString`](ZLibDecompressString.md) is the matching string inverse.
- [`ZLibCompress`](ZLibCompress.md) accepts an arbitrary byte representation.
- [`GZipCompressString`](GZipCompressString.md) uses gzip framing with the same text encoding.

**External references**

- [Embarcadero `System.ZLib.ZCompressStr`](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.ZLib.ZCompressStr)
- [Embarcadero `System.SysUtils.TEncoding.Unicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.Unicode)
- [Free Pascal `UnicodeString`](https://www.freepascal.org/docs-html/rtl/system/unicodestring.html) - compatibility context only; it does not specify Delphi's `TEncoding` call or zlib wrapper.

<small>Created 2026-07-15</small>
