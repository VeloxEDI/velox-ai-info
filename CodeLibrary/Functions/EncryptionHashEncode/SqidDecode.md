---
title: "SqidDecode"
description: "Decodes one uppercase-and-digit Velox Sqid token to its Int64 value."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sqids
  - token
  - decode
---

```Delphi
Function SqidDecode( const aToken : string) : Int64
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Token: String;
begin
  Token := SqidEncode(1001, 8);
  Value := SqidDecode(Token); // 1001
end;
```

### Usage

`SqidDecode` decodes one uppercase-and-digit Velox Sqid token to its Int64 value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aToken` | `string`, `const` | Case-sensitive token to decode with the exact alphabet `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`. |

**Returns**

The single decoded value as `Int64`. Tokens created by [`SqidEncode`](SqidEncode.md) are limited to the supported non-negative `Int64` range and round-trip to that value.

**Behaviour**

- Alphabet order is part of the mapping. This function is paired with `SqidEncode`, not the lowercase, custom or library-default alphabet.
- Tokens are case-sensitive and this alphabet contains uppercase letters and digits only.
- Minimum-length padding added during encoding does not change the decoded value.
- Decoding is deterministic for a fixed Velox version and alphabet.

**Errors**

`ESqidsException`, range-check, overflow, allocation and script conversion errors propagate. The function does not return `-1`, `0` or an empty value to report invalid input.

**Usage notes**

Treat a decoded number as untrusted input until the surrounding business object, tenant, permissions and lifecycle have been validated. Persist which alphabet/configuration produced durable tokens; a different function will not decode them correctly.

### Additional Technical Info
`SqidDecode` reverses one token produced with Velox's uppercase-and-digit Sqids configuration and returns its original non-negative numeric value as `Int64`. Sqids make compact, random-looking identifiers; they are deliberately reversible and do not protect sensitive values.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox creates a shipped `TSqids` instance with the ordered 36-character alphabet `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`, minimum length zero and the shipped default blocklist. It calls `DecodeSingle(aToken)`, which runs the Sqids decoder and requires exactly one decoded number. The library produces `UInt64`; the wrapper converts it to `Int64`. The per-call object is freed in a `finally` block.

The decoder reverses the alphabet shuffling and separator structure encoded in the token. The blocklist participates in encoding but is not a token-validation list during decoding.

**Edge cases and quirks**

- Empty input, a character outside the alphabet, or a token that decodes to zero or multiple numbers causes `DecodeSingle` to raise; there is no invalid-token sentinel.
- A successful numeric decode does not prove that the text is the canonical token emitted by Velox. The Sqids format can ignore encoded padding/junk suffix structure, and arbitrary alphabet-valid text can sometimes decode to one number. Decode, re-encode with the intended minimum-length policy, and compare the exact token when canonical form matters.
- The decoder does not check the default blocklist. Blocklisted or non-canonical text can still decode.
- Very long or adversarial input can overflow the shipped `UInt64` arithmetic. A decoded value above `MaxInt64` can also fail at the wrapper's checked conversion.
- Tokens reveal a number to anyone with the algorithm and alphabet. They are not hashes, encryption, signatures, authentication or access control.

**Side effects**

None beyond temporary arrays and a per-call Sqids object.

**Performance and concurrency**

Work is primarily linear in token length, with per-call alphabet/blocklist setup and temporary arrays. Bound untrusted token lengths before decoding. Each call owns its Sqids instance, so independent calls share no mutable instance state.

**Related entries**

- [`SqidEncode`](SqidEncode.md) creates tokens for this exact uppercase-and-digit configuration.
- [`SqidDecodeLower`](SqidDecodeLower.md) uses a distinct lowercase-and-digit alphabet.
- [`SqidDecodeCustom`](SqidDecodeCustom.md) accepts a caller-supplied ordered alphabet.

**External references**

- [Sqids FAQ](https://sqids.org/faq) - official format guidance covering reversibility, non-negative numbers, alphabet/minimum-length limits and canonical validation.

<small>Created 2026-07-15</small>
