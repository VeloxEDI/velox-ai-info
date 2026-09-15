---
title: "DecryptString"
description: "Decrypts a Base64 value produced by Velox EncryptString using the built-in application compatibility key."
sidebar_position: 7
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
Function DecryptString( aPlaintext : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Ciphertext: string;
begin
  Ciphertext := EncryptString('fictional example secret');
  Value := DecryptString(Ciphertext);
end;
```

### Usage

`DecryptString` decrypts a Base64 value produced by Velox EncryptString using the built-in application compatibility key.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aPlaintext` | `string` | Misleading legacy parameter name: pass the Base64 ciphertext returned by `EncryptString`. |

**Returns**

The decrypted plaintext. Empty input returns an empty string without constructing the encryption component.

**Behaviour**

- Values produced by the corresponding Velox helper can be decrypted across executions that use the same product key material.
- The first eight decrypted bytes are random salt and are omitted from the returned string.
- The key is application-wide: it is not tied to a Windows user, computer, customer, configuration item or installation.
- The function does not verify a MAC or authenticated-encryption tag.

**Errors**

Invalid Base64, data that is too short, incompatible ciphertext, wrong key material, damaged padding and allocation failures can raise exceptions that propagate to the script. Do not expose raw decryption errors or decrypted values to untrusted users or ordinary logs.

**Usage notes**

Use this helper only to read values written for Velox's existing compatibility format. For a new security boundary, prefer a design with managed keys and authenticated encryption. Do not publish the embedded application key or treat possession of a decryptable value as authentication.

### Additional Technical Info
`DecryptString` reverses the format produced by [`EncryptString`](EncryptString.md). It accepts LockBox Base64 ciphertext encrypted with Velox's built-in application-wide compatibility key and returns the recovered plaintext.

Despite the imported parameter name `aPlaintext`, the supplied value is expected to be ciphertext. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

For non-empty input, the global wrapper creates a new internal encryption object, calls its decrypt method and frees it in a `finally` block. The object configures the shipped TurboPower LockBox codec for AES-256 in CBC mode and derives its key from fixed Velox application key material. LockBox decrypts its Base64 representation, and Velox discards the first eight recovered bytes because `EncryptString` prefixes a random eight-byte salt before the plaintext.

The plaintext conversion uses Delphi `TEncoding.ANSI`, not UTF-8. Its precise byte mapping therefore depends on the Windows ANSI code page of the process.

**Edge cases and quirks**

- Empty ciphertext returns empty plaintext. This makes an empty encrypted value indistinguishable from a deliberately encrypted empty value at this API boundary; `EncryptString('')` also returns empty.
- Non-ASCII plaintext is code-page-dependent and may already have been changed when encrypted. Use this pair only for values representable in the process ANSI code page.
- Because AES-CBC is used without authentication, corruption or deliberate modification may raise an error or may yield corrupted text. Successful decryption is not proof of origin or integrity.
- The built-in key is compatibility protection, not a per-user secret store. Anyone able to run or reverse the relevant Velox application code may be able to decrypt compatible values.
- Ciphertext is expected in LockBox's Base64 format; this function does not call Velox's permissive `Base64Decode` wrapper directly.

**Side effects**

No file or network I/O. Temporary codec, key and plaintext/ciphertext data are created in process memory. LockBox burn/reset operations are used by the implementation, but the API does not guarantee complete erasure of every managed-string or temporary copy.

**Performance and concurrency**

The full ciphertext and plaintext are processed in memory. Each wrapper call creates its own encryption object, so there is no shared codec instance between independent calls. Cryptographic work grows with the value size.

**Related entries**

- [`EncryptString`](EncryptString.md) creates the compatible ciphertext and random salt.
- [`Base64Decode`](Base64Decode.md) is a general text decoder and is not a substitute for decrypting an encrypted value.
- [`HMACSHA256`](HMACSHA256.md) provides message authentication when a suitable non-empty secret key and protocol are used; it does not decrypt data.

<small>Created 2026-07-15</small>
