---
title: CopyFiles
description: Copies every non-directory wildcard match between two folders with replacement enabled, no recursion or rollback, and zero-match success.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, batch, copy, wildcard]
---

```Delphi
function CopyFiles(const aSourcePath, aSearchMask, aDestinationPath: string): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  try
    { Fictional staging folders: matching destination files may be replaced. }
    Value := Files.CopyFiles(
      'C:\VeloxExamples\Inbound',
      '*.csv',
      'C:\VeloxExamples\Working');
  finally
    { CopyFiles leaves its successful enumeration handle open. }
    Files.Close;
  end;
end;
```

### Usage

`CopyFiles` copies every non-directory wildcard match between two folders with replacement enabled, no recursion or rollback, and zero-match success.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSourcePath` | `string` | Source folder. Velox adds a trailing delimiter; matching is limited to this folder. |
| `aSearchMask` | `string` | Windows filename-only mask such as `*.csv`; no regular-expression or recursive `**` semantics. Do not include a directory component. |
| `aDestinationPath` | `string` | Destination folder. Velox adds a trailing delimiter and recursively creates it when missing. |

**Returns**

Returns `True` after the enumeration loop completes. This includes the case where no entry matches and the case where the initial `FindFirst` fails for access, invalid-pattern/path or other reasons after the source directory check. `False` is assigned initially but is not a normal returned failure state because item-copy failures raise instead.

**Behaviour**

Only the top-level matches are copied; directories are never traversed. Each destination keeps the source base name. Existing destination files can be replaced. Processing order is the filesystem enumeration order and is not guaranteed.

The operation is not atomic as a group. Each successful copy is externally visible before the next starts. A caller that retries after failure can recopy/replace the earlier subset.

**Usage notes**

Use a dedicated approved staging destination, call `Close` in `finally`, and verify an expected file count/content in the surrounding process when “at least one copy” or completeness matters. Design retries as idempotent because partial replacement is expected on failure.

### Additional Technical Info
`CopyFiles` synchronously copies the non-directory entries matching one Windows wildcard mask from one folder to another.

**Implementation**

Velox normalizes both folder strings with `IncludeTrailingPathDelimiter`. It requires `DirectoryExists(source)`, creates a missing destination with `ForceDirectories`, then calls the same object's `Search(source, mask, faAnyFile)`.

For each current entry, it skips names `.` and `..` and skips any record with the `faDirectory` bit. Every other entry is copied as:

```Delphi
CopyFileExW(source + FileName, destination + FileName, ..., flags = 0)
```

If Windows returns false, Velox immediately raises an `EvxOSError` containing the source/destination text, numeric last-error code and system message. Otherwise it calls `Next`. On loop completion it sets the result true.

Unlike `MoveFiles`, the successful path does **not** call `Close`.

**Edge cases and quirks**

- `aSourcePath = ''` and `aDestinationPath = ''` each normalize to root-relative `\`, referring to the current drive root. Reject empty/untrusted paths before calling.
- A source directory can pass `DirectoryExists` and still fail to enumerate; that failure becomes a successful zero-item result.
- If the mask contains a directory component, `Search` can match a nested entry but the copy path is still built as `aSourcePath + base FileName`. Velox can therefore copy a same-named file from the source root or raise for a missing root file instead of copying the matched nested file.
- Zero matches return `True`; there is no returned count proving that any file was copied.
- The helper's previous manual search is closed/replaced. On success `Exists` is false but the enumeration handle remains open until `Close`, another `Search`, `Count` or destruction.
- On an item exception there is no `finally` in the implementation, so the handle also remains open and the cursor remains at the failed entry until caller cleanup.
- File symlinks/reparse entries that are not directories are passed to `CopyFileExW` without `COPY_FILE_COPY_SYMLINK`; default Windows behavior applies.
- If source and destination resolve to the same folder/name, the first item normally fails and raises; Velox performs no same-path precheck.

**Side effects**

The destination folder can be created. Zero or more destination files can be created/replaced. The helper's search state is overwritten and the handle can remain open. Source files remain in place.

**Errors**

- Missing source folder raises Velox's explicit “source folder ... does not exist” exception; inaccessible can be reported the same way.
- Destination creation failure raises an explicit exception.
- The first native copy failure raises `EvxOSError`; previously copied files are not removed or restored.
- Initial/continuation enumeration errors are collapsed, so the method can return `True` with no or only a partial set if `FindNext` fails independently of a copy.

**Performance and concurrency**

The method blocks and copies files sequentially, with work proportional to total copied bytes. It has no progress callback, timeout, cancellation, retry, checksum or synchronization. Files can change between enumeration and copy. Concurrent bulk/manual operations on the same helper corrupt its shared cursor contract.

**Related entries**

- [`CopyFile`](CopyFile.md) returns a Boolean instead of raising for a single native copy failure.
- [`MoveFiles`](MoveFiles.md) uses the same enumeration/filter but moves and closes on normal completion.
- [`Count`](../Properties/Count.md) can pre-count a search but is not a transaction guarantee.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.DirectoryExists`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DirectoryExists)
- [Embarcadero DocWiki: `System.SysUtils.ForceDirectories`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Embarcadero DocWiki: `System.SysUtils.FindFirst`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindFirst)
- [Free Pascal: `DirectoryExists`](https://www.freepascal.org/docs-html/rtl/sysutils/directoryexists.html)
- [Free Pascal: `ForceDirectories`](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html)
- [Free Pascal: `FindFirst`](https://www.freepascal.org/docs-html/rtl/sysutils/findfirst.html)
- [Microsoft Learn: `CopyFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-copyfileexw)
- [Microsoft Learn: `FindNextFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-findnextfilew)

<small>Created 2026-07-15</small>
