---
title: NewFileName
description: Gets or sets the pending tag-capable fallback name consumed by selected copy, move and routing paths.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, rename, pending-state, tags]
---

```Delphi
property NewFileName: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
  begin
    FileCon.NewFileName := 'routed-<YYYY><MM><DD>.xml';
    Value := FileCon.NewFileName;
  end;
end;
```

### Usage

`NewFileName` gets or sets the pending tag-capable fallback name consumed by selected copy, move and routing paths.

### Additional Technical Info
`NewFileName` is a pending optional rename used when `CopyFile`, `CopyFileFrom` or `MoveFile` receives an empty explicit destination name.

The script property directly reads/writes the stored string. Reading it through this property does **not** clear it. Reset clears it.

**Consumption**

When an applicable copy/move method needs the fallback, it processes general/action-local tags, extracts only the basename and clears NewFileName before filesystem work. Failure does not restore it. An explicit nonempty method `aDestName` takes precedence and leaves the pending value untouched for a later operation.

The native action file-router uses a separate `GetNewFileName` helper that returns and clears the value immediately before passing it to `CopyFileFrom`.

**Limitations and risks**

- Assignment does not rename/move/copy, update CurrentFileName or persist configuration.
- The copy/move fallback is not passed through ProcessFileName safe-name handling; tag output can still contain invalid filename characters after basename extraction.
- General tag expansion can vary, expose secrets or raise; consumption happens before later I/O success.
- Stale pending state can unexpectedly rename a later operation, while explicit-name calls do not consume it.
- Concurrent users can overwrite/consume each other's pending name.

**Related entries**

- [`CopyFile`](../Methods/CopyFile.md), [`CopyFileFrom`](../Methods/CopyFileFrom.md) and [`MoveFile`](../Methods/MoveFile.md) — precedence/consumption/failure contracts.
- [`ProcessFileName`](../Methods/ProcessFileName.md) — different safe/counter/data-aware pipeline.

<small>Created 2026-07-15</small>
