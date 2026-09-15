---
title: "MD5Hash"
description: "Returns a Base64-encoded MD5 digest of non-empty UTF-8 text."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - md5
  - hash
  - base64
---

```Delphi
Function MD5Hash( const Input : String) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := MD5Hash('fictional integration payload');
  // Non-empty input produces a 24-character padded Base64 value.
end;
```

### Usage

`MD5Hash` returns a Base64-encoded MD5 digest of non-empty UTF-8 text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Input` | `String`, `const` | Text to hash. Non-empty text is encoded as UTF-8 without Unicode normalisation. |

**Returns**

For non-empty input, a 24-character standard Base64 representation of the 16-byte MD5 digest, including `==` padding. Empty input returns `''` instead of the Base64 form of the standard empty-byte MD5 digest.

**Behaviour**

- Equal strings with identical code-point sequences produce equal results.
- Output uses the standard Base64 alphabet `A-Z`, `a-z`, `0-9`, `+`, `/`, with `=` padding and no line wrapping.
- The hash is deterministic, unkeyed and unsalted.
- The return value represents digest bytes directly. It is not Base64 of hexadecimal text.

**Errors**

Encoding, allocation or hashing failures propagate to the script. The function has no separate error return.

**Usage notes**

Store the algorithm, UTF-8 input contract and Base64 representation alongside persistent values. Use a modern keyed construction when authenticity is required. Use [`MD5HashHex`](MD5HashHex.md) only when the receiving interface requires hexadecimal rather than Base64.

### Additional Technical Info
`MD5Hash` converts a Delphi string to UTF-8, calculates its 16-byte MD5 digest and returns that digest as padded standard Base64. It exists for compatibility with integrations that specify this exact algorithm, input encoding and representation.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The Velox wrapper first initialises the result to an empty string and exits immediately when `Input = ''`. Otherwise it calls the installed Delphi 37.0 string overload `System.Hash.THashMD5.GetHashBytes`. That record creates an MD5 state, converts the string with `TEncoding.UTF8.GetBytes`, updates and finalises the state, and returns 16 bytes. Velox then passes those bytes to [`Base64EncodeBytes`](Base64EncodeBytes.md), which uses an unwrapped `TBase64Encoding(0)`.

**Edge cases and quirks**

- Empty input is a Velox shortcut and returns `''`. A system that hashes an empty byte sequence normally will produce a non-empty 24-character Base64 value, so callers must align this special case explicitly.
- MD5 is collision-broken. Do not use it for signatures, password storage, tamper resistance, authentication or security-sensitive uniqueness.
- UTF-8 makes this result different from MD5 over ANSI, UTF-16 or Free Pascal `RawByteString` bytes for non-ASCII text.
- Unicode normalisation is not applied. Visually identical composed and decomposed strings can hash differently.
- Base64 is only a representation of the digest; it does not strengthen or encrypt MD5.

**Side effects**

None beyond temporary managed memory.

**Performance and concurrency**

Work is linear in the UTF-8 byte length. The complete UTF-8 input and Base64 result are allocated in memory. Hash state and encoder instances are local to the call, so independent calls do not share mutable hash state.

**Related entries**

- [`MD5HashHex`](MD5HashHex.md) uses the same UTF-8/MD5 algorithm with lowercase hexadecimal output.
- [`MD5HashStream`](MD5HashStream.md) hashes exact stream bytes through shipped Indy and returns uppercase hexadecimal.
- [`SHA1Hash`](SHA1Hash.md) is the analogous legacy SHA-1/Base64 helper.
- [`HashString`](HashString.md) returns an unkeyed SHA-384 text fingerprint.

**External references**

- [Embarcadero DocWiki: `THashMD5.GetHashBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Hash.THashMD5.GetHashBytes) - the exact Delphi core terminal overload family used before Velox formats the digest as Base64.
- [Free Pascal: `MD5String`](https://www.freepascal.org/daily/packages/hash/md5/md5string.html) - analogous MD5 string input for compatibility comparison; it accepts `RawByteString`, not Velox's Delphi UTF-8 conversion contract.

<small>Created 2026-07-15</small>
