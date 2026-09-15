---
title: "GZipCompressString"
description: "Encodes a Delphi Unicode string as UTF-16LE and returns gzip-compressed bytes."
sidebar_position: 3
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
Function GZipCompressString( const S : string) : TBytes
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Base64EncodeBytes(GZipCompressString('Fictional order 1001'));
end;
```

### Usage

`GZipCompressString` encodes a Velox Unicode string as UTF-16LE and returns gzip-compressed bytes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `String`, `const` | Text to encode and compress. Embedded null characters are encoded as ordinary UTF-16 code units. |

**Returns**

A gzip member containing the string's UTF-16LE bytes without a byte-order mark.

**Behaviour**

Round-trip with [`GZipDecompressString`](GZipDecompressString.md) preserves the Velox string when compression and decompression both succeed. A non-Velox consumer must explicitly decode the expanded payload as UTF-16LE; assuming UTF-8 produces incorrect text.

**Errors**

Encoding allocation failures and all `GZipCompress` errors propagate. The function provides no partial result.

**Usage notes**

Use this pair only for an interface that explicitly adopts Velox UTF-16LE string payloads. For UTF-8 or another wire encoding, encode the text through the appropriate Code Library function and call [`GZipCompress`](GZipCompress.md) on those bytes.

### Additional Technical Info
`GZipCompressString` converts a Delphi Unicode string to UTF-16 little-endian bytes and passes those bytes to Velox's custom [`GZipCompress`](GZipCompress.md) implementation. The result is a gzip member whose uncompressed payload is Delphi text encoding, not UTF-8.

The example produces a Base64 transport representation of the binary gzip result. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The directly registered `vxCompression.GZipCompressString` calls `TEncoding.Unicode.GetBytes(S)` and then `GZipCompress`. On Windows Delphi, `TEncoding.Unicode` is little-endian UTF-16. `GetBytes` returns encoded content; it does not prepend the encoding preamble.

**Edge cases and quirks**

- The empty string becomes an empty byte array and reaches `GZipCompress`'s empty-input defect. With current Velox range checking it raises a range-check exception rather than returning an empty gzip member.
- The function inherits `GZipCompress`'s incorrect output pointer if its buffer-growth branch is reached.
- Supplementary Unicode characters are encoded as UTF-16 surrogate pairs. Binary comparison with a UTF-8 gzip payload is not meaningful even when both expand to visually identical text.
- There is no encoding marker, content type, schema or normalisation step in the gzip member.

**Side effects**

None outside memory allocation.

**Performance and concurrency**

The UTF-16 byte array and gzip result coexist in memory, along with zlib state. The call is synchronous and uses local state.

**Related entries**

- [`GZipDecompressString`](GZipDecompressString.md) is the intended string inverse.
- [`GZipCompress`](GZipCompress.md) accepts arbitrary bytes.
- [`ZLibCompressString`](ZLibCompressString.md) uses the same text encoding with a zlib wrapper.

**External references**

- [Embarcadero `System.SysUtils.TEncoding.Unicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.Unicode)
- [Embarcadero `System.ZLib`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.ZLib)
- [Free Pascal `UnicodeString`](https://www.freepascal.org/docs-html/rtl/system/unicodestring.html) - language compatibility context only; it does not define Delphi `TEncoding.Unicode` or Velox's gzip wrapper.

<small>Created 2026-07-15</small>
