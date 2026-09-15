---
title: "DeleteFile"
description: "Deletes a file or symbolic link and reports whether the operating-system operation succeeded."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - delete
  - filesystem
---

```Delphi
Function DeleteFile( const FileName : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DeleteFile('C:\Fictional\completed.tmp');
end;
```

### Usage

`DeleteFile` deletes a file or symbolic link and reports whether the operating-system operation succeeded.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | Path of the file or symbolic link to delete. A relative path is resolved from the Velox process current directory. |

**Returns**

`True` when the operating-system delete succeeds; otherwise `False`. A missing file returns `False`.

**Behaviour**

- A regular file is removed when permissions, attributes, sharing state and the file system allow it.
- A normal directory is not deleted by this function.
- A symbolic link is deleted as a link. Its target is not recursively deleted.
- The function does not prompt, move the file to the Recycle Bin, retry or write a Velox log entry by itself.

**Errors**

Ordinary operating-system deletion failures are returned as `False` rather than raised. Argument-conversion, runtime or unexpected platform failures can still propagate through the normal script exception path.

**Usage notes**

Validate that the path belongs to an approved working area before deleting it. Do not construct deletion paths directly from untrusted file names. If absence is an acceptable final state, treat both a successful delete and a subsequently confirmed absence according to the surrounding process policy rather than assuming `False` means a remaining file.

### Additional Technical Info
`DeleteFile` asks the operating system to permanently remove one named file and returns whether that request succeeded. On Windows it can also remove a symbolic link to a file or directory without deleting the link target.

The example uses a fictional path. It is source-reviewed and was not executed by the documentation workflow. File deletion is irreversible unless another system provides recovery or backup.

**Implementation**

Velox registers the one-parameter `SysUtilsImport.DeleteFile` wrapper, which calls the installed `System.SysUtils.DeleteFile`. On Windows the RTL first calls the Win32 `DeleteFile` API. If that fails and the path identifies a directory symbolic link/reparse point, it calls `RemoveDirectory` to remove the link itself. For other failures it restores the original Win32 last-error value and returns `False`.

**Edge cases and quirks**

- Read-only files, open files with incompatible sharing, access-control restrictions, antivirus activity and remote-share failures commonly produce `False`.
- A prior [`FileExists`](FileExists.md) check does not make deletion safe: another process can create, replace, lock or remove the path between the check and this call.
- A relative path depends on process-global current-directory state. Prefer an approved absolute path in services and concurrent Flows.
- Windows path aliases, junctions and reparse points need careful review. The terminal implementation has special handling for a directory symbolic link, but it is not a recursive directory-deletion API.
- `False` does not identify the reason. The script signature exposes no error-code output.

**Side effects**

The named file-system entry can be permanently removed. Open handles, directory watchers, later Flow steps and external systems can observe the change. No rollback is provided.

**Performance and concurrency**

The call performs one operating-system deletion request, with a second request only for the directory-link fallback. Latency depends on local or remote storage. It provides no locking or coordination with other threads or processes.

**Related entries**

- [`FileExists`](FileExists.md) tests for a non-directory file but cannot prevent a time-of-check/time-of-use race.
- [`RemoveReadOnly`](RemoveReadOnly.md) can clear the read-only attribute before a separately authorised deletion.
- [`vxDeleteFile`](vxDeleteFile.md) is Velox's other exposed delete helper and has its own contract.
- [`WaitForFileLockRelease`](WaitForFileLockRelease.md) waits for a specific lock condition before a later operation.

**External references**

- [Embarcadero `System.SysUtils.DeleteFile`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DeleteFile)
- [Free Pascal `DeleteFile`](https://www.freepascal.org/docs-html/rtl/sysutils/deletefile.html) - compatible success/failure context; Velox uses the installed Delphi/Windows implementation.

<small>Created 2026-07-15</small>
