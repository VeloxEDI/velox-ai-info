---
title: TvxEncryption
description: Provides caller-owned Velox-format string encryption using fixed-key AES-256-CBC, ANSI conversion and LockBox3 Base64 framing.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, encryption, aes-256, cbc, lockbox, ansi, base64]
---

```Delphi
TvxEncryption = class(TObject)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Encryption: TvxEncryption;
begin
  Encryption := TvxEncryption.Create;
  try
    Value := Encryption.EncryptString('Customer reference');
  finally
    Encryption.Free;
  end;
end;
```

### Usage

`TvxEncryption` provides caller-owned Velox-format string encryption using fixed-key AES-256-CBC, ANSI conversion and LockBox3 Base64 framing.

**Security limitations**

AES-CBC here has no MAC/authentication tag. It does not establish integrity, authenticity or resistance to active ciphertext modification. Do not use the result as proof that data was produced by Velox, and do not design a new security protocol around this class.

Input conversion is Windows ANSI rather than UTF-8. Characters outside the active code page can be replaced before encryption, and ciphertext compatibility can depend on the service/Designer host code page.

### Additional Technical Info
`TvxEncryption` is the object-oriented Velox compatibility encryptor. Scripts can construct it and call one registered operation, [`EncryptString`](TvxEncryption/Methods/EncryptString.md).

The class does not register `DecryptString`; the separately registered global `DecryptString` function is documented under Functions. Do not assume every native public member is script-visible.

**Configured format**

Construction selects TurboPower LockBox3's stream-to-block adapter, native AES-256 block cipher and CBC chaining. It derives the 256-bit AES key from fixed 16-character product key material encoded as 32 UTF-16LE bytes. All instances and Velox installations using this source share that material.

Nonempty encryption uses LockBox3's randomized framing: an IV seed is included with the ciphertext, the binary result is Base64-encoded, and CBC padding is library-defined. Re-encrypting the same representable plaintext normally produces different text while remaining compatible with Velox decryption.

This fixed key is embedded compatibility/obfuscation, not per-customer key custody or rotation. Possession of the product/source can disclose the key. The public documentation deliberately does not reproduce its literal value.

**Ownership, state and concurrency**

`Create` returns a caller-owned object; always `Free` it. The object owns a LockBox cryptographic library, codec and monitor. Encryption mutates/reset/burns codec state. The monitor is used only during constructor password assignment, not around `EncryptString`, so one instance must not be called concurrently.

If encryption raises, the wrapper has no `try..finally` around its reset/burn sequence; discard/free that instance rather than assuming it remains reusable. Operations are synchronous and allocate encoded byte, ciphertext and Base64 buffers proportional to input size.

**External references**

- [NIST SP 800-38A](https://csrc.nist.gov/pubs/sp/800/38/a/final) defines CBC mode and its confidentiality scope.
- [Embarcadero DocWiki: `TEncoding.ANSI`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ANSI) documents the platform/default-code-page conversion used for plaintext.

<small>Created 2026-07-15</small>
