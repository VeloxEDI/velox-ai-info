---
title: "SqidEncodeLower"
description: "Encodes a non-negative Int64 as a lowercase-and-digit Sqid with a minimum length."
sidebar_position: 24
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
Function SqidEncodeLower( const aValue : Int64; aMinLength : integer) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := SqidEncodeLower(1001, 8);
  // Value contains lowercase letters/digits and is at least 8 characters.
end;
```

### Usage

`SqidEncodeLower` encodes a non-negative Int64 as a lowercase-and-digit Sqid with a minimum length.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Int64`, `const` | Non-negative value from `0` through `MaxInt64`. |
| `aMinLength` | `integer` | Minimum output length from `0` through `255`; not an exact or maximum length. |

**Returns**

A non-empty token containing only lowercase `a-z` and digits `0-9`, with length at least `aMinLength`. [`SqidDecodeLower`](SqidDecodeLower.md) reverses it to the original supported value.

**Behaviour**

- `0` is supported.
- Output is case-sensitive even though it contains no uppercase letters; altering character case makes a token invalid for the paired decoder.
- For a fixed value, minimum, Velox version and blocklist, output is deterministic.
- Minimum length is a lower bound and padding does not affect the decoded value.
- Only one signed Velox value is exposed; the multiple-`UInt64` API is not available in scripts.

**Errors**

Range-check/conversion failures, `ESqidsException`, allocation errors and script/runtime errors propagate. No fallback token is returned.

**Usage notes**

Use the lowercase encoder and decoder as a versioned pair. Check permissions on the decoded business object; do not treat possession of a token as authority.

### Additional Technical Info
`SqidEncodeLower` converts one non-negative `Int64` to a compact reversible identifier using Velox's fixed lowercase-and-digit Sqids alphabet. It is the fixed-alphabet option for transports that normalise or require lowercase values.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox converts the signed value to the shipped library's `UInt64` and the minimum length to `Byte`, constructs `TSqids` with `abcdefghijklmnopqrstuvwxyz0123456789` and the shipped default blocklist, and calls `EncodeSingle`. The library shuffles the alphabet deterministically, encodes the number, pads to the requested minimum when needed and regenerates blocklisted text. The per-call object is freed in a `finally` block.

**Edge cases and quirks**

- Negative input is unsupported and raises under the current checked conversion to `UInt64`.
- Minimum length outside `0..255` raises when converted to the shipped constructor's `Byte`.
- Output can exceed the requested minimum for large values or due to Sqids structure/blocklist regeneration.
- Changes to the shipped default blocklist can change newly generated tokens for the same value; exhausted regeneration attempts raise.
- Lowercase-only text can still be changed by external systems that trim, truncate or treat identifiers numerically. Store and compare it as an exact string.
- The result is reversible obfuscation, not encryption, a hash, authentication or authorisation.

**Side effects**

None beyond per-call object and temporary-array allocation.

**Performance and concurrency**

Ordinary encoding is small, with per-call alphabet/blocklist setup plus possible padding and regeneration. Each call owns its Sqids instance, so independent calls share no mutable instance state.

**Related entries**

- [`SqidDecodeLower`](SqidDecodeLower.md) decodes this exact configuration.
- [`SqidEncode`](SqidEncode.md) emits uppercase-and-digit tokens.
- [`SqidEncodeCustom`](SqidEncodeCustom.md) accepts an explicitly ordered alphabet.

**External references**

- [Sqids FAQ](https://sqids.org/faq) - official guidance on intended use, non-negative values, minimum length, blocklists and reversibility.

<small>Created 2026-07-15</small>
