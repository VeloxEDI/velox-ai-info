---
title: "Base64Encode"
description: "Encodes a Delphi string as unwrapped standard Base64 using UTF-8 bytes."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - base64
  - encoding
  - utf-8
---

```Delphi
Function Base64Encode( const Value : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Base64Encode('Velox');  // VmVsb3g=
end;
```

### Usage

`Base64Encode` encodes a Velox string as unwrapped standard Base64 using UTF-8 bytes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Value` | `string`, `const` | Text to encode. It is converted to UTF-8 before Base64 encoding. |

**Returns**

Unwrapped standard Base64 text. Empty input returns an empty string.

**Behaviour**

- Output uses the standard Base64 alphabet (`A-Z`, `a-z`, `0-9`, `+` and `/`).
- `=` padding is included when required.
- No CR, LF or other line wrapping is inserted because the encoding object is constructed with line length `0`.
- Unicode text is encoded through UTF-8, making the byte representation independent of the Windows ANSI code page.

**Important usage notes**

- The output is standard Base64, not URL-safe Base64. If a protocol requires the URL-safe alphabet or omitted padding, transform it according to that protocol rather than assuming this helper supplies it.
- Visually identical Unicode strings with different normalisation forms produce different bytes and therefore different Base64 text. Velox performs no Unicode normalisation.
- Base64 increases size and is readily reversible; it is not encryption or a secure way to hide credentials.

**Usage notes**

Use the byte-array overload when the input is already binary. Avoid converting binary data to a string merely to call this function, because text encoding can change the data.

### Additional Technical Info
`Base64Encode` converts a Delphi string to UTF-8 bytes and returns those bytes as standard Base64 text. The output contains no inserted line breaks.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The Velox wrapper creates `TBase64Encoding` with line length `0`, calls its string `Encode` method, and frees the object in a `finally` block. Delphi's string overload uses UTF-8 for the source text.

**Side effects**

None beyond temporary allocation.

**Errors**

Allocation and underlying Delphi encoding exceptions are not caught by the wrapper and propagate to the script.

**Performance and concurrency**

The UTF-8 byte representation and Base64 result are materialised in memory. Work and allocation are proportional to the input size. Each call owns its encoder and has no Velox shared mutable state.

**Related entries**

- [`Base64Decode`](Base64Decode.md) decodes Base64 and interprets the bytes as UTF-8.
- [`Base64EncodeBytes`](Base64EncodeBytes.md) encodes exact binary bytes.
- [`Base64EncodeFile`](Base64EncodeFile.md) reads and encodes a complete file.

**External references**

- [Embarcadero DocWiki: `TNetEncoding.Encode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.NetEncoding.TNetEncoding.Encode) - the Delphi string encoding overload family beneath this helper.
- [Free Pascal: `EncodeStringBase64`](https://www.freepascal.org/docs-html/fcl/base64/encodestringbase64.html) - cross-compiler compatibility reference for Base64 string encoding.

<small>Created 2026-07-15</small>
