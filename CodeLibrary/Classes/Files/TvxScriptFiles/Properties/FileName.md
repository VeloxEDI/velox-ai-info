---
title: FileName
description: Returns the current search entry's base filename including its extension, or an empty string when no entry is selected.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, filename, search, path]
---

```Delphi
property FileName: String read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Files.Search('C:\VeloxExamples\Inbound', '*.csv', 0);
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

Returns the current search entry's base filename including its extension, or an empty string when no entry is selected.

**Value**

When [`Exists`](Exists.md) is true, the property returns `TSearchRec.Name`: the base filename as supplied by Windows, including its extension but excluding the searched directory. When `Exists` is false, it returns `''`.

**Behaviour**

The value changes whenever the shared cursor advances, restarts or is replaced by a bulk operation. Copy it to a separate script variable before calling `Next`, `Count`, `GetFilenames`, another `Search`, `CopyFiles` or `MoveFiles`.

To construct a full path, combine the name with the same validated directory used for `Search`. Do not treat the name as trusted merely because the filesystem returned it; enforce the same approved-root and downstream filename rules used for any external input.

### Additional Technical Info
`FileName` is the read-only name of the helper's current directory-search entry.

**Implementation**

Delphi populates `TSearchRec.Name` from the Unicode `WIN32_FIND_DATAW.cFileName` field produced by `FindFirstFileW` or `FindNextFileW`. The Velox getter adds only the `Exists` guard; it performs no normalization, path join, case conversion or filesystem lookup.

**Edge cases and quirks**

- Empty string is a no-current-entry sentinel; it does not distinguish no match from an enumeration error.
- Directory names can be returned if the search attribute mask includes directories.
- Windows can match a pattern against long and short names, but the record exposes the primary filename field.
- Enumeration order and filename case follow the filesystem and are not normalized by Velox.
- The named entry can be deleted or replaced immediately after enumeration.

**Performance and concurrency**

The getter copies one string and does no I/O. The underlying record is mutable and unsynchronized, so concurrent cursor operations can change the value between `Exists` and this read.

**Related entries**

- [`Search`](../Methods/Search.md) supplies the directory and mask that produced this base name.
- [`GetFilenames`](../Methods/GetFilenames.md) accumulates this property for all remaining entries.
- [`FileAttr`](FileAttr.md) identifies whether the current name represents a directory or special entry.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.TSearchRec`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TSearchRec)
- [Free Pascal: `TSearchRec`](https://www.freepascal.org/docs-html/rtl/sysutils/tsearchrec.html)
- [Microsoft Learn: `WIN32_FIND_DATAW`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-win32_find_dataw)

<small>Created 2026-07-15</small>
