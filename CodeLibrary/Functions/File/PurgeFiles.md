---
title: "PurgeFiles"
description: "Attempts to delete non-directory files matching a mask when Velox's local-date age formula exceeds a day threshold."
sidebar_position: 40
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - purge
  - delete
  - wildcard
---

```Delphi
Function PurgeFiles( const AFileMask : string; AOlderThanDays : word; aIgnoreError : boolean) : integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Destructive: restrict the mask to the governed archive directory.
  Value := PurgeFiles('C:\Fictional\Archive\*.tmp', 365, False);
end;
```

### Usage

`PurgeFiles` attempts to delete non-directory files matching a mask when Velox's local-date age formula exceeds a day threshold.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AFileMask` | `string`, `const` | Directory plus filename/wildcard mask, such as `C:\Archive\*.tmp`. No recursion occurs. |
| `AOlderThanDays` | `Word` | Unsigned threshold from 0 through 65,535, compared with the exact formula below. |
| `aIgnoreError` | `Boolean` | When `True`, skips the explicit missing-directory exception and suppresses a `DeleteFile=False` failure. It does not suppress every possible exception. |

**Returns**

The number of eligible deletion attempts that reached the counter. With `aIgnoreError=True`, failed deletions are still counted, so the result is not necessarily the number of files actually removed.

**Behaviour**

- Enumeration is confined to the one directory named in the mask.
- `AOlderThanDays=0` normally makes files dated today eligible because the formula evaluates to 1 for ordinary today timestamps.
- A threshold of 1 normally retains today and yesterday's later-than-midnight timestamps until the formula exceeds 1.
- Directories are never recursively entered or deleted.
- No match returns zero.

**Errors**

With strict errors, an absent extracted directory or failed delete raises. Every caught exception is wrapped as `Error purging files matching "<mask>". <message>`, losing the original exception class while preserving its text.

**Usage notes**

Use a narrowly scoped absolute mask, a deliberately chosen retention threshold, and operational logging around the call. Do not treat its count as confirmed deletion when `aIgnoreError=True`.

### Additional Technical Info
`PurgeFiles` enumerates one directory using `AFileMask` and attempts to delete each matching non-directory entry whose converted modification time satisfies Velox's day-age formula.

The example is fictional, source-reviewed and was not executed by the documentation workflow. A real call permanently deletes eligible files.

**Implementation**

Velox captures local `Date` (today at midnight), extracts the mask's directory, optionally checks it, then uses Delphi `FindFirst(AFileMask, faAnyFile)`, `FindNext` and `FindClose`. It excludes `.`/`..` and entries carrying `faDirectory`.

For each remaining entry it computes:

```text
Trunc(Date - FileDateToDateTime(SearchRec.Time)) + 1 > AOlderThanDays
```

Eligible entries are passed to [`DeleteFile`](DeleteFile.md). A false delete raises only when `aIgnoreError=False`; the counter is incremented regardless when false is ignored. Any caught exception is replaced by a new generic `Exception` prefixed with the mask.

**Edge cases and quirks**

- `Trunc` rounds toward zero. Future timestamps and time-of-day/DST boundaries can therefore give unintuitive results; this is not a precise elapsed-hours calculation.
- When the mask has no directory portion and `aIgnoreError=False`, the empty extracted directory triggers the wrapper's “does not exist” exception. With `True`, enumeration proceeds relative to the process current directory.
- `aIgnoreError=True` can report a positive count even though read-only, locked or inaccessible files remain.
- Search/enumeration, timestamp-conversion, allocation and other exceptions are still re-raised even when errors are “ignored.”
- Files can change, appear or disappear between enumeration, age calculation and deletion.
- Link behavior follows the enumerated entry and [`DeleteFile`](DeleteFile.md); validate the permitted root and link policy before purging.

**Side effects**

Permanently deletes zero or more files. There is no recycle bin, transaction, rollback or audit callback in this helper.

**Performance and concurrency**

Linear in matches, with a metadata conversion and possible delete per file. Large/remote directories can block the script thread. Enumeration and deletion are not atomic.

**Related entries**

- [`DeleteFile`](DeleteFile.md) returns a Boolean for one path without Velox's count/wrapping logic.
- [`vxDeleteFile`](vxDeleteFile.md) raises a Velox OS error for one failed deletion.
- [`ExtractFilePath`](ExtractFilePath.md) defines the directory check input.

**External references**

- [Embarcadero `System.SysUtils.FindFirst`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindFirst)
- [Embarcadero `System.SysUtils.FileDateToDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FileDateToDateTime)
- [Free Pascal `FindFirst`](https://www.freepascal.org/docs-html/rtl/sysutils/findfirst.html) and [Free Pascal `FileDateToDateTime`](https://www.freepascal.org/docs-html/rtl/sysutils/filedatetodatetime.html) - compatible API context; the age formula/error/count behavior is Velox-owned.

<small>Created 2026-07-15</small>
