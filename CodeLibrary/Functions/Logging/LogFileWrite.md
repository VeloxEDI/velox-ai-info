---
title: "LogFileWrite"
description: "Queues a Write file-audit record for a path in the current flow log without creating or validating the file."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - file-audit
  - write
  - test-mode
  - destructive
---

```Delphi
procedure LogFileWrite(const aFilePath: string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Call only after your code successfully created this flow-owned output.
  LogFileWrite('C:\VeloxData\Outbound\mapped-order.xml');
end;
```

### Usage

`LogFileWrite` queues a Write file-audit record for a path in the current flow log without creating or validating the file.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFilePath` | `string`, `const` | Path to record as a flow-created Write. It is accepted lexically and is not validated against the filesystem. |

**Errors**

Construction/parsing exceptions are caught, converted to a flow Error and otherwise hidden because the procedure returns no result. The absence of an exception does not mean a file exists. Later save or cleanup failures are logged separately; cleanup's delete helper determines its own filesystem-error behavior.

### Additional Technical Info
`LogFileWrite` queues a path-only file-audit item with native event `fetWrite`. It does not create, open, verify, hash or modify the file. The call tells Velox that the path represents an output written by this flow.

**In Test mode, that assertion can later become destructive.** When a persisted Test log is deleted, Velox finds file links with event `fetWrite` and deletes each referenced file if it exists. Never use `LogFileWrite` for a pre-existing, shared, input or otherwise non-disposable path during a Test run.

The example is fictional and source-reviewed. It was not run and no file was created.

**Implementation trace**

1. `TvxScripter.LogFileWrite` calls `CreateLogFileEventFromPath(aFilePath, fetWrite)` using native enum value 2.
2. The helper creates a `TvxLogFile` child and copies the current log's Test flag.
3. Delphi `ExtractFileName`, `ExtractFilePath` and `ExtractFileExt` split the text; Velox removes the extension's leading dot.
4. The item event is assigned native Write.
5. If the master log is saved, the event/path is persisted into `VX_LOG_FILE` and `VX_LOG_FILE_LINK`.

The helper records no file content, hash, size, timestamp, File Connection/Definition identity or proof of successful output.

**Critical Test-log cleanup behavior**

Deleting a saved Test log invokes `TvxLog.DeleteTestFiles`. It queries all linked file rows whose event ordinal equals native `fetWrite`, concatenates stored `FilePath + FileName`, and calls Velox file deletion for every path that currently exists.

Consequences:

- cleanup happens when the Test log is deleted, not when this procedure is called;
- the file at that path may have changed since the event was recorded;
- no recorded hash or identity is compared before deletion;
- a relative path is interpreted in the cleanup process's then-current directory;
- a later unrelated file at the same pathname can be deleted; and
- recording a production/shared file as Test Write can cause data loss.

Use a dedicated, isolated Test output directory and record only disposable files actually created by that run. Move or remove important files before deleting a Test log if its recorded output provenance is uncertain.

**Path semantics and persistence**

The path is not canonicalized, made absolute, checked for traversal or deduplicated. Persistence depends on the enclosing flow's final status/save configuration. If the Test log is never saved, no later database-driven cleanup row exists; do not use that observation as a safety strategy.

Repeated calls create separate file records. The current item carries the log's Test flag, but the delete query is based on the Test log and Write link rather than verifying file creation metadata.

**Related entries**

- [`LogFileRead`](LogFileRead.md) records a non-destructive Read assertion.
- [`LogFileDownload`](LogFileDownload.md) records native Downloaded.
- [`LogFileEvent`](LogFileEvent.md) can safely express `fetWrite` by ordinal but has the same cleanup hazard and is defective for later enum members.
- [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md) defines the script-visible event names.

**External references**

- [Embarcadero `ExtractFileName`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileName)
- [Embarcadero `ExtractFilePath`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFilePath)
- [Embarcadero `ExtractFileExt`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileExt)
- [Free Pascal `ExtractFileName`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilename.html)
- [Free Pascal `ExtractFilePath`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilepath.html)
- [Free Pascal `ExtractFileExt`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfileext.html)

<small>Created 2026-07-15</small>
