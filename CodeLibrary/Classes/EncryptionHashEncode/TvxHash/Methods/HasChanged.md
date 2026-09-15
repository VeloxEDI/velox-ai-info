---
title: HasChanged
description: Hashes nonempty new data into RowHash and compares it exactly with the supplied digest, but can reuse stale state for empty data.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hash, sha-384, changed, rowhash, empty, stale-state]
---

```Delphi
function HasChanged(aCurrentHash, aNewData: string): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  NewHash: string;
begin
  if Hash.HasChanged('', 'new nonempty content') then
  begin
    NewHash := Hash.RowHash;
    Value := NewHash;
  end;
end;
```

### Usage

`HasChanged` hashes nonempty new data into RowHash and compares it exactly with the supplied digest, but can reuse stale state for empty data.

**Critical empty-data behavior**

LockBox's string hasher performs no operation for `aNewData = ''`. `HasChanged` does not burn the digest after a call. Therefore:

- on a newly created object, empty new data produces `RowHash = ''`;
- after a prior nonempty `HasChanged`, empty new data reuses that prior digest;
- it never computes the standard SHA-384 digest of an empty message.

Do not use `HasChanged` with empty new data. Handle empty as a separate state or add an unambiguous nonempty framing prefix before hashing.

**Errors, security and performance**

Hash allocation/algorithm failures can raise and leave the previous `RowHash` intact until assignment succeeds. SHA-384 is unkeyed: the comparison detects ordinary mismatch but not a malicious replacement of both content and digest. The mutable object is not thread-safe. Work and temporary UTF-8 memory are proportional to input length.

### Additional Technical Info
`HasChanged` hashes `aNewData`, stores the hexadecimal result in [`RowHash`](../Properties/RowHash.md), then compares the supplied current hash with it.

For nonempty data the exact flow is:

1. SHA-384 hash the UTF-8 bytes of `aNewData`;
2. rewind/read the 48-byte digest and convert it to 96 uppercase hexadecimal characters;
3. assign that text to `RowHash`;
4. return `aCurrentHash <> RowHash`.

The comparison is ordinary case-sensitive string inequality. It does not trim, validate length/hex syntax, normalize lowercase or use constant-time comparison. A lowercase representation of the same digest therefore reports changed.

`RowHash` is updated even when the result is false. Copy it immediately if required; on the host-provided `Hash` object another script using the same action can overwrite it.

**External references**

- [NIST FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final) defines SHA-384; Velox's exact-case comparison and empty-input state bug are product/vendor behavior.
- [Embarcadero DocWiki: `TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.UTF8) documents the nonempty input encoding.

<small>Created 2026-07-15</small>
