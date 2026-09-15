---
title: "SqidEncode"
description: "Encodes a non-negative Int64 as an uppercase-and-digit Sqid with a minimum length."
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sqids
  - token
  - encode
---

```Delphi
Function SqidEncode( const aValue : Int64; aMinLength : integer) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := SqidEncode(1001, 8);
  // Value contains uppercase letters/digits and is at least 8 characters.
end;
```

### Usage

`SqidEncode` encodes a non-negative Int64 as an uppercase-and-digit Sqid with a minimum length.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Int64`, `const` | Non-negative value from `0` through `MaxInt64` to encode. |
| `aMinLength` | `integer` | Minimum output length from `0` through `255`. Larger values can still require longer output. |

**Returns**

A non-empty token containing only uppercase `A-Z` and digits `0-9`, with length at least `aMinLength`. [`SqidDecode`](SqidDecode.md) reverses a valid token to `aValue`.

**Behaviour**

- For the same value, minimum length, Velox version, alphabet and blocklist, output is deterministic.
- `0` is a supported value.
- The alphabet is case-sensitive and deliberately omits lowercase characters.
- Padding guarantees only a minimum length. It does not change the decoded value.
- the function exposes one number even though the shipped library can encode arrays of unsigned numbers.

**Errors**

Range-check and conversion failures, `ESqidsException` from regeneration, allocation failures and script/runtime errors propagate. There is no fallback token.

**Usage notes**

Use for compact public-facing identifiers only after applying normal object-level authorisation. Persist the configuration/version if tokens are durable. Do not assume random-looking text is secret or unguessable.

### Additional Technical Info
`SqidEncode` converts one non-negative `Int64` to a short, reversible identifier using Velox's fixed uppercase-and-digit Sqids alphabet. `aMinLength` can make small values less visibly short, but it is a lower bound rather than an exact or maximum length.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox converts the signed value to the shipped Sqids `UInt64` input and the minimum length to the constructor's `Byte`. It creates `TSqids` with the ordered alphabet `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`, the requested minimum and the shipped default blocklist, then calls `EncodeSingle`. The library deterministically shuffles alphabets, encodes the number, adds separator/padding characters when required and regenerates a token when the default blocklist matches. The object is freed in `finally`.

**Edge cases and quirks**

- Negative values are outside the Sqids contract. With the current project range checking, conversion to `UInt64` raises rather than producing a supported token.
- `aMinLength` outside `0..255` cannot be represented by the shipped `Byte` parameter and raises under the current checked build.
- Output can be longer than the requested minimum because of the numeric magnitude, alphabet mechanics or blocklist regeneration.
- A future shipped default-blocklist change can cause the same value/configuration to receive a different newly encoded token. Existing tokens generally remain decodable, but exact regenerated-text comparisons can change across upgrades.
- If every allowed regeneration attempt is blocked, the library raises instead of returning a token.
- Sqids are reversible and not cryptographic. They do not hide sequence size, establish authenticity or authorise access.

**Side effects**

None beyond per-call object and temporary-array allocation.

**Performance and concurrency**

Encoding work is small for ordinary values but includes alphabet/blocklist setup on every call and can repeat when blocklist matches occur. Requested padding increases output and temporary work. Each call owns its Sqids object and shares no mutable instance state.

**Related entries**

- [`SqidDecode`](SqidDecode.md) decodes this exact uppercase-and-digit configuration.
- [`SqidEncodeLower`](SqidEncodeLower.md) emits lowercase-and-digit tokens.
- [`SqidEncodeCustom`](SqidEncodeCustom.md) accepts an explicitly ordered alphabet.

**External references**

- [Sqids FAQ](https://sqids.org/faq) - official guidance on intended uses, reversibility, non-negative values, padding and blocklists.

<small>Created 2026-07-15</small>
