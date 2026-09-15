---
title: "vxDeleteFile"
description: "Deletes a file through Windows and raises a Velox operating-system error instead of returning false."
sidebar_position: 52
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - delete
  - windows
---

```Delphi
Function vxDeleteFile( aFileName : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Destructive: the path is fictional and the example was not executed.
  Value := vxDeleteFile('C:\Fictional\Archive\processed.tmp');
end;
```

### Usage

`vxDeleteFile` deletes a file through Windows and raises a Velox operating-system error instead of returning false.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string` | Literal file path to delete. Directories require a different operation. |

**Returns**

`True` on normal return. Failure raises before the false value can be observed.

**Behaviour**

- Removes the directory entry immediately or marks it for deletion until compatible open handles close.
- Deletes a symbolic link itself rather than the link target.
- Does not delete a normal directory or recursively delete content.
- Provides no recycle-bin, undo or confirmation step.

**Errors**

All ordinary Win32 false results raise `EvxOSError` through Velox's error function. The message includes the supplied path. It normally includes a system code/text, but formatting occurs before last-error capture and can make that detail generic, stale or unrelated to the original `DeleteFileW` failure.

**Usage notes**

Use `try..except` for failure handling and perform governed logging before deletion. Do not write logic that expects `if not vxDeleteFile(...)` to handle ordinary failure—the exception occurs first.

### Additional Technical Info
`vxDeleteFile` calls Windows `DeleteFileW`. Success returns `True`; any false operating-system result immediately raises a Velox operating-system exception, so the declared function does not normally return `False`.

The example is fictional and source-reviewed. A real call permanently deletes or marks a file for deletion.

**Implementation**

Velox assigns the Boolean result of `Winapi.Windows.DeleteFileW(PChar(aFileName))`. When false, it constructs `Unable to delete file "<path>"` through the locale-aware `vxFormat`, then calls its `RaiseLastOSError` overload.

The wrapper does not save `GetLastError` immediately after `DeleteFileW`. Locale/format work happens before `RaiseLastOSError` reads the thread value, so the resulting `EvxOSError.ErrorCode`/system text can theoretically be cleared or replaced by intervening work. The path/context remains useful, but do not rely on the attached code as guaranteed to be the original deletion error.

**Edge cases and quirks**

- Missing paths, read-only attributes, denied delete permission and handles opened without delete sharing cause an exception; the attached last-error detail has the capture caveat above.
- Removing read-only may be necessary, but [`RemoveReadOnly`](RemoveReadOnly.md) resets more than that one bit.
- A successful delete can coexist briefly with open handles that allowed deletion; actual storage reclamation may be delayed.
- Relative paths depend on the process current directory, and a preflight existence check cannot remove the race.
- Link/reparse and root-containment policy must be validated before calling with untrusted input.

**Side effects**

Irreversibly deletes or schedules deletion of one file-system entry.

**Performance and concurrency**

One synchronous metadata operation, potentially remote. Open-handle sharing and concurrent rename/delete/create operations determine the result; no retry is performed.

**Related entries**

- [`DeleteFile`](DeleteFile.md) returns a Boolean instead of adding the Velox exception wrapper.
- [`PurgeFiles`](PurgeFiles.md) deletes a wildcard-selected set with different error/count semantics.
- [`RemoveReadOnly`](RemoveReadOnly.md) changes attributes but has broad reset behavior.

**External references**

- [Microsoft `DeleteFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-deletefilew) - exact operating-system terminal and deletion/link/sharing constraints.

No applicable same-symbol Delphi or Free Pascal core routine is called; this wrapper deliberately uses Win32 directly.

<small>Created 2026-07-15</small>
