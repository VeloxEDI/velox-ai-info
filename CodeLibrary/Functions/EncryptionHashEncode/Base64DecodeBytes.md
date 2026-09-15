---
title: "Base64DecodeBytes"
description: "Decodes standard Base64 text to its exact binary byte sequence."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - base64
  - decoding
  - bytes
---

```Delphi
Function Base64DecodeBytes( const Value : string) : TBytes
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Decoded: TBytes;
begin
  Decoded := Base64DecodeBytes('AQID');
  Value := Length(Decoded);  // 3
end;
```

### Usage

`Base64DecodeBytes` decodes standard Base64 text to its exact binary byte sequence.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Value` | `string`, `const` | Standard Base64 text to decode. Velox does not trim or normalise it first. |

**Returns**

A dynamic byte array containing the decoded binary value. Empty input produces a zero-length byte array.

**Behaviour**

- The expected alphabet is standard Base64 (`A-Z`, `a-z`, `0-9`, `+` and `/`) with optional `=` padding.
- Whitespace and other characters outside that alphabet are skipped by the Velox decoder.
- Every decoded byte, including zero bytes, is retained in the returned `TBytes` value.
- Velox does not inspect the file type, text encoding or structure of the result.

**Errors**

Do not expect malformed text to raise an exception consistently. Allocation and Velox exceptions are not caught and propagate to the script.

### Additional Technical Info
`Base64DecodeBytes` decodes standard Base64 text to a `TBytes` value without interpreting the result as text. It is the appropriate Base64 decoder for binary payloads, file content and data whose character encoding is unknown.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The Velox wrapper creates a new Delphi `TBase64Encoding` with line length `0`, calls `DecodeStringToBytes`, and frees the encoder in a `finally` block. No character-set conversion is applied to the decoded bytes.

**Edge cases and quirks**

- The decoder is deliberately permissive rather than a strict Base64 validator. It can ignore invalid characters and decode a final two- or three-symbol fragment, so malformed or truncated input may return partial bytes.
- URL-safe Base64 is not translated. Its `-` and `_` symbols are skipped, which may silently produce the wrong bytes.
- An empty array is a valid result and is indistinguishable from decoding an empty input unless the caller also validates the source.
- Base64 provides neither confidentiality nor integrity.

**Side effects**

None beyond temporary allocation. The helper performs no file or network I/O.

**Performance and concurrency**

Memory use is proportional to the supplied text and decoded result. A fresh encoder is used for every call, with no Velox shared mutable state.

**Remarks**

Apply independent length, format or cryptographic-integrity checks when the decoded bytes cross a trust boundary. Successful decoding means only that some bytes could be reconstructed.

**Related entries**

- [`Base64Decode`](Base64Decode.md) converts decoded bytes to UTF-8 text.
- [`Base64EncodeBytes`](Base64EncodeBytes.md) performs the reverse byte-array encoding.
- [`Base64DecodeFile`](Base64DecodeFile.md) writes decoded bytes directly to a named file.

**External references**

- [Embarcadero DocWiki: `TNetEncoding.DecodeStringToBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.NetEncoding.TNetEncoding.DecodeStringToBytes) - the exact Delphi core operation called by the wrapper.
- [Free Pascal: `DecodeStringBase64`](https://www.freepascal.org/docs-html/fcl/base64/decodestringbase64.html) - related cross-compiler Base64 decoding documentation; its detailed acceptance rules may differ.

<small>Created 2026-07-15</small>
