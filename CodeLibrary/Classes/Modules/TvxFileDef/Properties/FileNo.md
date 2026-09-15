---
title: FileNo
description: Returns the current File Definition sequence value and increments it on every read, or directly replaces the next value.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-definition, file-number, stateful-getter]
---

```Delphi
property FileNo: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Source <> nil then
    Value := Source.FileNo  { This read consumes the returned number. }
  else
    Value := -1;
end;
```

### Usage

`FileNo` returns the current File Definition sequence value and increments it on every read, or directly replaces the next value.

**Important semantics**

- Merely inspecting, logging or returning FileNo consumes a value.
- Current Velox FileDef/file-engine source has no other consumer of this counter; it is exposed for scripting but is not automatically advanced per loaded/saved file or record.
- It is independent of [`TvxFileCon.FileNo`](../../TvxFileCon/Properties/FileNo.md), which is consumed by FileCon's `<FILENO>` filename processing.
- Assignments, unused reads and resets can create gaps or repeated values.
- It is not durable, globally unique or proof that any file operation succeeded.
- Normal Integer range/overflow behaviour is not guarded.

### Additional Technical Info
`FileNo` is a mutable per-FileDef integer sequence.

The getter returns the current backing value and immediately increments it. Reset sets the next value to 1. The setter directly replaces the next value without validation, persistence, logging or overflow handling.

**Lifecycle and concurrency**

The sequence belongs to the active FileDef execution instance and is reset with that object. FileDef transfer does not copy its current runtime FileNo. Access is unsynchronised; concurrent readers can race and lose deterministic ordering.

**Related entries**

- [`TvxFileDef`](../../TvxFileDef.md) — object ownership and reset lifecycle.
- [`TvxFileCon.FileNo`](../../TvxFileCon/Properties/FileNo.md) — distinct filename-template sequence.

<small>Created 2026-07-15</small>
