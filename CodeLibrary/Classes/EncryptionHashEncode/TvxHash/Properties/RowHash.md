---
title: RowHash
description: Returns the mutable digest last stored by HasChanged, initially empty and potentially stale after an empty-data call.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hash, rowhash, state, sha-384, stale]
---

```Delphi
property RowHash: string read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Snapshot: string;
begin
  if Hash.HasChanged('', 'new nonempty content') then
  begin
    Snapshot := Hash.RowHash;
    Value := Snapshot;
  end;
end;
```

### Usage

`RowHash` returns the mutable digest last stored by HasChanged, initially empty and potentially stale after an empty-data call.

### Additional Technical Info
`RowHash` is the read-only script view of the `TvxHash` instance's mutable `FRowHash` string.

It is initialized to `''` by [`Create`](../Methods/Create.md). Only [`HasChanged`](../Methods/HasChanged.md) assigns it. [`HashString`](../Methods/HashString.md) returns a digest but does not update this property.

After a successful nonempty `HasChanged`, `RowHash` is the 96-character uppercase SHA-384 hexadecimal digest of the new UTF-8 text, regardless of whether the comparison result was true or false.

**Empty and stale state**

An empty-data `HasChanged` does not run LockBox hashing. On a new object, `RowHash` remains/becomes empty; after a previous nonempty `HasChanged`, the previous digest is read again and reassigned. `RowHash` can therefore describe old data. Empty input must be handled separately.

**Shared-object race**

The global `Hash` variable is one action-owned object shared by that action's scripters. Another call to `HasChanged` can replace `RowHash` between operations, and the class has no lock. Copy the property immediately after the associated call and never use it as durable global storage. A script-created instance avoids host sharing but is still not thread-safe.

The property returns a string copy and has no direct write/post/I/O side effect. Do not treat a nonempty value as authenticated; SHA-384 is unkeyed.

**External references**

- [NIST FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final) defines the underlying 384-bit digest. RowHash lifetime and empty behavior are Velox/LockBox-specific.

<small>Created 2026-07-15</small>
