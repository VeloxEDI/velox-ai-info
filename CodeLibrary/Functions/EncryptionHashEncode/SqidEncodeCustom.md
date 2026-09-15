---
title: "SqidEncodeCustom"
description: "Encodes a non-negative Int64 as a Sqid using a caller-supplied alphabet and minimum length."
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sqids
  - token
  - custom-alphabet
---

```Delphi
Function SqidEncodeCustom( const aValue : Int64; const aEncodeChars : string; aMinLength : integer) : string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Alphabet: String;
begin
  Alphabet := 'abcdefghijkmnopqrstuvwxyz23456789';
  Value := SqidEncodeCustom(1001, Alphabet, 8);
end;
```

### Usage

`SqidEncodeCustom` encodes a non-negative Int64 as a Sqid using a caller-supplied alphabet and minimum length.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Int64`, `const` | Non-negative value from `0` through `MaxInt64`. |
| `aEncodeChars` | `string`, `const` | Ordered alphabet. Empty selects the shipped 62-character mixed-case default; non-empty input is validated. |
| `aMinLength` | `integer` | Minimum output length from `0` through `255`; it is not an exact or maximum length. |

**Returns**

A non-empty token whose characters come from the effective alphabet and whose length is at least `aMinLength`. Decode it with [`SqidDecodeCustom`](SqidDecodeCustom.md) using the identical alphabet string.

**Behaviour**

- Alphabet content **and order** define the token mapping.
- `0` is supported; negative values are not.
- Tokens are case-sensitive whenever the alphabet contains case distinctions.
- Minimum length is a floor. Numeric magnitude and blocklist regeneration can produce longer text.
- The same complete configuration and shipped version produces deterministic output.

**Errors**

Invalid alphabet, exhausted blocklist regeneration and format conditions raise `ESqidsException`. Range-check, overflow, allocation and script conversion failures propagate. No fallback token is returned.

### Additional Technical Info
`SqidEncodeCustom` converts one non-negative `Int64` to a reversible Sqids token using a caller-owned ordered alphabet and minimum output length. A custom alphabet controls the available characters and mapping, but is not a secret or encryption key.

The example alphabet and value are fictional. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox passes the supplied alphabet and checked `Byte` minimum length to a new shipped `TSqids` object, converts `aValue` to the library's `UInt64`, and calls `EncodeSingle`. An empty alphabet is replaced by `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`. A non-empty alphabet is validated for length, ASCII, uniqueness and literal spaces, deterministically shuffled, and used to filter the shipped default blocklist. Encoding adds separators/padding and regenerates blocklisted results. The object is freed in `finally`.

**Edge cases and quirks**

- Empty `aEncodeChars` is accepted and selects the library's mixed-case default. It does not select Velox's uppercase or lowercase fixed wrapper alphabet.
- A non-empty alphabet must contain 3-255 unique characters, all with code points at or below 127, and cannot contain a literal space. Emoji and other non-ASCII characters fail construction.
- Only literal space is rejected as whitespace by the shipped check. Other unique ASCII control/whitespace characters can pass but should not be used in URLs, files, EDI values or logs.
- A numeric-only alphabet is permitted; resulting string tokens can begin with `0` and must not be coerced to a number.
- The default blocklist is filtered to words that can be formed from the effective alphabet. Changing the alphabet changes both encoding and which blocklist entries remain effective.
- A future blocklist update can change newly generated text for the same input. Exhausted regeneration attempts raise.
- Negative `aValue` or `aMinLength` outside `0..255` raises under the current checked conversions.
- A shuffled/custom alphabet may slow casual recognition but can be reverse-engineered. It is not confidentiality or access control.

**Side effects**

None beyond per-call alphabet/blocklist processing and temporary allocation.

**Performance and concurrency**

Each call validates/shuffles the alphabet and filters the default blocklist before encoding. Runtime is normally small but can include regeneration attempts and padding work. Instances are per-call and share no mutable state.

**Remarks**

Version the alphabet and preserve its exact order wherever tokens are durable or cross system boundaries. Keep tokens as strings. Apply normal authorisation to the decoded object; a custom alphabet is not a security boundary.

**Related entries**

- [`SqidDecodeCustom`](SqidDecodeCustom.md) reverses a token with the identical ordered alphabet.
- [`SqidEncode`](SqidEncode.md) uses Velox's fixed uppercase-and-digit alphabet.
- [`SqidEncodeLower`](SqidEncodeLower.md) uses Velox's fixed lowercase-and-digit alphabet.

**External references**

- [Sqids FAQ](https://sqids.org/faq) - official guidance on custom alphabets, padding, blocklists, reversibility and limitations.

<small>Created 2026-07-15</small>
