---
title: PasswordEncrypted
description: Reads or replaces the raw Velox-encrypted database password ciphertext stored on this connection module.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, database, password, secret]
---

```Delphi
property PasswordEncrypted: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  { Test presence without logging or returning the ciphertext itself. }
  if DBCon <> nil then
    Value := DBCon.PasswordEncrypted <> ''
  else
    Value := False;
end;
```

### Usage

`PasswordEncrypted` reads or replaces the raw Velox-encrypted database password ciphertext stored on this connection module.

**Behaviour**

Use only with a value produced by the same governed Velox encryption/configuration workflow. Supplying plaintext or incompatible/corrupt ciphertext can cause decrypt/connect failure or an invalid credential.

Assignment does not affect an already-authenticated database session, reconnect or save the module. It changes secret material that can be consumed on a later connection attempt.

**Security, errors and quirks**

- Never log, email, display, return or place the value in a general variable/document.
- Encryption at rest is not an authorisation boundary and does not make broad read access safe.
- The scripting surface does not expose the ordinary clear Password property; do not attempt to decode this value in scripts.
- An empty value can be valid for integrated authentication or invalid for password authentication; auth type is separate.
- Handle secret rotation through approved configuration procedures, not ad-hoc runtime script mutation.

### Additional Technical Info
`PasswordEncrypted` exposes the raw encrypted string stored in the module, primarily so governed configuration can copy an already-encrypted credential without knowing its clear value.

It is ciphertext, not the clear database password. It remains sensitive because it is reversible by Velox and can be replayed in compatible configuration.

**Implementation**

The getter returns the private password field unchanged. The setter also stores the supplied string unchanged: it does not encrypt, decrypt, validate format or test credentials. When ConnectDatabase runs, the separate native Password getter decrypts this field, processes tags and supplies the clear result to connection parameter setup.

**Performance and concurrency**

Raw field access is cheap; decryption/connect occurs later. Concurrent secret mutation can create unpredictable authentication and disclosure risk.

**Related entries**

- [`Username`](Username.md), [`Hostname`](Hostname.md) and [`Database`](Database.md) — associated connection identity/endpoint fields.
- [`TvxDBCon`](../../TvxDBCon.md) — connection and pooling behaviour.

<small>Created 2026-07-15</small>
