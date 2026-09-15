---
title: "SHA1Hash"
description: "Returns a Base64-encoded SHA-1 digest of non-empty UTF-8 text."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sha-1
  - hash
  - base64
---

```Delphi
Function SHA1Hash( const Input : String) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := SHA1Hash('fictional integration payload');
  // Non-empty input produces a 28-character padded Base64 value.
end;
```

### Usage

`SHA1Hash` returns a Base64-encoded SHA-1 digest of non-empty UTF-8 text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Input` | `String`, `const` | Text to hash. Non-empty text is encoded as UTF-8 without Unicode normalisation. |

**Returns**

For non-empty input, a 28-character standard Base64 representation of the 20-byte SHA-1 digest, including one `=` padding character. Empty input returns `''` instead of the Base64 form of the standard empty-byte SHA-1 digest.

**Behaviour**

- Identical Unicode code-point sequences produce identical output.
- The result is deterministic, unsalted and unkeyed.
- Output uses standard Base64 with `+`, `/`, padding and no line wrapping.
- The encoded value represents raw digest bytes, not hexadecimal text.

**Errors**

Encoding, allocation or hashing failures propagate. The function has no separate error indicator.

**Usage notes**

Use only when an external protocol requires SHA-1 with this UTF-8/Base64 contract. Persist the algorithm and representation with stored values. For keyed authenticity, use an approved HMAC protocol with a strong secret and verification process.

### Additional Technical Info
`SHA1Hash` converts a string to UTF-8, calculates its 20-byte SHA-1 digest and returns the digest bytes as padded standard Base64. It is a legacy compatibility helper, not a current security primitive.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The Velox wrapper initialises an empty result and exits when `Input = ''`. Otherwise it calls the installed Delphi 37.0 string overload `System.Hash.THashSHA1.GetHashBytes`. Delphi initialises a SHA-1 record, converts the string with `TEncoding.UTF8.GetBytes`, updates and finalises it, and returns 20 bytes. Velox formats those bytes through [`Base64EncodeBytes`](Base64EncodeBytes.md), using unwrapped standard Base64.

**Edge cases and quirks**

- Empty input returns `''` because Velox bypasses the Delphi terminal. That differs from normal SHA-1 of an empty byte sequence.
- SHA-1 has practical collision attacks. Do not use it for signatures, certificates, password storage, tamper resistance or security-sensitive identity.
- UTF-8 input differs from ANSI, UTF-16 and Free Pascal `RawByteString` byte contracts for non-ASCII text.
- Unicode normalisation is not performed; visually identical strings can hash differently.
- Base64 changes only the representation and does not repair SHA-1's security weaknesses.

**Side effects**

None beyond temporary managed memory.

**Performance and concurrency**

Work and temporary UTF-8 storage are linear in input size. Hash state and Base64 encoder instances are local to the call, so independent calls do not share mutable hash state.

**Related entries**

- [`SHA1HashHex`](SHA1HashHex.md) returns the same SHA-1 digest as lowercase hexadecimal.
- [`MD5Hash`](MD5Hash.md) is the analogous MD5/Base64 compatibility helper.
- [`HashString`](HashString.md) returns a SHA-384 text fingerprint.
- [`HMACSHA256`](HMACSHA256.md) calculates a keyed SHA-256 MAC.

**External references**

- [Embarcadero DocWiki: `THashSHA1.GetHashBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Hash.THashSHA1.GetHashBytes) - the exact Delphi core terminal overload family used before Velox Base64 formatting.
- [Free Pascal: `SHA1String`](https://www.freepascal.org/daily/packages/hash/sha1/sha1string.html) - analogous SHA-1 digest creation from `RawByteString` bytes, not Velox's UTF-8 conversion contract.

<small>Created 2026-07-15</small>
