---
title: "LogFileRead"
description: "Queues a Read file-audit record for a path in the current flow log without opening or verifying the file."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - file-audit
  - read
  - path
---

```Delphi
procedure LogFileRead(const aFilePath: string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Call after your code has actually read the governed file.
  LogFileRead('C:\VeloxData\Reference\customer-codes.csv');
end;
```

### Usage

`LogFileRead` queues a Read file-audit record for a path in the current flow log without opening or verifying the file.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFilePath` | `string`, `const` | Lexical file path to record. Empty, relative, nonexistent and malformed path text is accepted unless path parsing itself raises. |

**Errors**

Construction/parsing exceptions are caught by the helper, which adds an Error log item and returns `nil`; `LogFileRead` exposes no result. Later database-save failures are handled separately by the log subsystem. The procedure does not report an invalid/nonexistent file because it never checks one.

### Additional Technical Info
`LogFileRead` queues a path-only file-audit item with native event `fetRead`. It is an assertion supplied by the script, not an I/O operation: Velox does not open the path, check that it exists or prove it was read.

Call it only after the relevant code has successfully completed the read you want the log to represent. The example is fictional and source-reviewed and did not access a file.

**Implementation trace**

1. `TvxScripter.LogFileRead` calls `CreateLogFileEventFromPath(aFilePath, fetRead)` with the native Read value.
2. The helper creates a `TvxLogFile` under the current log and copies its Test flag.
3. `ExtractFileName` stores the rightmost filename component.
4. `ExtractFilePath` stores the drive/directory text including its trailing separator.
5. `ExtractFileExt` reads the final extension and Velox removes its leading dot.
6. The event is set to native `fetRead`.

No bytes are read. `FileHash`, `FileData`, File Connection/Definition identifiers and transport identity remain empty.

**Path semantics**

Parsing is lexical and Windows-hosted. Velox does not:

- resolve a relative path against a stable base;
- normalize `.` or `..` segments;
- expand environment variables;
- resolve links or canonical casing;
- reject wildcards, directory-only text or alternate stream syntax; or
- capture a stable file identity.

Record the exact governed path form your operational processes expect. Two different strings for the same physical file remain different audit entries.

**Deferred persistence**

The item exists only in the current flow log until that master log is saved. Persistence creates `VX_LOG_FILE` and `VX_LOG_FILE_LINK` rows. If the final log status is not configured for saving, no durable read record is produced.

Repeated calls are not deduplicated. A recorded Read event is not proof that content was read completely, successfully, once, or before a concurrent replacement.

**Related entries**

- [`LogFileWrite`](LogFileWrite.md) records Write and has a Test-log deletion hazard.
- [`LogFileDownload`](LogFileDownload.md) records the native Downloaded event.
- [`LogFileEvent`](LogFileEvent.md) has a shifted-enum defect for events after Write.
- [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md) defines the script constants.

**External references**

- [Embarcadero `ExtractFileName`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileName)
- [Embarcadero `ExtractFilePath`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFilePath)
- [Embarcadero `ExtractFileExt`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileExt)
- [Free Pascal `ExtractFileName`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilename.html)
- [Free Pascal `ExtractFilePath`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilepath.html)
- [Free Pascal `ExtractFileExt`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfileext.html)

<small>Created 2026-07-15</small>
