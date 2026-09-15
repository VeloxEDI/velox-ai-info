---
title: "EncryptString"
description: "Encrypts ANSI-compatible text in Velox's Base64 AES-256-CBC compatibility format."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - encryption
  - aes-256
  - cbc
  - lockbox
---

```Delphi
Function EncryptString( aPlaintext : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // The result normally differs on each call because a random salt is included.
  Value := EncryptString('fictional example secret');
end;
```

### Usage

`EncryptString` encrypts ANSI-compatible text in Velox's Base64 AES-256-CBC compatibility format.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aPlaintext` | `string` | Text to encrypt. Velox converts it with the process ANSI encoding. |

**Returns**

LockBox Base64 ciphertext compatible with [`DecryptString`](DecryptString.md). Empty input returns an empty string without invoking the encryption component.

**Behaviour**

- Repeated calls with the same non-empty text normally produce different ciphertext because a fresh random prefix is generated.
- The salt is stored inside the encrypted payload and is removed by `DecryptString`; callers do not supply or retain it separately.
- Ciphertext can be decrypted by compatible Velox code using the same built-in application key material.
- The result is a Base64 string suitable for text storage, but storage and transport still need to preserve it exactly.

**Errors**

Random-generation, allocation, character-conversion and LockBox errors propagate to the script. Avoid placing plaintext, key material or complete ciphertext in routine logs and exception messages.

**Usage notes**

This function exists for Velox's established encrypted-configuration compatibility. For new high-value designs, use centrally managed secrets and authenticated encryption with explicit key rotation. Never hard-code an additional secret in a public script merely to compensate for the application-wide key.

### Additional Technical Info
`EncryptString` encrypts a string in Velox's established LockBox compatibility format and returns Base64 ciphertext. It uses AES-256 in CBC mode with fixed application-wide key material and prefixes eight random bytes before the plaintext so that repeated encryption of the same value normally produces different ciphertext.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

For non-empty input, the global wrapper constructs a new internal encryption object and frees it in a `finally` block. That object configures the shipped TurboPower LockBox library for AES-256/CBC and derives the cryptographic key from fixed Velox application key material. It generates eight random salt bytes, encrypts them immediately before the plaintext and formats the result as Base64.

Plaintext is converted using Delphi `TEncoding.ANSI`; it is not explicitly encoded as UTF-8.

**Edge cases and quirks**

- Empty input returns empty output and no random salt or ciphertext. If a stored field must distinguish missing from deliberately empty, model that distinction separately.
- The process ANSI code page controls conversion of non-ASCII input. Characters unavailable in that code page can be changed or lost, and behaviour can differ between hosts.
- AES-CBC encryption here has no MAC or authenticated-encryption tag. It provides confidentiality against casual disclosure but does not establish integrity or origin.
- The built-in key is common compatibility material, not Windows DPAPI and not a customer-, machine-, user- or record-specific key. It must not be presented as protection from a party who can execute or inspect Velox.
- Base64 makes the ciphertext printable; it does not add security.

**Side effects**

Consumes pseudorandom state and creates temporary plaintext, salt, key and ciphertext data in process memory. It performs no file or network I/O. LockBox burn/reset operations do not constitute a guarantee that all managed copies are erased.

**Performance and concurrency**

The complete plaintext and ciphertext are held in memory. A separate encryption object is created for each call, avoiding a shared codec instance. Work grows with the input length.

**Related entries**

- [`DecryptString`](DecryptString.md) reads this exact compatibility format.
- [`HashString`](HashString.md) is a one-way SHA-384 digest and cannot recover the original text.
- [`HMACSHA256Hex`](HMACSHA256Hex.md) authenticates data with a caller-supplied non-empty key but does not encrypt it.

<small>Created 2026-07-15</small>
