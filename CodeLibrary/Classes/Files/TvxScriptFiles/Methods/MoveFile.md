---
title: MoveFile
description: Creates the destination parent, then moves one path with replacement and cross-volume copy/delete enabled, returning the Windows success flag.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, move, replace, cross-volume]
---

```Delphi
function MoveFile(const aSourceFile, aDestinationFile: string): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Fictional staging paths: the destination may be replaced. }
  Value := Files.MoveFile(
    'C:\VeloxExamples\Working\sample.csv',
    'C:\VeloxExamples\Archive\sample.csv');
end;
```

### Usage

`MoveFile` creates the destination parent, then moves one path with replacement and cross-volume copy/delete enabled, returning the Windows success flag.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSourceFile` | `string` | Existing source file/path visible to the Velox host identity. No wildcard expansion is performed. |
| `aDestinationFile` | `string` | Complete destination filename/path. It must contain a directory component; missing parents are created. |

**Returns**

Returns the Boolean from Windows `MoveFileExW`. `False` reports a Velox failure without raising it or exposing the OS code. `True` means Windows accepted/completed the requested move under its flag semantics; for a cross-volume move, it does not necessarily prove that the source was deleted.

**Behaviour**

On the same volume, Windows normally performs a rename/move. If the destination exists and access-control rules permit, its contents are replaced. Across volumes, `MOVEFILE_COPY_ALLOWED` permits Windows to simulate a file move using copy and delete.

The method operates under the current Velox Windows identity and does not change the helper's search cursor. Although Windows `MoveFileExW` also accepts directories, use this scripting method for files; directory moves have different cross-volume constraints and are not validated by Velox.

**Errors**

Parent-path extraction/creation can raise as described for `CopyFile`. Velox move failures return `False` and must be checked. A false result does not prove that no partial cross-volume copy exists, so reconcile both paths before retrying.

### Additional Technical Info
`MoveFile` synchronously renames/moves one source path to one destination and requests replacement of an existing destination file.

**Implementation**

Velox extracts and creates the destination parent in the same way as [`CopyFile`](CopyFile.md), then calls its `MoveFileExW` wrapper with:

```Delphi
MOVEFILE_COPY_ALLOWED or MOVEFILE_REPLACE_EXISTING
```

`MOVEFILE_WRITE_THROUGH` is deliberately omitted because of its performance cost.

**Edge cases and quirks**

- A bare destination filename causes `ForceDirectories('')` to raise before Windows is called. Include `.\` or a full parent deliberately.
- On a cross-volume operation, Windows can return success after the copy even if deletion of the source fails. Both source and destination then remain.
- Cross-volume moves do not preserve the source security descriptor; the destination receives the destination directory's default security descriptor.
- Because write-through is absent, success is not an additional Velox guarantee that all storage caches were flushed.
- Existing destination directories are not replaceable as files. Sharing, delete permission, link tracking, remote shares, long paths and races remain Windows-dependent.

**Side effects**

Destination directories can be created, an existing destination file can be replaced, and the source can be renamed or deleted. The operation is outside any Velox database transaction and has no rollback.

**Performance and concurrency**

Same-volume renames are usually metadata operations; cross-volume moves copy all file data and then delete, blocking proportionally to size. There is no timeout, progress, retry, lock or checksum. Coordinate competing writers and design retries so duplicate source/destination states are safe.

**Related entries**

- [`MoveFiles`](MoveFiles.md) applies the same flags to all non-directory wildcard matches.
- [`CopyFile`](CopyFile.md) preserves the source and uses `CopyFileExW` flag zero.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.ExtractFilePath`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFilePath)
- [Embarcadero DocWiki: `System.SysUtils.DirectoryExists`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DirectoryExists)
- [Embarcadero DocWiki: `System.SysUtils.ForceDirectories`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: `ExtractFilePath`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilepath.html)
- [Free Pascal: `DirectoryExists`](https://www.freepascal.org/docs-html/rtl/sysutils/directoryexists.html)
- [Free Pascal: `ForceDirectories`](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html)
- [Microsoft Learn: `MoveFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexw)

<small>Created 2026-07-15</small>
