---
title: FileAttr
description: Returns the current search entry's Windows file-attribute bitmask, or zero when the cursor has no current entry.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, attributes, bitmask, search]
---

```Delphi
property FileAttr: Integer read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Files.Search('C:\VeloxExamples\Inbound', '*', $1FF);
  try
    if Files.Exists then
      Value := Files.FileAttr
    else
      Value := 0;
  finally
    Files.Close;
  end;
end;
```

### Usage

`FileAttr` returns the current search entry's Windows file-attribute bitmask, or zero when the cursor has no current entry.

**Value**

When [`Exists`](Exists.md) is true, the property returns `TSearchRec.Attr`, populated on Windows from `WIN32_FIND_DATAW.dwFileAttributes`. When no current entry exists, it returns `0`.

Common Velox/Windows bits include:

| Bit | Meaning |
|---|---|
| `$1` | read-only |
| `$2` | hidden |
| `$4` | system |
| `$10` | directory |
| `$20` | archive |
| `$80` | normal |
| `$100` | temporary |
| `$400` | symbolic link/reparse entry in Velox's mapped value |
| `$800` | compressed |
| `$4000` | encrypted |
| `$10000` | |

Test a bit with `Files.FileAttr and BitValue <> 0`. Do not compare the complete value to one constant because multiple attributes can coexist.

**Behaviour**

The value describes the current directory entry at enumeration time. It can change after `Next` or any other operation that replaces the cursor. It is useful for distinguishing directories when a search includes them, but it is not an access-control decision and does not prove that a subsequent operation will succeed.

### Additional Technical Info
`FileAttr` is the read-only attribute bitmask for the helper's current search entry.

**Implementation**

The getter returns the `Attr` field unchanged behind an `Exists` guard. It does not call `GetFileAttributes`, follow links, refresh stale metadata or translate the value into a script set.

**Edge cases and quirks**

- `0` can mean no current entry. It must not be interpreted as a confirmed normal file unless `Exists` is true.
- The `Search` attribute argument controls inclusion of special entries; it does not require returned entries to have every supplied bit.
- Reparse/symbolic-link attributes describe the directory entry. Copy/move behavior is determined separately by the Windows operation and flags.
- Windows notes that enumerated NTFS attributes can occasionally be stale under load.

**Performance and concurrency**

The getter is constant-time and performs no I/O. The record has no synchronization and may be replaced concurrently.

**Related entries**

- [`Search`](../Methods/Search.md) explains the different semantics of its `aSearchAttr` inclusion argument.
- [`FileName`](FileName.md) returns the name associated with this bitmask.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.TSearchRec`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TSearchRec)
- [Free Pascal: `TSearchRec`](https://www.freepascal.org/docs-html/rtl/sysutils/tsearchrec.html)
- [Microsoft Learn: file attribute constants](https://learn.microsoft.com/en-us/windows/win32/fileio/file-attribute-constants)
- [Microsoft Learn: `WIN32_FIND_DATAW`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-win32_find_dataw)

<small>Created 2026-07-15</small>
