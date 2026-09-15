---
title: "Encryption, hashing and encoding"
description: "Functions for Base64 conversion, Velox-compatible encryption, hashes, HMACs and reversible Sqid identifiers."
sidebar_position: 11
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - encryption
  - hashing
  - base64
  - hmac
  - sqid
---

This group contains several transformations that can produce opaque-looking text but have fundamentally different security properties. Choose by the required contract—binary transport, confidentiality compatibility, integrity/authentication, one-way digest or compact reversible identifier—not by how random the output appears.

## Choosing a family

- Use the `Base64...` entries to carry bytes as text or recover the original bytes. Base64 is reversible encoding and supplies no secrecy or tamper protection.
- Use [`EncryptString`](EncryptionHashEncode/EncryptString.md) and [`DecryptString`](EncryptionHashEncode/DecryptString.md) only for the existing Velox compatibility format. The built-in application key and ANSI-oriented input contract make this unsuitable as a general secret-storage design.
- Use [`HMACSHA256`](EncryptionHashEncode/HMACSHA256.md) or [`HMACSHA256Hex`](EncryptionHashEncode/HMACSHA256Hex.md) when a shared secret must authenticate exact UTF-8 text.
- Use the hash entries for deterministic digests. [`HashString`](EncryptionHashEncode/HashString.md) is SHA-384; the MD5 and SHA-1 families are legacy compatibility tools and should not be selected for collision-resistant security decisions.
- Use the `Sqid...` entries for short reversible numeric identifiers. Sqids obscure an integer representation but do not encrypt, authenticate or make a value unguessable.

## Text and byte boundaries

Encoding is part of each contract. String-oriented Base64, HMAC and digest functions generally convert text to UTF-8, while `EncryptString` has a narrower compatibility route. Byte and file variants work on exact binary content; stream hashing begins at the stream's current position. Two functions with the same visible text can therefore produce different results if their byte encodings or input ranges differ.

Record all of the following in an integration specification:

- source text encoding or exact byte representation;
- output alphabet and case;
- Base64 versus hexadecimal output;
- padding and line-wrap expectations;
- key representation and ownership for HMAC;
- empty-input behavior; and
- the exact legacy algorithm required by the receiving system.

## Security and operational boundaries

Hashes are not encryption, unkeyed hashes do not prove who produced a value, and ordinary equality checks may leak timing information in security-sensitive protocols. Never log plaintext secrets or HMAC/encryption keys. File helpers read or write complete files under the Velox service identity and can consume substantial memory for large inputs.

Algorithm names alone do not establish interoperability. Follow the selected child page's verified encoding, case, empty-input, stream-position, file-effect and error rules.
