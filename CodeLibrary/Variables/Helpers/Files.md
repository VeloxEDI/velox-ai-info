---
title: "Files"
description: "Returns the scripter-owned file search and copy/move helper."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - files
---

```Delphi
function Files: TvxScriptFiles;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { No search has been run, so a newly created helper has no results. }
  Value := Files.Count;
end;
```

### Usage

`Files` provides file search, copy and move operations. Call `Search` to begin a directory search, inspect `FileName`, `FileSize`, `FileAttr` and `FileTimeStamp` for the current result, call `Next` to advance, and call `Close` when finished.

The search cursor is reused, so starting another search replaces the previous search state. `CopyFile`, `CopyFiles`, `MoveFile` and `MoveFiles` change the filesystem when called. Reading `Files` alone does not enumerate or change any files and does not represent the action's configured file connection or transport file list.

### Additional Technical Info
`Files` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TvxScriptFiles` |
| Ownership | Scripter-owned |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

Validate and canonicalise configured/untrusted paths, restrict them to approved roots and expect access, sharing, race, long-path and partial-operation failures. Copy/move operations can overwrite or relocate business data according to class behaviour. Never free the helper or share it with asynchronous work.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TvxScriptFiles`](../../Classes/Files/TvxScriptFiles.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- No core Delphi/FPC function is wrapped directly by this accessor; use the Velox class link above as the behavioural contract.

<small>Created 2026-07-15</small>
