---
title: FileSize
description: Reconstructs the current Windows search entry's byte size as an Int64, returning zero when no entry is selected.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, size, int64, search]
---

```Delphi
property FileSize: Int64 read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Files.Search('C:\VeloxExamples\Inbound', '*.dat', 0);
  try
    if Files.Exists then
      Value := Files.FileSize
    else
      Value := 0;
  finally
    Files.Close;
  end;
end;
```

### Usage

`FileSize` reconstructs the current Windows search entry's byte size as an Int64, returning zero when no entry is selected.

**Value**

When [`Exists`](Exists.md) is true, the property returns the 64-bit byte size from the current `WIN32_FIND_DATAW`. When no entry is current, it returns `0`.

**Behaviour**

The size belongs to the current cursor entry and can change after any cursor operation. Files can also grow, shrink or be replaced after enumeration; this property does not lock them or guarantee a later read length.

**Important usage notes**

- `0` is ambiguous between an actual zero-byte file and the no-current-entry sentinel; check `Exists` first.
- Directory size fields have no recursive “folder size” meaning and are commonly zero. Do not sum them as directory content.
- The metadata can be stale on a busy or remote filesystem.
- The property reports bytes, not characters, records, allocated-on-disk size or compressed size.

### Additional Technical Info
`FileSize` is the read-only size in bytes reported for the helper's current Windows search entry.

**Implementation**

Velox reconstructs the value directly from the Windows high and low 32-bit fields:

```Delphi
(Int64(nFileSizeHigh) shl 32) + Int64(nFileSizeLow)
```

This avoids the older two-gigabyte limitation noted in the source and supports ordinary large-file sizes within positive `Int64` range. It does not open or measure the file again.

**Performance and concurrency**

The getter performs constant-time integer arithmetic and no filesystem I/O. Concurrent cursor changes can pair a separately read filename with a different size; copy both values before advancing and do not share the helper across threads.

**Related entries**

- [`FileName`](FileName.md) identifies the entry whose size is reported.
- [`FileAttr`](FileAttr.md) lets a script exclude directory entries before interpreting a size.
- [`vxFileSize`](../../../../Functions/File/vxFileSize.md) performs a separate one-path lookup without using this shared cursor.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.TSearchRec`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TSearchRec)
- [Free Pascal: `TSearchRec`](https://www.freepascal.org/docs-html/rtl/sysutils/tsearchrec.html)
- [Microsoft Learn: `WIN32_FIND_DATAW`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-win32_find_dataw)

<small>Created 2026-07-15</small>
