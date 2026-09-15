---
title: EncryptString
description: Converts plaintext through the host ANSI code page and returns randomized unauthenticated Velox/LockBox AES-CBC ciphertext as Base64.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, encrypt, string, ansi, aes-cbc, base64, integrity]
---

```Delphi
function EncryptString(aPlaintext: string): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Encryption: TvxEncryption;
begin
  Encryption := TvxEncryption.Create;
  try
    Value := Encryption.EncryptString('ABC-123');
  finally
    Encryption.Free;
  end;
end;
```

### Usage

`EncryptString` converts plaintext through the host ANSI code page and returns randomized unauthenticated Velox/LockBox AES-CBC ciphertext as Base64.

**Processing sequence**

1. LockBox converts the Velox string with `TEncoding.ANSI`.
2. It encrypts the resulting bytes using the instance's fixed-key AES-256-CBC configuration.
3. For nonempty data it generates a randomized 64-bit IV seed, prepends the seed in clear to the framed ciphertext and applies CBC padding.
4. It Base64-encodes the binary frame.
5. Velox calls `Reset` and `Burn`, retaining configured key material for later sequential reuse while clearing active codec buffers.

Because of the IV seed, equal nonempty plaintext normally produces different ciphertext. Do not compare ciphertext strings to test plaintext equality.

### Additional Technical Info
`EncryptString` returns ciphertext compatible with Velox's fixed-key LockBox3 decrypt function.

**Encoding loss**

ANSI means the default Windows ANSI code page of the executing Designer/Service/API process. Unsupported Unicode characters can be replaced before encryption, so decryption may not reproduce the original and output can differ between host locales. Use this method only for values whose required characters are known to be representable in the host code page.

**Empty-input quirk**

The class method obtains a zero-length byte array and passes `PlaintextBytes[0]` to LockBox. Under the active range-check configuration, empty plaintext can raise `ERangeError`. The separate global `EncryptString` wrapper special-cases empty and returns `''`; these entry points are not identical. Guard class calls with `aPlaintext <> ''` when empty is possible.

**Security and failure behavior**

The output provides confidentiality only. It has no authentication tag/MAC, and malformed or modified ciphertext is not securely authenticated. Fixed product-wide key material is recoverable from the product and supplies no tenant isolation or rotation.

The instance has mutable codec state and no method-level lock. Do not share it concurrently. Conversion, allocation, algorithm or crypto failures raise; because reset/burn is not protected by a product `finally`, free an instance after failure. Work is synchronous with memory proportional to encoded input plus ciphertext/Base64 expansion.

**External references**

- [Embarcadero DocWiki: `TEncoding.ANSI`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ANSI) documents the host-dependent plaintext conversion.
- [NIST SP 800-38A](https://csrc.nist.gov/pubs/sp/800/38/a/final) defines CBC as a confidentiality mode; the LockBox frame and missing authentication are implementation properties.

<small>Created 2026-07-15</small>
