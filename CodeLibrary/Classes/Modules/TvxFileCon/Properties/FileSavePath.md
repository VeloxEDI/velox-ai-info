---
title: FileSavePath
description: Generates and stores a full output path from FileDir, FileName, counters, data/general tags and uniqueness policy.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, save-path, counter, filename]
---

```Delphi
property FileSavePath: String read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  { Reading advances counters and changes CurrentFileName. }
  if FileCon <> nil then
    Value := FileCon.FileSavePath
  else
    Value := '';
end;
```

### Usage

`FileSavePath` generates and stores a full output path from FileDir, FileName, counters, data/general tags and uniqueness policy.

**Processing sequence**

1. Advance the separate `<COUNTER>` value. When persisted counter mode is enabled, Velox code updates/selects `COUNTER` on the **default File Connection module GUID**, not the current module FID; otherwise it increments this object's in-memory counter.
2. Resolve [`ProcessFileDir`](../Methods/ProcessFileDir.md).
3. Resolve configured FileName through [`ProcessFileName`](../Methods/ProcessFileName.md), which can independently consume FileNo, definition record data and action/system tags and apply safe-filename conversion.
4. Concatenate directory and name.
5. When Velox unique-name mode is enabled (new-module default), add a GUID suffix only if a file already exists at the candidate path.
6. Store/return the final candidate as CurrentFileName.

### Additional Technical Info
`FileSavePath` generates the next configured full output path and stores it as [`CurrentFileName`](CurrentFileName.md). Reading it is stateful; it is intended immediately before saving.

**Errors and side effects**

The getter catches exceptions, logs a configuration error and returns empty. Counter/FileNo/tag side effects that happened before the exception are not rolled back. CurrentFileName is assigned only after successful generation, so an error can leave its previous value intact.

The getter does not create the directory, create/write/reserve the file, verify access or guarantee collision freedom. Unique selection is a check-then-use race. An empty FileName can produce a directory-only or invalid candidate depending on configuration.

**Counter/concurrency quirks**

- Persisted counter mode operates on the default File Connection counter row for every FileCon, so it is shared/global by implementation rather than per current module.
- In-memory counter starts at construction and is not reset by FileCon Reset; repeated reads consume values even if no file is saved.
- Concurrent generation can race counters, record positions, uniqueness and CurrentFileName.

**Security and performance**

Data/general tags can disclose secrets or introduce untrusted name text; safe-name conversion is not root authorisation. Persisted-counter mode performs VxConfig I/O and repeated unique checks touch the filesystem.

**Related entries**

- [`FileSaveName`](FileSaveName.md) — FilePattern-based standalone alternative.
- [`FileNo`](FileNo.md) and [`ProcessFileName`](../Methods/ProcessFileName.md) — separate `<FILENO>` state.
- [`CurrentFileName`](CurrentFileName.md) — assigned final candidate.

<small>Created 2026-07-15</small>
