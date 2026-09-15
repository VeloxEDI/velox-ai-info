---
title: "HMACSHA256"
description: "Computes HMAC-SHA-256 over UTF-8 text and returns a padded standard Base64 MAC."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - hmac
  - sha-256
  - base64
---

```Delphi
Function HMACSHA256( const Value, Key : String) : String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := HMACSHA256('fictional message', 'example-key-not-a-secret');
end;
```

### Usage

`HMACSHA256` computes HMAC-SHA-256 over UTF-8 text and returns a padded standard Base64 MAC.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Value` | `String`, `const` | Message text. It is converted to UTF-8 before HMAC calculation. |
| `Key` | `String`, `const` | Secret key text. It must be non-empty and is converted to UTF-8. |

**Returns**

A 44-character standard Base64 representation of the 32-byte HMAC-SHA-256 value, including `=` padding.

**Behaviour**

- With an identical non-empty key and exact message, the result is deterministic.
- Empty `Value` with a non-empty key computes the HMAC of an empty byte sequence.
- Output uses standard Base64 `+` and `/`, includes padding, and contains no line wrapping.
- Both inputs use UTF-8; no Unicode normalisation is applied.

**Errors**

If SHA-256 is unavailable, Velox raises `SHA256 hashing is not available!`. OpenSSL loading, allocation and Velox hashing exceptions propagate to the script. Do not include keys or sensitive messages in logged error context.

### Additional Technical Info
`HMACSHA256` computes an HMAC using SHA-256 over the UTF-8 bytes of `Value`, with the UTF-8 bytes of `Key`, and returns the 32-byte MAC as padded standard Base64. Use it when an integration protocol explicitly requires this algorithm and representation.

The example key is deliberately fictional and must not be copied into production. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox asks the shipped Indy/OpenSSL integration to load the OpenSSL library, verifies that Indy's `TIdHashSHA256` reports availability, creates a `TIdHMACSHA256` object, assigns the UTF-8 key bytes, hashes the UTF-8 message bytes, then passes the 32-byte result to [`Base64EncodeBytes`](Base64EncodeBytes.md). The HMAC object is freed in a `finally` block. Depending on the shipped runtime availability, Indy can use its OpenSSL interface or its native HMAC construction over SHA-256.

**Edge cases and quirks**

- **Do not pass an empty key.** In the shipped Indy implementation, assigning a zero-length key leaves its internal key unset. During hashing, Indy generates a random 32-byte key instead of calculating the standard HMAC for an empty key. The generated key is not returned, so results can vary from call to call and cannot be reproduced reliably.
- The helper does not enforce a minimum key strength or obtain a secret from a vault. Key creation, storage, distribution and rotation are the caller's responsibility.
- Base64 representation may need protocol-specific URL escaping. This function does not produce Base64URL.
- The function calculates a MAC but does not provide a verifier or a documented constant-time comparison operation.
- HMAC authenticates bytes; it does not encrypt the message or hide its content.

**Side effects**

Loading OpenSSL can update process-wide cryptographic library state. The call also creates temporary key, message and digest bytes in process memory. The wrapper does not promise secure erasure of all temporary or managed copies.

**Performance and concurrency**

Work is linear in the UTF-8 message length. Each call creates a separate HMAC object, although OpenSSL library loading/state is process-wide. Use controlled message sizes and avoid concurrently modifying input variables.

**Remarks**

Define the exact string canonicalisation, encoding, output representation and comparison rules at both ends of an integration. Reject an absent or empty secret before calling this helper. Store real secrets outside scripts and documentation.

**Related entries**

- [`HMACSHA256Hex`](HMACSHA256Hex.md) computes the same MAC but returns uppercase hexadecimal.
- [`Base64EncodeBytes`](Base64EncodeBytes.md) formats the binary result.
- [`HashString`](HashString.md) is unkeyed SHA-384 and is not an authentication substitute.

**External references**

- [Embarcadero DocWiki: `TNetEncoding.EncodeBytesToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.NetEncoding.TNetEncoding.EncodeBytesToString) - the Delphi Base64 terminal reached while formatting the MAC.
- [Free Pascal: `EncodeStringBase64`](https://www.freepascal.org/docs-html/fcl/base64/encodestringbase64.html) - compatibility context for the output encoding, not the Indy HMAC implementation itself.

<small>Created 2026-07-15</small>
