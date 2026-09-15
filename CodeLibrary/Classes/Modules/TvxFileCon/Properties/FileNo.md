---
title: FileNo
description: Returns the current per-reset file number and increments it on every read, or directly replaces the next value.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, file-number, counter, stateful-getter]
---

```Delphi
property FileNo: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.FileNo  { Reading consumes this number. }
  else
    Value := -1;
end;
```

### Usage

`FileNo` returns the current per-reset file number and increments it on every read, or directly replaces the next value.

**Important semantics**

- Merely inspecting/logging/returning FileNo consumes a number.
- [`ProcessFileName`](../Methods/ProcessFileName.md) reads it only when `<FILENO>` exists; all occurrences in that one template receive the same value from one getter call.
- Gaps and duplicates are possible after unused evaluations, resets or script assignments.
- This is distinct from the separate FileSavePath counter (`<COUNTER>`), which can be local or shared/database-backed.
- It is not a file count, database sequence, durable unique identifier or proof that a file was saved.
- Normal Integer overflow/range behaviour is not guarded.

### Additional Technical Info
`FileNo` is a stateful per-FileCon sequence used by `<FILENO>` filename expansion.

The getter returns the backing integer and immediately increments it. Reset sets the next value to 1. The setter directly replaces the next value without validation, logging or persistence.

**Performance and concurrency**

Access is cheap but unsynchronised; concurrent readers can race/lose sequence integrity. Treat each read as a state mutation in one action thread.

**Related entries**

- [`ProcessFileName`](../Methods/ProcessFileName.md) — `<FILENO>` consumption order.
- [`FileSavePath`](FileSavePath.md) — distinct counter and output-path generation.

<small>Created 2026-07-15</small>
