---
title: FilePath
description: Sets a one-shot explicit input path or destructively retrieves it, otherwise discovering the first matching file.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, file-path, discovery, destructive-getter]
---

```Delphi
property FilePath: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  { Reading can discover/consume a path and wait for a lock. }
  if FileCon <> nil then
    Value := FileCon.FilePath
  else
    Value := '';
end;
```

### Usage

`FilePath` sets a one-shot explicit input path or destructively retrieves it, otherwise discovering the first matching file.

**Setter**

Assignment stores the exact string in both the explicit FilePath field and [`CurrentFileName`](CurrentFileName.md). It performs no tag processing, existence/access/lock check, normalisation or logging.

**Getter: explicit branch**

When an explicit value is present, the getter checks file existence and waits up to configured `WaitFor` seconds for lock release, logging errors on failure. It nevertheless returns that same path and clears the explicit field even when the file is missing or remains locked.

**Getter: discovery branch**

When no explicit value is present, it processes FileDir and the configured FilePattern, then calls `FindFirst` with attribute mask 0. It chooses only the first matching normal entry returned by the operating system; ordering is not guaranteed. The same existence/lock checks can log errors without preventing the found path from being returned.

No match returns empty. Every getter branch assigns its result to CurrentFileName.

**Critical consequences**

- Reads are destructive/stateful: a second read can search and return a different path.
- A nonempty result is not proof that the file exists, is unlocked, authorised or safely processable; inspect shared log status too.
- Discovery does not reserve/rename the file, so another worker/process can race it.
- Hidden/read-only/system entries may not be included by the zero attribute mask.
- Path/tag/file errors mostly update the shared Log rather than raise here.
- Reading can block for the configured wait per path and performs filesystem/network I/O.

### Additional Technical Info
`FilePath` is FileCon's one-shot explicit input path and fallback file-discovery getter. Unlike an ordinary property, reading it performs stateful checks/search and clears the explicit field.

**Security and concurrency**

Assignment/discovery run under the service identity. Use trusted roots and a single owning action thread; concurrent readers can consume/race the same field/file.

**Related entries**

- [`CurrentFileName`](CurrentFileName.md) — assigned on set and every get.
- [`ProcessFileDir`](../Methods/ProcessFileDir.md) and [`MatchesSearchPattern`](../Methods/MatchesSearchPattern.md) — discovery context.
- [`FileSavePath`](FileSavePath.md) — separate output path generator.

<small>Created 2026-07-15</small>
