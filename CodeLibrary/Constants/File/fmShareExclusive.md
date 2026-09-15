---
title: fmShareExclusive
description: Denies compatible competing read and write opens for the handle lifetime without making the file operation transactional.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, stream, sharing, exclusive]
---

```Delphi
fmShareExclusive = 16
```

### Example

```Delphi
function OpenForExclusiveUpdate(const FileName: String): TFileStream;
begin
  Result := TFileStream.Create(FileName, fmOpenReadWrite or fmShareExclusive);
end;
```

### Usage

`fmShareExclusive` denies compatible competing read and write opens for the handle lifetime without making the file operation transactional.

### Additional Technical Info
`fmShareExclusive` requests no compatible competing read or write access while the returned file handle remains open. On current Windows, its share-table value is zero. It has the same current Windows share result as zero-valued [`fmShareCompat`](fmShareCompat.md), but expresses the intent clearly.

Existing incompatible handles can make construction fail; exclusivity is not acquired retroactively. Once open, the mode coordinates later compatible opens through the operating system, but it does not make a sequence of reads, writes, seeks and resizing transactional. A failure can still leave a partially updated file.

Velox's legacy [`fmCreate`](fmCreate.md) value `$FFFF` is specifically remapped to this share mode by current `TFileStream`, so create/truncate streams are exclusive even if script code appears to OR another share value.

The returned stream owns the handle. Free it in `finally` to release exclusivity promptly. Network filesystems, non-Windows targets and non-cooperating access can differ; treat sharing as platform/handle coordination rather than a security boundary.

The example returns an owned stream and is source-reviewed only; no file was opened.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create)
- [Free Pascal `FileOpen`](https://www.freepascal.org/docs-html/rtl/sysutils/fileopen.html)

<small>Created 2026-07-15</small>
