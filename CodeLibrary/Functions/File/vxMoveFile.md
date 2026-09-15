---
title: "vxMoveFile"
description: "Moves a file or directory with caller-supplied Windows MoveFileEx flags and returns the operating-system result."
sidebar_position: 54
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - move
  - windows
  - flags
---

```Delphi
Function vxMoveFile( aSourceFile, aDestFile : string; aMoveFlags : Word): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // 3 = MOVEFILE_REPLACE_EXISTING (1) or MOVEFILE_COPY_ALLOWED (2).
  Value := vxMoveFile('C:\Fictional\Inbound\order.xml',
    'D:\Fictional\Archive\order.xml', 3);
end;
```

### Usage

`vxMoveFile` moves a file or directory with caller-supplied Windows MoveFileEx flags and returns the operating-system result.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSourceFile` | `string` | Existing source file or directory path. |
| `aDestFile` | `string` | Destination path. Despite the names, Windows permits directories subject to flag/volume rules. |
| `aMoveFlags` | `Word` | Bitwise combination of supported Windows values from the table below. |

**Returns**

`True` when `MoveFileExW` accepts/completes the requested operation according to its flags; `False` on immediate failure. For delayed operations, `True` means registry scheduling succeeded, not that the later reboot move will succeed.

**Errors**

Ordinary failures return `False` without last-error detail. A false result can occur after partial storage effects in multi-step/filesystem scenarios; inspect both paths according to policy.

**Usage notes**

Choose flags explicitly, check the Boolean, and verify source/destination state after cross-volume or failure outcomes. Avoid delayed reboot from scripts unless it is an approved privileged operational design.

### Additional Technical Info
`vxMoveFile` passes two paths and caller-supplied numeric flags directly to Windows `MoveFileExW`. It returns the Windows Boolean and does not raise or expose the last-error code for ordinary failure.

The example is fictional, source-reviewed and was not executed by the documentation workflow. A real call moves/replaces data and can cross volumes because flag `2` is included.

**Flag values**

| Value | Windows flag | Effect |
|---:|---|---|
| `0` | none | Rename/move now; destination must not already exist and cross-volume file moves fail. |
| `1` | `MOVEFILE_REPLACE_EXISTING` | Replace an existing destination file when ACL/security requirements allow; cannot replace a directory. |
| `2` | `MOVEFILE_COPY_ALLOWED` | Permit a cross-volume file move by copy/delete; cannot combine with delayed reboot. |
| `4` | `MOVEFILE_DELAY_UNTIL_REBOOT` | Register the operation for reboot; requires administrator/LocalSystem context and local paths. |
| `8` | `MOVEFILE_WRITE_THROUGH` | Do not return until a copy/delete move is flushed; no effect with delayed reboot. |
| `16` | `MOVEFILE_CREATE_HARDLINK` | Reserved by Windows for future use; do not use. |
| `32` | `MOVEFILE_FAIL_IF_NOT_TRACKABLE` | Fail when a moved link source cannot continue to be tracked. |

Combine usable values with addition/bitwise OR, such as `3` for replace plus cross-volume copy.

**Implementation**

The script `Word` is passed to Win32's `DWORD dwFlags`; only the low 16 bits are expressible. Velox adds no validation, path creation, logging, retry, exception or error-code adapter.

**Behaviour and quirks**

- Same-volume moves are normally renames and can include directories.
- Cross-volume directories are unsupported. Cross-volume files require flag `2` and are simulated by copy then delete.
- With `MOVEFILE_COPY_ALLOWED`, Windows can return success after a successful copy even when source deletion fails, leaving both source and destination.
- Cross-volume copy does not carry the source security descriptor; the destination receives its directory's default security descriptor.
- Replacement, sharing, permissions, open handles, links and network capabilities follow Windows.
- Delayed reboot cannot use a remote source, cannot combine with flag `2`, stores a privileged pending operation in the registry, and reports scheduling rather than eventual execution.
- Relative paths use the process current directory. Parent directories are not created.

**Side effects**

Can rename, replace, copy/delete or schedule a reboot-time move. There is no transaction or rollback.

**Performance and concurrency**

Same-volume rename is usually metadata-only; cross-volume moves copy all data and can block. Flag `8` adds flush latency. Concurrent changes and destination races are governed only by Windows.

**Related entries**

- [`vxCopyFile`](vxCopyFile.md) copies without deleting the source or exposing flags.
- [`vxDeleteFile`](vxDeleteFile.md) deletes one file and raises on failure.
- [`CheckFolder`](CheckFolder.md) can create a destination parent before the move.

**External references**

- [Microsoft `MoveFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexw) - exact terminal, flag values and cross-volume/reboot/security behavior.

No applicable same-symbol Delphi or Free Pascal core routine is called; Velox invokes the Windows API directly.

<small>Created 2026-07-15</small>
