---
title: Create
description: Allocates and configures a caller-owned Velox-format AES-256-CBC encryptor with fixed product key material.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, encryption, constructor, ownership, aes-256, cbc]
---

```Delphi
constructor Create
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Encryption: TvxEncryption;
begin
  Encryption := TvxEncryption.Create;
  try
    Value := Encryption.EncryptString('ABC');
  finally
    Encryption.Free;
  end;
end;
```

### Usage

`Create` allocates and configures a caller-owned Velox-format AES-256-CBC encryptor with fixed product key material.

### Additional Technical Info
`Create` allocates a new script-owned encryption helper and fully configures its LockBox3 components.

Construction performs this sequence:

1. allocate a monitor object;
2. allocate `TCryptographicLibrary` and `TCodec`;
3. reset the codec and attach the library;
4. select the stream-to-block adapter, `native.AES-256` and CBC;
5. assemble fixed product key material and assign it as the codec password while holding the monitor.

The 16-character Delphi password becomes exactly 32 UTF-16LE bytes, matching the AES-256 seed size. It is fixed in product code rather than loaded from configuration, a vault, tenant context or caller argument.

**Ownership and cleanup**

The returned object belongs to the script that called `Create`. Release it with inherited `Free` in `finally`; its destructor frees codec, cryptographic library and monitor and burns library state where supported. Do not free the separate object returned by the global `Hash` variable—its ownership is unrelated.

Allocation, algorithm lookup or codec initialization failures can raise. Do not use an unassigned variable after constructor failure. Construction has no external I/O but allocates several component/interface objects, so reuse one instance sequentially for a small group of calls when appropriate.

**Concurrency and security**

The constructor's monitor protects only initial password assignment. It does not make later encryption calls thread-safe. Fixed product-wide key material gives format compatibility but no key separation, rotation or tenant isolation.

**External references**

- [NIST SP 800-38A](https://csrc.nist.gov/pubs/sp/800/38/a/final) describes the selected CBC mode; LockBox framing and key setup are product/vendor implementation details.

<small>Created 2026-07-15</small>
