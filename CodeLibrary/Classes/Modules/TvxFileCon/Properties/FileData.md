---
title: FileData
description: Gets or replaces the deprecated in-memory string representation of current file content and conditionally recomputes its hash.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, file-content, deprecated, hash]
---

```Delphi
property FileData: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := Length(FileCon.FileData)
  else
    Value := 0;
end;
```

### Usage

`FileData` gets or replaces the deprecated in-memory string representation of current file content and conditionally recomputes its hash.

**Critical empty/stale behaviour**

Assigning an empty string does **not** clear or recompute FileHash. Reset also does not clear either field. Consequently an empty/currently replaced FileData can coexist with a hash from older content. Do not infer content presence or freshness from one property alone.

Assignment does not write a disk file, update `CurrentFileName`, set FileEvent, create a log event or persist configuration. Conversely, disk-file changes do not automatically update this buffer.

**Data and security limitations**

- This is a Velox string, not an authoritative byte buffer. Binary data and encoding round-trips can be lossy/different from disk bytes.
- Large content duplicates memory and hashing work; avoid script-level copies/logging in record loops.
- Content can contain credentials, personal/business data or payloads. Never return/log it without an explicit approved need and redaction policy.
- Writable content can diverge from the current file/log and mislead downstream code that reads it.

### Additional Technical Info
`FileData` exposes FileCon's legacy in-memory `String` buffer for file content. Native source marks it deprecated in favour of stream-based content, but active file engines still populate it for logging/hash workflows.

The getter returns the stored string. The setter stores the supplied string and, when it is nonempty, immediately recomputes [`FileHash`](FileHash.md) through Velox's SHA-384 wrapper.

**Concurrency**

The buffer/hash pair is unsynchronised; a concurrent read can observe mismatched content/hash. Use one owning action thread.

**Related entries**

- [`FileHash`](FileHash.md) — lazy/writable cached hash and stale-value rules.
- [`CurrentFileName`](CurrentFileName.md) and [`FileEvent`](FileEvent.md) — separate path/event state.
- [`TvxFileCon`](../../TvxFileCon.md) — reset/lifetime model.

<small>Created 2026-07-15</small>
