---
title: "HashString"
description: "Returns an uppercase SHA-384 hexadecimal digest for non-empty UTF-8 text and an empty result for empty input."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - hash
  - sha-384
  - hexadecimal
---

```Delphi
Function HashString( aPlaintext : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := HashString('fictional integration payload');
  // Value is a 96-character uppercase hexadecimal SHA-384 digest.
end;
```

### Usage

`HashString` returns an uppercase SHA-384 hexadecimal digest for non-empty UTF-8 text and an empty result for empty input.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aPlaintext` | `string` | Text to hash. The shipped LockBox `HashString` path converts it to UTF-8. |

**Returns**

A deterministic 96-character uppercase hexadecimal SHA-384 digest for non-empty input. Empty input returns an empty string rather than the standard SHA-384 digest of an empty byte sequence.

**Behaviour**

- Equal strings produce equal hashes when their exact Unicode content is equal.
- Output for non-empty input contains only uppercase `0-9` and `A-F` characters and is 96 characters.
- The digest is unsalted and unkeyed.
- Velox product code also uses Velox pattern as a change fingerprint for file/module data.

**Errors**

Hash-component and allocation failures propagate to the script. The function does not return a separate error indicator.

**Usage notes**

For change detection, store the algorithm and representation with the digest if the value will outlive the current interface contract. For authenticating data exchanged with another party, use a keyed helper such as HMAC with a strong, non-empty secret and a defined verification protocol.

### Additional Technical Info
`HashString` computes SHA-384 over the UTF-8 representation of a string and returns the 48-byte digest as 96 uppercase hexadecimal characters. It is useful for deterministic change fingerprints and equality checks where a one-way digest is appropriate.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The wrapper creates a new internal Velox hash object for each call. That object configures the shipped TurboPower LockBox `THash` component with the SHA-384 program identifier, hashes the supplied string, converts the 48-byte digest with LockBox's stream-to-hex path, then burns/reset its hash state. The wrapper frees the object in a `finally` block.

For an empty string, LockBox's string overload does not begin or end a hash operation. Its new output stream remains empty, so Velox's hex conversion returns an empty string before the hash state is burned.

**Edge cases and quirks**

- Empty input is a special sentinel-like result: it returns `''`, not the standard SHA-384 digest. Code that stores or validates fixed-width digests must handle this explicitly.
- This is not password hashing. Fast, unsalted SHA-384 permits efficient guessing of low-entropy values; use an approved password-storage system instead.
- This is not a MAC. Anyone can recompute it after changing the input, so it does not establish authenticity.
- Unicode normalisation is not applied. Visually identical strings with different code-point sequences can hash differently.
- A hash does not preserve the original text and cannot be decrypted. Conversely, it does not guarantee uniqueness; cryptographic hashes have a theoretical collision space.
- Comparing a supplied digest with normal script string equality is not documented as constant-time.

**Side effects**

None beyond temporary memory. The implementation burns its LockBox hash state, but managed copies of input and result remain subject to ordinary process-memory behaviour.

**Performance and concurrency**

Work is linear in the UTF-8 byte length of the input. Each call creates its own hash component and has no shared hash state, so independent calls can execute concurrently.

**Related entries**

- [`HMACSHA256`](HMACSHA256.md) returns a keyed SHA-256 MAC as Base64.
- [`HMACSHA256Hex`](HMACSHA256Hex.md) returns the same keyed algorithm as uppercase hexadecimal.
- [`EncryptString`](EncryptString.md) is reversible encryption rather than a digest.

<small>Created 2026-07-15</small>
