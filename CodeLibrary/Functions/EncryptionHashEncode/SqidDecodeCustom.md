---
title: "SqidDecodeCustom"
description: "Decodes one Velox Sqid token using a caller-supplied alphabet."
sidebar_position: 20
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
Function SqidDecodeCustom( const aToken : string; const aEncodeChars : string) : Int64
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Alphabet: String;
  Token: String;
begin
  Alphabet := 'abcdefghijkmnopqrstuvwxyz23456789';
  Token := SqidEncodeCustom(1001, Alphabet, 8);
  Value := SqidDecodeCustom(Token, Alphabet); // 1001
end;
```

### Usage

`SqidDecodeCustom` decodes one Velox Sqid token using a caller-supplied alphabet.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aToken` | `string`, `const` | Case-sensitive token to decode. Every significant character must occur in the effective alphabet. |
| `aEncodeChars` | `string`, `const` | Ordered alphabet used during encoding. Empty selects the shipped library's mixed-case default; non-empty alphabets are validated by the shipped port. |

**Returns**

The one decoded value as `Int64`. A valid round-trip token produced by [`SqidEncodeCustom`](SqidEncodeCustom.md) for a supported value returns that original value.

**Behaviour**

- Alphabet order, not only the character set, determines the mapping.
- Decoding is case-sensitive.
- Minimum length is encoded in the token structure, so the decoder does not need the original `aMinLength` argument.
- The default blocklist affects which token an encoder emits but is not enforced as a decode-time validity check.

**Errors**

Alphabet validation and token errors raise `ESqidsException`. Range-check, overflow, allocation and script conversion failures also propagate. No sentinel is returned.

**Usage notes**

Treat the alphabet as versioned integration configuration. Changing its content or order makes existing tokens decode differently or fail. Validate the decoded business entity and caller permissions independently of the token format.

### Additional Technical Info
`SqidDecodeCustom` decodes one Sqids token with an explicitly ordered alphabet and returns its value as `Int64`. The alphabet must match encoding exactly, including order and case. This lets an integration own its visible character set, but it does not make the numeric value secret.

The example alphabet and value are fictional. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox constructs the shipped `TSqids` class with `aEncodeChars`, minimum length zero and the default blocklist, then calls `DecodeSingle`. The constructor substitutes `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789` when the alphabet string is empty. It otherwise validates and deterministically shuffles the supplied alphabet, filters the shipped blocklist to usable words, and prepares the decoder. `DecodeSingle` requires one decoded `UInt64`; Velox converts it to `Int64`. The object is freed in `finally`.

**Edge cases and quirks**

- **Empty alphabet is not invalid.** It silently selects the library's 62-character mixed-case default. That differs from both [`SqidEncode`](SqidEncode.md) and [`SqidEncodeLower`](SqidEncodeLower.md).
- A non-empty alphabet must contain 3-255 unique single-byte ASCII characters, cannot contain a literal space and cannot contain characters with code points above 127. Emoji and other multibyte characters are rejected.
- The shipped validation rejects literal space but can accept other ASCII whitespace/control characters if they are unique. Avoid these even though they can pass construction; they make tokens unsafe for logs and transports.
- Empty/invalid tokens, alphabet mismatch, or a token decoding to anything other than one number raises.
- Successful decode is not canonical validation. Re-encode with the exact same alphabet and minimum-length policy and compare the exact text if canonical form matters.
- Arbitrary or long tokens can overflow `UInt64` arithmetic; results above `MaxInt64` can fail the checked return conversion.
- A custom or shuffled alphabet is obfuscation only. It can be reverse-engineered and must not protect sensitive identifiers.

**Side effects**

None beyond per-call alphabet/blocklist preparation and temporary arrays.

**Performance and concurrency**

Construction validates/shuffles the alphabet and filters the default blocklist on every call; decoding then scales mainly with token length. Cache is not exposed by this wrapper. Bound untrusted inputs. Each call owns its object and has no shared mutable instance state.

**Related entries**

- [`SqidEncodeCustom`](SqidEncodeCustom.md) creates tokens using the same alphabet and default blocklist.
- [`SqidDecode`](SqidDecode.md) uses Velox's fixed uppercase-and-digit alphabet.
- [`SqidDecodeLower`](SqidDecodeLower.md) uses Velox's fixed lowercase-and-digit alphabet.

**External references**

- [Sqids FAQ](https://sqids.org/faq) - official guidance on custom alphabets, reversibility, limitations and canonical-token checks.

<small>Created 2026-07-15</small>
