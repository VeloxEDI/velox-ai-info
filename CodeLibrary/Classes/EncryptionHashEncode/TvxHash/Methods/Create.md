---
title: Create
description: Allocates a caller-owned LockBox SHA-384 helper with an initially empty RowHash state.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hash, constructor, ownership, sha-384]
---

```Delphi
constructor Create
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Hasher: TvxHash;
begin
  Hasher := TvxHash.Create;
  try
    Value := Hasher.HashString('ABC');
  finally
    Hasher.Free;
  end;
end;
```

### Usage

`Create` allocates a caller-owned LockBox SHA-384 helper with an initially empty RowHash state.

### Additional Technical Info
`Create` allocates a new script-owned hash helper.

It creates a LockBox `TCryptographicLibrary`, creates a `THash`, attaches the library, selects `native.hash.SHA-384` and initializes `RowHash` to the empty string.

The algorithm selection is fixed; the constructor accepts no salt, key, encoding or algorithm option. For nonempty strings, later calls use the LockBox default UTF-8 overload.

**Ownership**

Release the returned object with inherited `Free` in `finally`. Its destructor burns/frees the hash component and frees the cryptographic library. This rule does not apply to the global `Hash` variable, which returns an action-owned object and must not be freed.

Allocation or algorithm registration failures can raise. Construction performs no file/network/database I/O but creates multiple native objects. The result is mutable and unsynchronised; callers must serialize access.

**External references**

- [NIST FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final) defines the selected SHA-384 algorithm.

<small>Created 2026-07-15</small>
