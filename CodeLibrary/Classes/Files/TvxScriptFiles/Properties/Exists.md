---
title: Exists
description: Reports whether the helper's shared search cursor currently has a usable entry, not whether an arbitrary filesystem path exists.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, exists, search, cursor]
---

```Delphi
property Exists: Boolean read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Files.Search('C:\VeloxExamples\Inbound', '*.txt', 0);
  try
    Value := Files.Exists;
  finally
    Files.Close;
  end;
end;
```

### Usage

Reports whether the helper's shared search cursor currently has a usable entry, not whether an arbitrary filesystem path exists.

**Value**

`True` means the most recent `Search`, `Next` or `Count` restart positioned the shared `TSearchRec` on an entry. `False` means there is no public current entry.

This is not equivalent to `FileExists(path)` or `DirectoryExists(path)`. It takes no path, performs no independent check and says nothing about whether a previously returned name still exists.

**Behaviour**

Reading the property itself performs no I/O. When true, the current-entry properties are enabled. When false, they return empty or zero sentinels.

**Important usage notes**

- `False` conflates no matching entry, normal end-of-search, access denied, invalid path, invalid handle and other OS failures.
- A `True` result is subject to a filesystem race: another process can delete or replace the entry immediately afterward.
- Reading `Count` can change false to true by restarting a previously exhausted stored search.
- A bulk copy/move operation reuses the same search fields and therefore overwrites any manual enumeration state.

### Additional Technical Info
`Exists` is the read-only Boolean state of the current `TvxScriptFiles` directory cursor.

**Implementation**

The getter simply returns the object's `FExists` field. `Search` and `Next` set it from whether Delphi returned zero. `Close` sets it false. `GetFilenames` and `Count` change it indirectly by consuming/restarting the enumeration.

**Performance and concurrency**

The getter is constant-time, but its backing field is mutable and unsynchronized. Do not use it as a cross-thread readiness flag or as authorization to access a path.

**Related entries**

- [`Search`](../Methods/Search.md) establishes the first-entry state.
- [`Next`](../Methods/Next.md) advances and can make the state false.
- [`FileName`](FileName.md) returns the current base name only while this property is true.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.FindFirst`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindFirst)
- [Free Pascal: `FindFirst`](https://www.freepascal.org/docs-html/rtl/sysutils/findfirst.html)

<small>Created 2026-07-15</small>
