---
title: MoveFiles
description: Moves every non-directory wildcard match between folders with replacement and cross-volume fallback, no recursion or rollback, and zero-match success.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, batch, move, wildcard]
---

```Delphi
function MoveFiles(const aSourcePath, aSearchMask, aDestinationPath: string): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  try
    { Fictional staging folders: matching destination files may be replaced. }
    Value := Files.MoveFiles(
      'C:\VeloxExamples\Working',
      '*.csv',
      'C:\VeloxExamples\Archive');
  finally
    { Also closes the handle when an item move raises. }
    Files.Close;
  end;
end;
```

### Usage

`MoveFiles` moves every non-directory wildcard match between folders with replacement and cross-volume fallback, no recursion or rollback, and zero-match success.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSourcePath` | `string` | Source folder. Velox adds a trailing delimiter and enumerates only this folder. |
| `aSearchMask` | `string` | Windows filename-only wildcard mask; no recursion or regular-expression interpretation. Do not include a directory component. |
| `aDestinationPath` | `string` | Destination folder. Velox adds a trailing delimiter and creates missing parents. |

**Returns**

Returns `True` when the loop reaches normal completion, including zero matches or an initial enumeration error. It does not return the number moved. A Velox item failure raises `EvxOSError` instead of returning `False`.

For cross-volume files, Windows can return success after copying even when it cannot delete the original; `True` therefore does not guarantee that every source path disappeared.

**Errors**

- Missing/inaccessible source and uncreatable destination folders raise explicit Velox exceptions.
- The first false `MoveFileExW` raises `EvxOSError`; earlier moves remain.
- Initial and `Next` enumeration errors are swallowed into a normal-looking end condition.
- Cross-volume partial outcomes require checking both source and destination before retry.

**Usage notes**

Treat the result as completion of the function loop, not business-delivery acknowledgement. Reconcile expected inputs, destination outputs and residual source files. Use unique/idempotent names and call `Close` in `finally` so exception paths do not retain the cursor handle.

### Additional Technical Info
`MoveFiles` synchronously moves the non-directory entries matching one Windows wildcard mask from one folder to another.

**Implementation**

After directory validation/creation, Velox searches with `faAnyFile`. It skips `.`/`..` and entries whose attributes contain `faDirectory`. Every other current name is passed to `MoveFileExW` with:

```Delphi
MOVEFILE_COPY_ALLOWED or MOVEFILE_REPLACE_EXISTING
```

The first false result is converted immediately into an `EvxOSError` with the Windows last-error code. Otherwise the cursor advances. On normal completion, Velox explicitly calls `Close` and returns true.

There is no implementation-level `try..finally`: an exception exits before that normal close, which is why the example still closes in caller `finally`.

**Behaviour**

The method is top-level and non-recursive. It preserves each base name and can replace an existing destination. Same-volume items are normally renamed; cross-volume items can be copied then deleted. Moves are sequential and immediately visible.

This is not a transaction. If item three fails, items one and two remain moved. A retry sees a changed source set and can encounter destination files from the previous attempt.

**Edge cases and quirks**

- Empty folder arguments normalize to the current-drive root. Validate them before entry.
- `DirectoryExists` success does not guarantee enumeration access. A failed `FindFirst` looks like zero matches and returns `True`.
- A directory-bearing mask can enumerate a nested entry, but the move source is rebuilt as `aSourcePath + base FileName`. This can move a same-named root file or raise for a missing root file instead of moving the matched nested entry.
- Zero matches return `True`, so success does not prove that any configured input arrived.
- Continuation enumeration errors also end the loop without an item exception and can yield `True` after only a prefix was moved.
- Cross-volume success can leave both source and destination if deletion fails, and destination security inherits from the destination directory rather than preserving the source descriptor.
- Write-through is omitted. There is no additional durability flush guarantee from Velox.
- Directories, including directory reparse entries carrying `faDirectory`, are skipped rather than moved recursively.
- The helper's previous manual search is replaced. Normal completion leaves it closed/false; exceptional completion leaves the failed search open until caller cleanup.

**Side effects**

The destination directory can be created, existing destination files can be replaced, and zero or more source files can be renamed/deleted. Search state is replaced. No Velox database rollback reverses these filesystem changes.

**Performance and concurrency**

Same-volume moves are commonly fast metadata changes; cross-volume moves block while all bytes are copied and deletion is attempted. There is no timeout, progress, cancellation, retry, checksum or synchronization. Files can be opened/changed by other processes between enumeration and move.

**Related entries**

- [`MoveFile`](MoveFile.md) exposes the single-item Boolean result using the same flags.
- [`CopyFiles`](CopyFiles.md) preserves sources but fails to close on its normal path.
- [`Search`](Search.md) documents the enumeration/error semantics inherited by this method.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.DirectoryExists`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DirectoryExists)
- [Embarcadero DocWiki: `System.SysUtils.ForceDirectories`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Embarcadero DocWiki: `System.SysUtils.FindFirst`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindFirst)
- [Free Pascal: `DirectoryExists`](https://www.freepascal.org/docs-html/rtl/sysutils/directoryexists.html)
- [Free Pascal: `ForceDirectories`](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html)
- [Free Pascal: `FindFirst`](https://www.freepascal.org/docs-html/rtl/sysutils/findfirst.html)
- [Microsoft Learn: `MoveFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexw)
- [Microsoft Learn: `FindNextFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-findnextfilew)

<small>Created 2026-07-15</small>
