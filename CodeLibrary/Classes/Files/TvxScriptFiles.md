---
title: TvxScriptFiles
description: Provides one scripter-owned cursor for directory enumeration plus synchronous Windows file copy and move operations.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, files, search, copy, move]
---

```Delphi
TvxScriptFiles = class(TObject)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Files.Search('C:\VeloxExamples\Inbound', '*.txt', 0);
  try
    if Files.Exists then
      Value := Files.FileName
    else
      Value := '';
  finally
    Files.Close;
  end;
end;
```

### Usage

`TvxScriptFiles` provides one script execution-owned cursor for directory enumeration plus synchronous Windows file copy and move operations.

**Usage notes**

Do not call `Free` on the host-provided `Files` object and do not retain it beyond its script execution. If isolation requires a manual instance, wrap `TvxScriptFiles.Create` in `try..finally` and free only that instance. Use fully qualified approved paths where possible. Close searches in `finally`, check every single-file Boolean result and design bulk use so a partial operation is recoverable and idempotent.

### Additional Technical Info
`TvxScriptFiles` is Velox's stateful scripting facade for Windows directory enumeration and file copy/move operations.

**Implementation**

The class-specific PascalScript registration exposes eight methods and six read-only properties. `TObject` separately registers its inherited zero-argument `Create`, `Free` and `ClassName`, so `TvxScriptFiles.Create` is also callable even though no descendant-owned constructor page appears in this branch.

[`Files`](../../Variables/Helpers/Files.md) lazily creates one native instance for the current `TvxScripter`, returns the same instance on later accesses and frees it when the scripter is destroyed. A direct `TvxScriptFiles.Create` instead returns a separate caller-owned object that the script must `Free`; normal Delphi object allocation zero-initialises the fields and the inherited constructor adds no class-specific setup. `Free` dispatches to the overridden destructor, which closes an active search before releasing the object.

The object stores one Delphi `TSearchRec`, the last path/mask/attribute arguments, an `Exists` flag and a separate flag indicating whether a successful `FindFirst` handle still needs closing. Copy and move methods delegate to Unicode Windows `CopyFileExW` and `MoveFileExW` wrappers.

**Behaviour**

The exposed surface is:

- cursor lifecycle: [`Search`](TvxScriptFiles/Methods/Search.md), [`Next`](TvxScriptFiles/Methods/Next.md) and [`Close`](TvxScriptFiles/Methods/Close.md);
- cursor consumers: [`GetFilenames`](TvxScriptFiles/Methods/GetFilenames.md) and read-only [`Count`](TvxScriptFiles/Properties/Count.md);
- filesystem effects: [`CopyFile`](TvxScriptFiles/Methods/CopyFile.md), [`CopyFiles`](TvxScriptFiles/Methods/CopyFiles.md), [`MoveFile`](TvxScriptFiles/Methods/MoveFile.md) and [`MoveFiles`](TvxScriptFiles/Methods/MoveFiles.md); and
- current-entry state: [`Exists`](TvxScriptFiles/Properties/Exists.md), [`FileName`](TvxScriptFiles/Properties/FileName.md), [`FileSize`](TvxScriptFiles/Properties/FileSize.md), [`FileAttr`](TvxScriptFiles/Properties/FileAttr.md) and [`FileTimeStamp`](TvxScriptFiles/Properties/FileTimeStamp.md).

Search properties describe only the current entry. Calling `Next`, reading `Count`, calling `GetFilenames`, starting another search or invoking a bulk operation can replace or exhaust that entry. Copy scalar values immediately if later code still needs them.

**Edge cases and quirks**

- `Exists` means “the shared cursor currently has an entry”; it is not a general file-existence test.
- The same class has two ownership modes: never free the host-provided `Files` object, but always free a directly constructed object.
- Search/end/error states are collapsed into the same Boolean. The class does not expose `GetLastError` for enumeration failures.
- Search masks are concatenated verbatim. Bulk methods require a filename-only mask: a mask containing a directory component can enumerate a nested file but then copy/move the same base name from the source root instead.
- `Count` consumes the remainder and then reruns the search, while `GetFilenames` consumes the remainder without restarting.
- `CopyFiles` does not close its search on success. Both bulk operations can leave it open if an item raises.
- Empty paths can resolve to the current-drive root. Bare single-file destinations raise while attempting to create an empty parent path.
- Copy/move destinations may be replaced and batch effects are not rolled back.

**Performance and concurrency**

Enumeration and file operations are synchronous on the calling script thread. `Count` performs a complete remaining enumeration plus a second `FindFirst`; bulk operations block for every copied/moved byte. The object has no lock and is not safe for concurrent or asynchronous calls. Filesystem contents can change between enumeration and use, so metadata is advisory rather than a stable snapshot.

**Related entries**

- [`Files`](../../Variables/Helpers/Files.md) documents acquisition and ownership of this host object.
- [`File` functions](../../Functions/File.md) provide stateless alternatives for several individual filesystem tasks.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.TSearchRec`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TSearchRec)
- [Embarcadero DocWiki: `System.TObject.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TObject.Create)
- [Free Pascal: `TSearchRec`](https://www.freepascal.org/docs-html/rtl/sysutils/tsearchrec.html)
- [Free Pascal: `TObject.Create`](https://www.freepascal.org/docs-html/rtl/system/tobject.create.html)
- [Microsoft Learn: `FindFirstFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-findfirstfilew)
- [Microsoft Learn: `CopyFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-copyfileexw)
- [Microsoft Learn: `MoveFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexw)

<small>Created 2026-07-15</small>
