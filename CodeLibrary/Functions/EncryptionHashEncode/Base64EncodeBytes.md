---
title: "Base64EncodeBytes"
description: "Encodes an exact byte array as unwrapped standard Base64 text."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - base64
  - encoding
  - bytes
---

```Delphi
Function Base64EncodeBytes( Value : TBytes) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Bytes: TBytes;
begin
  SetLength(Bytes, 3);
  Bytes[0] := 1;
  Bytes[1] := 2;
  Bytes[2] := 3;
  Value := Base64EncodeBytes(Bytes);  // AQID
end;
```

### Usage

`Base64EncodeBytes` encodes an exact byte array as unwrapped standard Base64 text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Value` | `TBytes` | Bytes to encode. The declaration passes the dynamic-array reference by value; the helper does not modify its elements. |

**Returns**

Unwrapped standard Base64 text with `=` padding when required. A zero-length array returns an empty string.

**Behaviour**

- Every source byte, including zero bytes, participates in the encoded value.
- Output uses the standard `+` and `/` alphabet and conventional `=` padding.
- No text encoding, Unicode normalisation or line wrapping occurs.
- The source array remains unchanged.

**Important usage notes**

- This is not URL-safe Base64 and does not remove padding.
- A dynamic array is reference-counted. Although the function declaration is by value, Velox only reads it; the caller should still avoid mutating the same array concurrently.
- Base64 is reversible and does not detect modification. Add a suitable MAC or signature when integrity or authenticity is required.

**Usage notes**

Use this function for binary values already held in memory. Use [`Base64EncodeFile`](Base64EncodeFile.md) for a file path, while noting that the file helper also reads the whole file into memory.

### Additional Technical Info
`Base64EncodeBytes` converts the exact contents of a `TBytes` array to standard Base64 text. It performs no character-set conversion and inserts no line breaks.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox creates `TBase64Encoding` with line length `0`, calls Delphi's `EncodeBytesToString`, and frees the encoder in a `finally` block.

**Side effects**

None beyond temporary allocation.

**Errors**

Memory-allocation and underlying Delphi exceptions propagate to the script.

**Performance and concurrency**

The entire output is built in memory and is approximately four characters for every three input bytes, plus padding. Each call owns a separate encoder; independent arrays can be encoded concurrently.

**Related entries**

- [`Base64DecodeBytes`](Base64DecodeBytes.md) performs the reverse operation.
- [`Base64Encode`](Base64Encode.md) first converts a string to UTF-8.
- [`HMACSHA256`](HMACSHA256.md) uses this helper to format its 32-byte MAC.

**External references**

- [Embarcadero DocWiki: `TNetEncoding.EncodeBytesToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.NetEncoding.TNetEncoding.EncodeBytesToString) - the exact Delphi operation called by the wrapper.
- [Free Pascal: `EncodeStringBase64`](https://www.freepascal.org/docs-html/fcl/base64/encodestringbase64.html) - related Free Pascal Base64 encoding documentation.

<small>Created 2026-07-15</small>
