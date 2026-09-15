---
title: FileHash
description: Gets or replaces FileCon's cached hash string, lazily derived from nonempty legacy FileData when blank.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, sha-384, hash, integrity]
---

```Delphi
property FileHash: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.FileHash <> ''
  else
    Value := False;
end;
```

### Usage

`FileHash` gets or replaces FileCon's cached hash string, calculated on first access from nonempty legacy FileData when blank.

**Freshness and scope limitations**

- A nonempty FileData assignment recomputes the hash; an empty assignment leaves the previous hash.
- Reset does not clear FileData or FileHash.
- Disk content changes do not invalidate/recompute the cache. The hash is over the in-memory Velox string representation, not an independently re-read file byte stream.
- A hash match is not authenticity, digital signature, authorisation or proof that I/O succeeded. SHA-384 alone has no secret key.
- Velox log/database code can persist/copy this value, so arbitrary/stale script writes can contaminate audit comparison data.

### Additional Technical Info
`FileHash` exposes FileCon's cached content-hash string.

**Getter/setter implementation**

If the cached hash is empty and [`FileData`](FileData.md) is nonempty, the getter hashes that Delphi string through Velox's LockBox SHA-384 wrapper, stores the hexadecimal result and returns it. Otherwise it returns the cached string unchanged.

The scripting setter directly replaces the cache. It does not validate format/length, hash data or compare anything. A caller can therefore store arbitrary text that later reads return as though it were a hash.

**Performance, security and concurrency**

Cached reads are cheap; a lazy hash scans all FileData and allocates cryptographic state. Hashes can still identify/signal sensitive content and should not be broadly exposed. The content/cache pair is unsynchronised.

**Related entries**

- [`FileData`](FileData.md) — deprecated source string and empty-write quirk.
- [`CurrentFileName`](CurrentFileName.md) — path is not automatically hashed.
- [`TvxFileCon`](../../TvxFileCon.md) — reset/ownership boundaries.

<small>Created 2026-07-15</small>
