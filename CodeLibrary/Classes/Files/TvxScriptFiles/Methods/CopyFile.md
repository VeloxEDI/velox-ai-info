---
title: CopyFile
description: Creates the destination parent if needed, then synchronously copies one file with replacement enabled and returns the Windows success flag.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, copy, overwrite, windows]
---

```Delphi
function CopyFile(const aSourceFile, aDestinationFile: string): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Fictional staging paths: the destination may be replaced. }
  Value := Files.CopyFile(
    'C:\VeloxExamples\Inbound\sample.csv',
    'C:\VeloxExamples\Working\sample.csv');
end;
```

### Usage

`CopyFile` creates the destination parent if needed, then synchronously copies one file with replacement enabled and returns the Windows success flag.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSourceFile` | `string` | Existing source file path visible to the Velox host identity. No wildcard expansion is performed. |
| `aDestinationFile` | `string` | Complete destination filename. It must contain a directory component; missing parent directories are created recursively. |

**Returns**

Returns `True` when Windows `CopyFileExW` reports success and `False` when that API reports failure. The method does not convert a Velox copy failure into an exception and does not expose the associated OS error code.

Directory validation/creation is different: it can raise before the Boolean result is produced.

**Behaviour**

The copy runs under the Windows account hosting the script and blocks until the API returns. Windows copies file data and, where supported, attributes, security resource properties, extended attributes, structured storage and alternate data streams. The source remains in place.

The method does not modify the helper's search cursor. It does not verify a checksum, compare timestamps, stage to a temporary name, fsync through a separate durability option, or record a business transaction.

**Errors**

- `ForceDirectories('')` raises for a bare destination.
- Failure to create a required parent raises Velox's explicit “destination folder ... could not be created” exception.
- Velox copy failures return `False`, including missing source, access/sharing failure, unsupported path or encryption errors. Check the result; an unchecked call can silently leave the intended delivery incomplete.

### Additional Technical Info
`CopyFile` synchronously copies one source path to one destination path and allows an existing destination file to be replaced.

**Implementation**

Velox calls Delphi `ExtractFilePath(aDestinationFile)`. If that parent does not exist, it calls `ForceDirectories`. It then delegates to a wrapper around:

```Delphi
CopyFileExW(Source, Destination, nil, nil, @CancelFalse, 0)
```

There is no progress callback, no external cancellation, no fail-if-exists flag and no copy-symlink flag. Flag value zero permits replacement of an existing destination under the standard Windows rules.

**Edge cases and quirks**

- A bare destination such as `copy.csv` produces `ExtractFilePath = ''`. `DirectoryExists('')` is false and Delphi `ForceDirectories('')` raises `EInOutError`; the Windows copy is never attempted. Use `.\copy.csv` or a fully qualified path if the current directory is intentional.
- Existing hidden or read-only destination files can make `CopyFileExW` fail with access denied even though replacement is otherwise enabled.
- Relative paths depend on the Velox process current directory, which can differ between Designer and service hosts.
- A symbolic-link source follows default Windows `CopyFileExW` behavior because Velox does not request `COPY_FILE_COPY_SYMLINK`.
- Source/destination races, sharing locks, path-length policy, remote-share availability, encryption and permissions can change between checks and the copy.

**Side effects**

Missing destination directories can be created, including before a later source-copy failure. The destination file is created or replaced. Velox implements no rollback, cleanup or guarantee that a failed call leaves a pre-existing destination unchanged; reconcile the destination before retrying.

**Performance and concurrency**

Copying is synchronous and generally `O(file size)`. There is no progress, timeout, retry or lock in Velox. Concurrent writers/readers and another copy to the same destination can produce OS-dependent races. Use unique staging names and an idempotent promotion design when integrity matters.

**Related entries**

- [`CopyFiles`](CopyFiles.md) repeats the same Windows copy wrapper for every non-directory wildcard match.
- [`MoveFile`](MoveFile.md) requests replacement and can use cross-volume copy/delete semantics.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.ExtractFilePath`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFilePath)
- [Embarcadero DocWiki: `System.SysUtils.DirectoryExists`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DirectoryExists)
- [Embarcadero DocWiki: `System.SysUtils.ForceDirectories`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: `ExtractFilePath`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilepath.html)
- [Free Pascal: `DirectoryExists`](https://www.freepascal.org/docs-html/rtl/sysutils/directoryexists.html)
- [Free Pascal: `ForceDirectories`](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html)
- [Microsoft Learn: `CopyFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-copyfileexw)

<small>Created 2026-07-15</small>
