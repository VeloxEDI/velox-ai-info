---
title: FileTimeStamp
description: Returns the current entry's last-write FILETIME converted to local Delphi TDateTime, or zero when no entry is selected.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, timestamp, datetime, timezone]
---

```Delphi
property FileTimeStamp: TDateTime read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Files.Search('C:\VeloxExamples\Inbound', '*.csv', 0);
  try
    if Files.Exists then
      Value := Files.FileTimeStamp
    else
      Value := 0;
  finally
    Files.Close;
  end;
end;
```

### Usage

`FileTimeStamp` returns the current entry's last-write FILETIME converted to local Velox TDateTime, or zero when no entry is selected.

**Value**

When [`Exists`](Exists.md) is true, the property returns Velox `TSearchRec.TimeStamp`. On Windows this originates from `WIN32_FIND_DATAW.ftLastWriteTime`. When no current entry exists, it returns `0`.

`TDateTime` stores a civil date/time as a floating-point day count relative to 30 December 1899. The value carries no timezone identifier or UTC offset.

**Behaviour**

The timestamp describes the last write/truncate/overwrite time reported during enumeration, not creation time or last-access time. Format it explicitly if a string is needed and define the timezone expected by downstream systems before comparing it with values from another host.

### Additional Technical Info
`FileTimeStamp` is the read-only local `TDateTime` representation of the current entry's last-write time.

**Implementation**

Delphi converts the Windows UTC `FILETIME` to a system time, applies the host's local timezone conversion, and encodes the local fields as `TDateTime`. The conversion helper returns zero if conversion/encoding fails. Velox adds a separate `Exists` guard but no UTC preservation or formatting.

**Edge cases and quirks**

- `0` is ambiguous: it is both the no-entry/conversion-failure sentinel and the valid Delphi epoch value.
- Daylight-saving and timezone rules of the Velox host affect the converted local value. Moving the same script/data between hosts can change the displayed civil time.
- Filesystem timestamp resolution and update behavior differ; FAT write times, for example, are coarser than NTFS.
- Metadata can become stale or the file can be replaced after enumeration.
- Directory timestamps do not represent the newest file beneath the directory.

**Performance and concurrency**

The getter converts already-enumerated metadata and performs no new file lookup. It is unsynchronized with cursor changes and with system timezone changes.

**Related entries**

- [`FileName`](FileName.md) identifies the current entry.
- [`Search`](../Methods/Search.md) records the point at which the timestamp metadata was obtained.

**External references**

- [Embarcadero DocWiki: `TSearchRec.TimeStamp`](https://docwiki.embarcadero.com/Libraries/Athens/en/API%3ASystem.SysUtils.TSearchRec.TimeStamp)
- [Embarcadero DocWiki: `System.TDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TDateTime)
- [Free Pascal: `TSearchRec`](https://www.freepascal.org/docs-html/rtl/sysutils/tsearchrec.html)
- [Microsoft Learn: `WIN32_FIND_DATAW`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-win32_find_dataw)
- [Microsoft Learn: `FILETIME`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-filetime)

<small>Created 2026-07-15</small>
