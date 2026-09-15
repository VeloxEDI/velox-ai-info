---
title: HashString
description: Returns a 96-character uppercase SHA-384 hex digest for nonempty UTF-8 text, then burns the internal output without changing RowHash.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hash, sha-384, utf-8, hexadecimal, empty]
---

```Delphi
function HashString(aPlaintext: string): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Hash.HashString('nonempty content');
end;
```

### Usage

`HashString` returns a 96-character uppercase SHA-384 hexadecimal digest for nonempty UTF-8 text. It does not change `RowHash`.

### Additional Technical Info
`HashString` returns Velox's string representation of a SHA-384 digest.

For nonempty input, LockBox converts the Delphi string to UTF-8, hashes those bytes with SHA-384, and exposes a 48-byte digest stream. Velox rewinds the stream and converts each byte to two uppercase hexadecimal characters, yielding exactly 96 characters with no prefix/separators.

After copying the result, Velox calls `FHash.Burn`, clearing the internal hash output. It does **not** assign [`RowHash`](../Properties/RowHash.md); that property remains whatever the most recent `HasChanged` stored, or empty on a new object.

**Empty-input divergence**

The vendored LockBox `HashString` skips its complete begin/hash/end sequence when `aPlaintext = ''`. The result depends on existing object state:

- on a new object, or after a prior `HashString` burned the output, it returns `''`;
- immediately after a nonempty `HasChanged`, whose output is retained, it returns that previous digest and then burns it.

Neither case returns the standard 96-character SHA-384 digest of an empty message.

Do not pass empty when a standards-compatible digest is required. The global `HashString` wrapper creates the same class and has the same empty result.

**Meaning and safe use**

This is an unkeyed digest. It is suitable for ordinary deterministic fingerprints of nonempty text, not passwords, authentication or signatures. Input normalization is entirely the caller's responsibility: case, whitespace, Unicode normalization and line endings all change the UTF-8 byte sequence.

The method is synchronous, allocates the UTF-8 byte array and iterates the digest stream. The object is mutable and not thread-safe; serialize calls on the action-shared `Hash` object. Allocation/algorithm failures can raise.

**External references**

- [NIST FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final) defines SHA-384 and its 384-bit result.
- [Embarcadero DocWiki: `TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.UTF8) documents the input encoding.
- [Embarcadero DocWiki: `BinToHex`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.BinToHex) documents the core byte-to-hex routine used by Velox's stream converter.

<small>Created 2026-07-15</small>
