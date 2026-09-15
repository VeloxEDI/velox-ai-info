---
title: "LogFileDownload"
description: "Queues a Downloaded file-audit record for a path in the current flow log without accessing or changing the file."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - file-audit
  - download
  - path
---

```Delphi
procedure LogFileDownload(const aFilePath: string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // This records the path; it does not download or verify the file.
  LogFileDownload('C:\VeloxData\Inbound\downloaded-order.xml');
end;
```

### Usage

`LogFileDownload` queues a Downloaded file-audit record for a path in the current flow log without accessing or changing the file.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFilePath` | `string`, `const` | Lexical path to describe. It may be absolute, relative, nonexistent, empty or syntactically invalid for the filesystem; this function does not validate it. |

### Additional Technical Info
`LogFileDownload` queues a file-audit item with native event `fetDownload` in the current flow log. It records a supplied path but does not open, download, hash, create, modify or test the file.

This dedicated procedure is the safe way to record the native Downloaded event. The `TvxFileEventType` exposed to scripts omits `fetDownload`, so [`LogFileEvent`](LogFileEvent.md) cannot select it by the expected enum name without relying on a defective ordinal mapping. The example uses a fictional path and was not executed.

**Implementation trace**

1. `TvxScripter.LogFileDownload` calls `Log.CreateLogFileEventFromPath(aFilePath, fetDownload)` using the **native** enum value 3.
2. Velox creates a `TvxLogFile` owned by the current log and copies the log's Test flag.
3. Assigning `FileName := aFilePath` splits the text through Delphi `ExtractFileName`, `ExtractFilePath` and `ExtractFileExt`.
4. The leading dot is removed from the stored extension when present.
5. The event field is assigned `fetDownload`.

No `FileConFID`, `FileDefFID`, transport, hash or file data is populated by this path-only helper.

**Recorded fields**

For `C:\VeloxData\Inbound\downloaded-order.xml`, the queued values are conceptually:

| Field | Value |
|---|---|
| `FilePath` | `C:\VeloxData\Inbound\` |
| `FileName` | `downloaded-order.xml` |
| `FileExt` | `xml` |
| `Event` | native `fetDownload` / `Downloaded` |
| `FileHash`, `FileData` | empty |

Parsing is lexical and Windows-oriented. The path is not made absolute or canonical, environment variables are not expanded, and case/dot segments are not normalized.

**Deferred persistence**

The call creates only an in-memory child of the current log. If the master log is later saved, Velox inserts a `VX_LOG_FILE` row and a `VX_LOG_FILE_LINK` row containing the event ordinal. If final log status is excluded by its configured save-status set, the file-audit item is not durable.

Repeated calls create separate log-file objects; this helper does not deduplicate identical paths or prove that a transfer actually occurred. Call it only after the application logic has established the event you intend to attest.

**Errors and limits**

`CreateLogFileEventFromPath` catches exceptions during item construction/parsing, adds `Unexpected error occurred while creating log file event` as an Error item and returns `nil`; the script wrapper discards that return value. There is no direct success/failure result.

Later log-save errors are handled in the log subsystem and can create further Error entries. Long paths/text are subject to database schema and downstream display limits, not checked here.

**Related entries**

- [`LogFileRead`](LogFileRead.md) and [`LogFileWrite`](LogFileWrite.md) safely use native Read and Write events.
- [`LogFileEvent`](LogFileEvent.md) exposes a general event selector but has a critical enum-ordinal defect after `fetWrite`.
- [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md) documents the script-visible enumeration.

**External references**

- [Embarcadero `ExtractFileName`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileName)
- [Embarcadero `ExtractFilePath`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFilePath)
- [Embarcadero `ExtractFileExt`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileExt)
- [Free Pascal `ExtractFileName`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilename.html)
- [Free Pascal `ExtractFilePath`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilepath.html)
- [Free Pascal `ExtractFileExt`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfileext.html)

<small>Created 2026-07-15</small>
