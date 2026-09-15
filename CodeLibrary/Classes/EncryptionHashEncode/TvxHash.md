---
title: TvxHash
description: Provides stateful SHA-384 hashing and exact digest change comparison over nonempty UTF-8 string data.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hash, sha-384, utf-8, change-detection, state]
---

```Delphi
TvxHash = class(TObject)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Hasher: TvxHash;
begin
  Hasher := TvxHash.Create;
  try
    Value := Hasher.HashString('Customer reference');
  finally
    Hasher.Free;
  end;
end;
```

### Usage

`TvxHash` provides stateful SHA-384 hashing and exact digest change comparison over nonempty UTF-8 string data.

### Additional Technical Info
`TvxHash` wraps TurboPower LockBox3 SHA-384 for string hashing and stateful change detection.

The registered surface consists of [`Create`](TvxHash/Methods/Create.md), [`HashString`](TvxHash/Methods/HashString.md), [`HasChanged`](TvxHash/Methods/HasChanged.md) and read-only [`RowHash`](TvxHash/Properties/RowHash.md).

**Two acquisition modes**

- `TvxHash.Create` returns a caller-owned object that the script must `Free`.
- The global `Hash` variable returns an action-owned object created lazily by `TvxActionMan`. Every scripter in that action receives the same object; do not free or retain it beyond the action.

**Digest format**

For nonempty input, LockBox converts the Delphi string to UTF-8 and applies SHA-384. The 48-byte digest is emitted by Velox as 96 uppercase hexadecimal characters with no prefix or separators.

SHA-384 is deterministic and unkeyed. It can identify ordinary content changes but is not an HMAC, signature, encryption or suitable password-storage scheme. The helpers compare strings normally, not in constant time.

**State model and quirks**

`HashString` returns a digest and burns the internal output but does not set `RowHash`. `HasChanged` sets `RowHash` to its newly computed digest, leaves the internal digest retained and compares the caller's hash exactly/case-sensitively.

The vendored LockBox string hasher skips hashing when the input string is empty. As a result, these APIs do not return the standard SHA-384 empty-message digest. On new/burned state, `HashString('')` returns `''`; after a nonempty `HasChanged`, it can instead return that retained prior digest and then burn it. `HasChanged(..., '')` has the same retained-or-empty dependency. Treat empty as an unsupported hashing input unless this stateful behavior is explicitly desired.

**Concurrency and lifetime**

The object owns mutable hash/output/RowHash state and has no lock. Do not call one instance concurrently. This is especially important for the action-shared global `Hash`: copy `RowHash` immediately after the corresponding `HasChanged` call and do not assume it remains yours across another script callback.

Hashing is synchronous and allocates a UTF-8 byte array proportional to input size. Invalid/freed object state and allocation/algorithm errors can raise.

**External references**

- [NIST FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final) defines SHA-384 and its 384-bit digest.
- [Embarcadero DocWiki: `TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.UTF8) documents the byte encoding used for nonempty input.

<small>Created 2026-07-15</small>
