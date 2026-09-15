---
title: "SqidDecodeLower"
description: "Decodes one lowercase-and-digit Velox Sqid token to its Int64 value."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sqids
  - token
  - lowercase
---

```Delphi
Function SqidDecodeLower( const aToken : string) : Int64
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Token: String;
begin
  Token := SqidEncodeLower(1001, 8);
  Value := SqidDecodeLower(Token); // 1001
end;
```

### Usage

`SqidDecodeLower` decodes one lowercase-and-digit Velox Sqid token to its Int64 value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aToken` | `string`, `const` | Case-sensitive token to decode with the exact alphabet `abcdefghijklmnopqrstuvwxyz0123456789`. |

**Returns**

The single decoded value as `Int64`. A token created by [`SqidEncodeLower`](SqidEncodeLower.md) from a supported value round-trips to that value.

**Behaviour**

- Only the lowercase-and-digit alphabet, in this exact order, is used.
- Tokens are case-sensitive; uppercasing a token changes it or makes it invalid.
- Padding introduced by a minimum length does not change the decoded number.
- Decoding is deterministic for the Velox version and alphabet.

**Errors**

`ESqidsException`, range-check, overflow, allocation and script conversion failures propagate. Invalid input is not converted to zero or `-1`.

**Usage notes**

Use the lowercase encoder and decoder as a pair. Validate the decoded entity, tenant and caller permissions separately; a valid token is only a reversible representation.

### Additional Technical Info
`SqidDecodeLower` reverses one token created with Velox's lowercase-and-digit Sqids alphabet and returns its non-negative numeric value as `Int64`. It is useful where a transport requires lowercase identifiers. The token remains reversible and should not contain sensitive information.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox creates the shipped `TSqids` class with the ordered 36-character alphabet `abcdefghijklmnopqrstuvwxyz0123456789`, minimum length zero and the shipped default blocklist. It calls `DecodeSingle`, which requires the decoder to produce exactly one `UInt64`, converts the result to `Int64`, and frees the instance in a `finally` block.

**Edge cases and quirks**

- Empty text, an out-of-alphabet character, or a token yielding zero or multiple numbers causes an exception rather than a sentinel result.
- A numeric result does not prove that a token is the one canonical value emitted by the encoder. Decode/re-encode/compare exact text when canonical form matters.
- The blocklist is not a decode-time rejection list. Some non-canonical or blocklisted alphabet-valid strings can still decode.
- Long or adversarial input can overflow the port's `UInt64` calculation; a value above `MaxInt64` can fail the wrapper conversion.
- The output of the paired encoder is random-looking but exposes the number to any party using the same algorithm and alphabet.

**Side effects**

None beyond a per-call Sqids object and temporary arrays.

**Performance and concurrency**

Work scales mainly with token length, plus per-call alphabet/blocklist setup. Bound untrusted token lengths. Separate calls own separate instances and share no mutable instance state.

**Related entries**

- [`SqidEncodeLower`](SqidEncodeLower.md) produces tokens for this exact alphabet.
- [`SqidDecode`](SqidDecode.md) uses a distinct uppercase-and-digit alphabet.
- [`SqidDecodeCustom`](SqidDecodeCustom.md) accepts an explicitly versioned alphabet.

**External references**

- [Sqids FAQ](https://sqids.org/faq) - official guidance on case-sensitive alphabets, padding, reversibility and validation.

<small>Created 2026-07-15</small>
