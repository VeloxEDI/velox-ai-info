---
title: "HMACSHA256Hex"
description: "Computes HMAC-SHA-256 over UTF-8 text and returns an uppercase hexadecimal MAC."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - hmac
  - sha-256
  - hexadecimal
---

```Delphi
Function HMACSHA256Hex( const Value, Key : String) : String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := HMACSHA256Hex('fictional message',
    'example-key-not-a-secret');
end;
```

### Usage

`HMACSHA256Hex` computes HMAC-SHA-256 over UTF-8 text and returns an uppercase hexadecimal MAC.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Value` | `String`, `const` | Message text, converted to UTF-8 before hashing. |
| `Key` | `String`, `const` | Secret key text, converted to UTF-8. It must be non-empty. |

**Returns**

A 64-character uppercase hexadecimal HMAC-SHA-256 value containing only `0-9` and `A-F`.

**Behaviour**

- Identical exact text and an identical non-empty key produce the same result.
- Empty `Value` is valid when `Key` is non-empty and represents HMAC over an empty byte sequence.
- Output is fixed-width uppercase hexadecimal with no prefix, separators or whitespace.
- Text is UTF-8 encoded without Unicode normalisation.

**Errors**

When SHA-256 is unavailable, Velox raises `SHA256 hashing is not available!`. OpenSSL, Velox and allocation exceptions otherwise propagate to the script. Never add secret values to routine error logging.

### Additional Technical Info
`HMACSHA256Hex` computes HMAC-SHA-256 over the UTF-8 representation of `Value` using the UTF-8 representation of `Key`, then returns the 32-byte MAC as 64 uppercase hexadecimal characters.

The example key is deliberately fictional and must not be used as a production secret. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox loads the shipped OpenSSL integration, checks Indy's SHA-256 availability, creates `TIdHMACSHA256`, assigns UTF-8 key bytes and hashes UTF-8 message bytes. The digest is formatted by Indy's `ToHex` helper, whose hexadecimal digit table is uppercase. The HMAC object is freed in a `finally` block. Indy can use its OpenSSL interface or a native HMAC construction over SHA-256, depending on runtime availability.

**Edge cases and quirks**

- **An empty key does not mean standard HMAC with a zero-length key.** The shipped Indy class treats its unset, zero-length key as a request to generate a random 32-byte key during hashing. That key is not returned, so the result can change on each call and cannot be verified later. Reject empty keys explicitly.
- Protocols can require lowercase hex. This helper returns uppercase; change case only if the protocol specifies it consistently at both producer and verifier.
- The helper neither validates key entropy nor manages secret storage or rotation.
- No constant-time comparison helper is included. Ordinary script equality should not be assumed to resist timing analysis when verifying attacker-controlled MACs.
- A MAC detects modification for parties holding the secret; it does not encrypt the message.

**Side effects**

The OpenSSL load request can affect process-wide library state. Temporary key, message and digest bytes exist in process memory, and complete secure erasure is not guaranteed by this API.

**Performance and concurrency**

HMAC work is linear in the UTF-8 message length. A new HMAC object is used per call; the cryptographic library itself has process-wide load state.

**Remarks**

Before implementing a signing protocol, define canonical message construction, UTF-8 handling, uppercase representation, key lifecycle and verification. The receiving side must calculate the same bytes, not merely the same visually rendered text.

**Related entries**

- [`HMACSHA256`](HMACSHA256.md) returns the identical algorithm's MAC in padded standard Base64.
- [`HashString`](HashString.md) is an unkeyed SHA-384 change fingerprint.
- [`EncryptString`](EncryptString.md) provides reversible confidentiality in Velox's compatibility format, not message authentication.

<small>Created 2026-07-15</small>
