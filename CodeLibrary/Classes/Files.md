---
title: Files
description: Classes for stateful file enumeration and synchronous copy or move operations under the Velox process identity.
sidebar_position: 5
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, classes, files, filesystem, search]
---

The Files branch contains the object used by Velox scripts to enumerate directory entries and to copy or move files. Most scripts should obtain it through the host-provided [`Files`](../Variables/Helpers/Files.md) helper; the application owns that object and reuses its mutable search state for the current scripter. A script can also call the inherited `TvxScriptFiles.Create`; that separate instance is caller-owned and must be freed.

## Common tasks

- Start a wildcard enumeration with `Files.Search`, inspect the current entry through `Exists`, `FileName`, `FileSize`, `FileAttr` and `FileTimeStamp`, and advance with `Next`.
- Collect the remaining base names into a supplied string list with `GetFilenames`, or count them with `Count` while understanding that both operations move the shared cursor.
- Copy or move one file, or every non-directory match in one folder, with synchronous Windows filesystem operations.

## Important behaviour

Search state belongs to one live `TvxScriptFiles` object. A new `Search` replaces any previous enumeration. `Next`, `Count` and `GetFilenames` are destructive cursor operations, not independent queries. Use `Close` in a `finally` block when a script opens a search, particularly in a long-running action.

All paths are interpreted by the Windows account running the relevant Velox host. Relative paths depend on that process's current directory; they are not relative to a Configuration, Map or source file. Validate externally supplied paths against approved roots before passing them to this API.

Copy and move calls can create destination directories and replace existing files. Bulk operations are non-recursive, unsorted and non-transactional: earlier files remain changed if a later item fails. They do not provide an integrity check, rollback, staging rename or retry policy.

## Edge cases and quirks

- Search failures and end-of-enumeration both appear as `Exists = False`; the search API does not expose the underlying OS error.
- An empty search or bulk path becomes root-relative `\` on Windows. It does not mean the process current directory.
- A bare destination filename has no extracted parent path; single-file copy/move attempts to create an empty directory path and raises before reaching Windows.
- `Count` counts the current and remaining entries, then starts the stored search again. `GetFilenames` consumes the remainder without restarting it.
- Successful `CopyFiles` leaves the exhausted enumeration handle open until `Close`, another search or scripter destruction.

## Related groups

- [`File` functions](../Functions/File.md) provide individual path, attribute, size and purge helpers rather than the shared class cursor.
- [`Lists`](Lists.md) contains the string-list classes accepted by `GetFilenames`.

## External references

- [Embarcadero DocWiki: `System.SysUtils.TSearchRec`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TSearchRec)
- [Free Pascal: `TSearchRec`](https://www.freepascal.org/docs-html/rtl/sysutils/tsearchrec.html)
- [Microsoft Learn: `FindFirstFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-findfirstfilew)
- [Microsoft Learn: `CopyFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-copyfileexw)
- [Microsoft Learn: `MoveFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexw)
