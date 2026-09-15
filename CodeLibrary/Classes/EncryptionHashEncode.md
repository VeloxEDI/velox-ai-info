---
title: Encryption, hashing and encoding
description: Script-visible helper classes for Velox-compatible string encryption and stateful SHA-384 change detection.
sidebar_position: 4
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, classes, encryption, hashing, sha-384, aes, encoding]
---

This class branch contains the object-oriented Velox encryption and hashing helpers. Function-based Base64, hash, HMAC, encryption and identifier encoders are documented separately under Functions > EncryptionHashEncode.

## Available classes

- [`TvxEncryption`](EncryptionHashEncode/TvxEncryption.md) creates a caller-owned AES-256-CBC/LockBox3 compatibility encryptor and exposes `EncryptString`.
- [`TvxHash`](EncryptionHashEncode/TvxHash.md) creates a caller-owned SHA-384 helper or describes the object returned by the host-provided `Hash` variable.

## Acquisition and ownership

Both constructors are registered. An object explicitly created by a script must be released with `Free`, normally in `try..finally`.

The global `Hash` helper follows a different rule: Velox lazily creates one `TvxHash` on the action manager and shares it across the action's scripters. That borrowed object must not be freed. Its `RowHash` is shared mutable state, so consume or copy it immediately after `HasChanged`.

## Security and compatibility boundaries

The encryption class exists to reproduce Velox's stored ciphertext format. It uses fixed product-wide key material, ANSI plaintext conversion, LockBox3 framing and unauthenticated AES-CBC. It is not tenant-specific key management, password hashing, digital signing or authenticated encryption. Prefer a current managed secret/key service and authenticated scheme for new security designs unless Velox-format compatibility is the explicit requirement.

The hash class uses unkeyed SHA-384 over UTF-8 for nonempty strings. A digest can detect ordinary changes but does not prove who produced the content. Use HMAC or a signature where authenticity is required, and use a dedicated salted password-hashing algorithm for passwords.

## Encoding and state traps

- Encryption input uses the executing Windows host's ANSI code page and can replace unsupported Unicode characters.
- SHA-384 input uses UTF-8 and normally returns 96 uppercase hexadecimal characters.
- The object APIs have special empty-input behavior; read the exact method page before using empty as a real business value.
- Helper objects are mutable and not thread-safe. Do not call one instance concurrently.
- Ciphertext and hashes can still be sensitive identifiers. Avoid unnecessary logging and use constant-time authenticated comparisons when a security protocol requires them.

## External standards

- [NIST SP 800-38A](https://csrc.nist.gov/pubs/sp/800/38/a/final) defines CBC as a confidentiality mode; the Velox format and absence of an authentication tag are implementation-specific.
- [NIST FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final) defines SHA-384 and the other Secure Hash Standard algorithms.
