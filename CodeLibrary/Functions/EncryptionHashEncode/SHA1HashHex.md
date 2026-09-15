---
title: "SHA1HashHex"
description: "Returns a hexadecimal SHA-1 digest of non-empty UTF-8 text."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sha-1
  - hash
  - hexadecimal
---

```Delphi
Function SHA1HashHex( const Input : String) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := SHA1HashHex('fictional integration payload');
  // Non-empty input produces 40 lowercase hexadecimal characters.
end;
```

### Usage

`SHA1HashHex` returns a hexadecimal SHA-1 digest of non-empty UTF-8 text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Input` | `String`, `const` | Text to hash. Non-empty input is converted to UTF-8 without trimming or Unicode normalisation. |

**Returns**

For non-empty input, 40 lowercase hexadecimal characters using `0-9` and `a-f`. Empty input returns `''`, not the standard SHA-1 text for an empty byte sequence.

**Behaviour**

- Output is deterministic, unkeyed and unsalted.
- The helper hashes UTF-8 text, not arbitrary bytes or file content.
- Alphabetic hexadecimal digits are lowercase and no prefix or separators are included.
- Exact code-point sequences matter; whitespace and casing are not normalised.

**Errors**

UTF-8 conversion, allocation and hash failures propagate. There is no error flag or fallback value beyond the deliberate empty-input result.

**Usage notes**

When a stored or exchanged value must remain interoperable, specify `SHA-1`, UTF-8 and lowercase hexadecimal together. Do not infer authenticity merely because a supplied hash matches.

### Additional Technical Info
`SHA1HashHex` calculates SHA-1 over a string's UTF-8 bytes and returns the 20-byte digest as 40 lowercase hexadecimal characters. It is retained for interfaces that explicitly require the legacy SHA-1 representation.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox exits with an empty result when `Input = ''`. Otherwise it calls the installed Delphi 37.0 string overload `System.Hash.THashSHA1.GetHashString`. Delphi initialises a SHA-1 state, passes it the result of `TEncoding.UTF8.GetBytes(Input)`, finalises the 20-byte digest and converts each nibble through `THash.DigestAsString` using lowercase hexadecimal digits.

**Edge cases and quirks**

- Empty input returns `''` because of the Velox wrapper, although the Delphi terminal can calculate the standard empty-byte digest.
- SHA-1 is collision-broken and unsuitable for adversarial integrity, signatures, password storage, authentication or new security protocols.
- Free Pascal `SHA1String` accepts `RawByteString`; callers must not assume its byte encoding matches Velox UTF-8 for non-ASCII input.
- Unicode normalisation is not applied, so visually identical text can have different hashes.
- Ordinary string comparison is not documented as constant-time.

**Side effects**

None beyond temporary managed memory.

**Performance and concurrency**

Time and temporary UTF-8 storage are linear in input size. Each invocation owns its SHA-1 record, so independent calls do not share mutable hash state.

**Related entries**

- [`SHA1Hash`](SHA1Hash.md) returns the same digest bytes as padded Base64.
- [`MD5HashHex`](MD5HashHex.md) is the analogous legacy MD5 helper.
- [`HashString`](HashString.md) returns an unkeyed SHA-384 fingerprint.
- [`HMACSHA256Hex`](HMACSHA256Hex.md) returns a keyed SHA-256 MAC as uppercase hexadecimal.

**External references**

- [Embarcadero DocWiki: `THashSHA1.GetHashString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Hash.THashSHA1.GetHashString) - the exact Delphi core terminal overload family reached by Velox.
- [Free Pascal: `SHA1String`](https://www.freepascal.org/daily/packages/hash/sha1/sha1string.html) - analogous SHA-1 digest creation from `RawByteString` bytes.
- [Free Pascal: `SHA1Print`](https://www.freepascal.org/daily/packages/hash/sha1/sha1print.html) - analogous conversion of a SHA-1 digest to text.

<small>Created 2026-07-15</small>
