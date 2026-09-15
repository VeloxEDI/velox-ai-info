---
title: "FileAge"
description: "Retrieves a file's last-write timestamp as local TDateTime and reports whether retrieval succeeded."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - timestamp
  - datetime
---

```Delphi
Function FileAge( const FileName : string; out FileDateTime : TDateTime) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  ModifiedAt: TDateTime;
begin
  if FileAge('C:\Fictional\Inbound\order.csv', ModifiedAt) then
    Value := ModifiedAt
  else
    Value := Null;
end;
```

### Usage

`FileAge` retrieves a file's last-write timestamp as local TDateTime and reports whether retrieval succeeded.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | Path of the non-directory file to query. Relative paths use the Velox process current directory. |
| `FileDateTime` | `TDateTime`, `out` | Receives the local last-write date/time only when the function returns `True`. Treat it as undefined when the result is `False`. |

**Returns**

`True` when the file metadata was read and converted to `TDateTime`; otherwise `False`.

**Behaviour**

- An accessible non-directory file with a convertible timestamp returns `True` and assigns `FileDateTime`.
- Missing paths, directories and metadata/conversion failures return `False`.
- A symbolic link is followed because the script cannot override the default `FollowLink=True`.
- The value represents the file's last-write time, not creation time, last-access time or a content checksum.

**Errors**

Normal missing, wrong-kind and metadata failures return `False`. Argument-conversion and unexpected platform/runtime failures can still propagate.

**Usage notes**

Always branch on the Boolean result before consuming the timestamp. For ordering across machines or zones, document the local-time assumption and prefer a source that exposes UTC when available.

### Additional Technical Info
`FileAge` retrieves the named file's last-write timestamp into `FileDateTime` and reports whether retrieval and conversion succeeded. This is the modern Boolean overload; it does not return the deprecated packed DOS timestamp used by Delphi's older one-argument overload.

The example uses a fictional path. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The script wrapper calls installed `System.SysUtils.FileAge(FileName, FileDateTime)`. The omitted `FollowLink` parameter defaults to `True`. On Windows, the current RTL reads `ftLastWriteTime` via `GetFileAttributesEx`; sharing/lock failures trigger a `FindFirstFile`-based fallback. It rejects directory attributes, converts the UTC file time to local file time using the process's current time-zone rules, converts to system time, then calls `TrySystemTimeToDateTime`.

**Edge cases and quirks**

- Do not read `FileDateTime` after a `False` return; the `out` value has no documented useful result in that branch.
- The Windows conversion uses the current local time-zone offset. Historical daylight-saving transitions and later time-zone changes can affect the displayed local value; retain UTC metadata outside this API when exact cross-zone comparison is required.
- Directories are explicitly rejected even though they have last-write metadata.
- Locked/share-exclusive files may still succeed through the enumeration fallback, but inaccessible remote storage can delay or fail the call.
- The file can change or disappear immediately after metadata is read. Equal timestamps do not prove equal content, and file-system timestamp resolution varies.

**Side effects**

No persistent change. The function performs file-system metadata queries and writes the output variable on success.

**Performance and concurrency**

The normal path uses a metadata query; certain lock/share failures add a directory-search fallback. Remote paths can block. The result is a snapshot and provides no lock or synchronisation.

**Related entries**

- [`FileExists`](FileExists.md) checks for a non-directory file without returning its timestamp.
- [`vxFileSize`](vxFileSize.md) returns file size through a separate implementation.
- [`PurgeFiles`](PurgeFiles.md) performs age-based file deletion and has its own rules and side effects.

**External references**

- [Embarcadero `System.SysUtils.FileAge`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FileAge)
- [Free Pascal `FileAge`](https://www.freepascal.org/docs-html/rtl/sysutils/fileage.html) - compatible overload context; installed Delphi/Windows conversion and link behaviour define Velox's exact result.

<small>Created 2026-07-15</small>
