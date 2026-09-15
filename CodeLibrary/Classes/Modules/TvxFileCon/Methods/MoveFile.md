---
title: MoveFile
description: Moves the current FileCon file to a destination and then updates current-path and audit-routing state.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, move-file, filesystem, routing]
---

```Delphi
function MoveFile(const aDestPath: String; aDestName: String): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  { Effectful example: moving removes the source name. }
  if FileCon <> nil then
    if FileCon.CurrentFileName <> '' then
      Value := FileCon.MoveFile('C:\Velox\Routed', '')
    else
      Value := False
  else
    Value := False;
end;
```

### Usage

`MoveFile` moves the current FileCon file to a destination and then updates current-path and audit-routing state.

**Critical post-attempt mutation**

After attempting the move, Velox always:

- assigns `CurrentFileName` to the chosen destination; and
- sets `DoMoveToAudit := False`.

Those mutations occur even when lock waiting timed out or `MoveFileEx` failed. The source file may still exist while the object now points at the destination and automatic audit has been disabled. The pending NewFileName is also already consumed when that branch was used.

`True` is not proof of movement for the early no-op case, and file movement is not rolled back with later action/database failure. Unique selection is a check-then-move race.

**Security and concurrency**

Explicit names are not sanitised/tagged/root-restricted. Cross-volume moves may copy then delete under Windows semantics and can be slow or partially exposed to external observers. Use trusted roots, one action thread and explicit postconditions where correctness is critical.

### Additional Technical Info
`MoveFile` moves [`CurrentFileName`](../Properties/CurrentFileName.md) to `aDestPath`, using optional naming and overwrite/uniqueness policy.

**Name, directory and Windows flags**

Name precedence is explicit `aDestName`, otherwise tag-processed/consumed [`NewFileName`](../Properties/NewFileName.md), otherwise current basename. Only the pending-name branch extracts a basename. The destination directory is created if necessary.

Velox waits up to 30 seconds for the source lock, then calls Windows `MoveFileEx` with `MOVEFILE_COPY_ALLOWED`. If the non-script-visible unique option is false it also enables replacement; otherwise it selects a GUID-suffixed free name. `MOVEFILE_WRITE_THROUGH` is deliberately not used.

**Result and failure handling**

Filesystem errors are caught/logged and the method returns shared `Log.Status`. If log status was already false/cancelled, it exits with initial result `True` and does no work.

**Related entries**

- [`CopyFile`](CopyFile.md) and [`CopyFileFrom`](CopyFileFrom.md) — non-removing alternatives.
- [`DoMoveToAudit`](../Properties/DoMoveToAudit.md) — latch disabled after every attempted move.
- [`CurrentFileName`](../Properties/CurrentFileName.md) — updated even on failed attempts.

**External references**

- [Microsoft Learn: `MoveFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexw)

<small>Created 2026-07-15</small>
