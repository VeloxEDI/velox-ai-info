---
title: "Base64Decode"
description: "Decodes standard Base64 text and interprets the resulting bytes as UTF-8 text."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - base64
  - decoding
  - utf-8
---

```Delphi
Function Base64Decode( const Value : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Base64Decode('VmVsb3g=');  // Velox
end;
```

### Usage

`Base64Decode` decodes standard Base64 text and interprets the resulting bytes as UTF-8 text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Value` | `string`, `const` | Standard Base64 text to decode. Velox does not trim or normalise it first. |

**Returns**

The decoded bytes interpreted as UTF-8 text. An empty input returns an empty string.

**Behaviour**

- Encoding uses the standard Base64 alphabet (`A-Z`, `a-z`, `0-9`, `+` and `/`) with `=` padding.
- The decoder accepts unwrapped text and also skips line breaks, spaces and other characters that are not in the standard alphabet.
- The result is text, not a textual representation of the decoded bytes.
- Velox performs no character-set detection, decompression or decryption after decoding.

**Errors**

The permissive decoder does not reliably reject malformed Base64. Allocation and Velox conversion exceptions are not caught by the Velox function and propagate to the script.

**Usage notes**

Do not use successful decoding as proof that input was well formed. If strict validation is required, validate the alphabet, padding and expected decoded length separately before accepting the result.

### Additional Technical Info
`Base64Decode` decodes a standard Base64 string and converts the decoded bytes to a Delphi string using UTF-8. Use [`Base64DecodeBytes`](Base64DecodeBytes.md) instead when the encoded value represents a binary file or bytes that are not UTF-8 text.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The scripting import calls the Velox `Base64Decode` wrapper. Each call creates Delphi's `TBase64Encoding` with a line length of `0`, calls its string `Decode` method, and frees the encoder in a `finally` block. The Delphi string overload decodes Base64 to bytes and converts those bytes with UTF-8.

**Edge cases and quirks**

- Delphi's installed decoder is permissive. It skips invalid characters and padding while collecting valid symbols, and accepts a final group containing only two or three valid symbols. Malformed or truncated input can therefore produce a partial result instead of raising an error.
- URL-safe Base64 uses `-` and `_` in place of `+` and `/`. Those URL-safe characters are not translated; they are skipped as invalid characters and can silently corrupt the result.
- If the decoded byte sequence is not valid UTF-8, the observed text follows the installed Delphi UTF-8 conversion behaviour. Use the byte-returning helper when exact binary preservation matters.
- Base64 is reversible encoding, not encryption, authentication or validation.

**Side effects**

None beyond temporary allocation. The input is not modified and no external I/O occurs.

**Performance and concurrency**

Each call creates a new encoder and allocates storage proportional to the input and decoded result. The wrapper has no Velox shared mutable state and is suitable for independent concurrent calls.

**Related entries**

- [`Base64DecodeBytes`](Base64DecodeBytes.md) preserves decoded binary bytes.
- [`Base64Encode`](Base64Encode.md) encodes UTF-8 text.
- [`GetBasicAuthUser`](GetBasicAuthUser.md) uses this helper while extracting a Basic-authentication user name.

**External references**

- [Embarcadero DocWiki: `TNetEncoding.Decode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.NetEncoding.TNetEncoding.Decode) - the Delphi decode overload family used beneath this wrapper.
- [Free Pascal: `DecodeStringBase64`](https://www.freepascal.org/docs-html/fcl/base64/decodestringbase64.html) - compatibility reference for decoding a Base64 string; Free Pascal is not the implementation used by Velox.

<small>Created 2026-07-15</small>
