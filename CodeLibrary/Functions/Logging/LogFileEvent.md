---
title: "LogFileEvent"
description: "Queues a selected file-audit event, subject to a current ordinal mismatch between the script and native TvxFileEventType enumerations."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - file-audit
  - enumeration
  - defect
---

```Delphi
procedure LogFileEvent(
  const aFilePath: string;
  const aEvent: TvxFileEventType)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // fetRead has the same ordinal in script and native code.
  // Prefer LogFileRead for a clearer, safer intent.
  LogFileEvent('C:\VeloxData\Inbound\order.xml', fetRead);
end;
```

### Usage

`LogFileEvent` queues a selected file-audit event, subject to a current ordinal mismatch between the script and Velox TvxFileEventType enumerations.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFilePath` | `string`, `const` | Path text to split and record. It is not opened, canonicalized or checked for existence. |
| `aEvent` | `TvxFileEventType`, `const` | Script enum value passed by ordinal to the incompatible Velox enumeration. Use the mapping table below. |

### Additional Technical Info
`LogFileEvent` queues a path-only file-audit item using a caller-selected `TvxFileEventType`. It does not perform or verify the represented file operation.

**Current builds have a critical enum registration defect.** The PascalScript enum omits native `fetDownload`, so constants after `fetWrite` carry the wrong native ordinal. Only `fetNone`, `fetRead` and `fetWrite` map to the native event with the same name. Prefer the dedicated Read, Write and Download procedures; do not use later constants to describe audit/error/delete lifecycle events.

The example deliberately uses the ordinal-safe `fetRead` value and was not executed.

**Exact ordinal mismatch**

Native Delphi defines:

```text
fetNone(0), fetRead(1), fetWrite(2), fetDownload(3), fetAudit(4),
fetError(5), fetIssue(6), fetTemp(7), fetTransport(8), fetDelete(9)
```

PascalScript is registered as:

```text
fetNone(0), fetRead(1), fetWrite(2), fetAudit(3), fetError(4),
fetIssue(5), fetTemp(6), fetTransport(7), fetDelete(8)
```

The runtime method accepts the native enum and receives only the integer ordinal:

| Constant written in script | Native record actually stored | Correct? |
|---|---|---|
| `fetNone` (0) | `fetNone` | Yes |
| `fetRead` (1) | `fetRead` | Yes |
| `fetWrite` (2) | `fetWrite` | Yes |
| `fetAudit` (3) | `fetDownload` | **No** |
| `fetError` (4) | `fetAudit` | **No** |
| `fetIssue` (5) | `fetError` | **No** |
| `fetTemp` (6) | `fetIssue` | **No** |
| `fetTransport` (7) | `fetTemp` | **No** |
| `fetDelete` (8) | `fetTransport` | **No** |

Native `fetDelete` (9) cannot be expressed by this script enum. Do not compensate by deliberately choosing the preceding wrong name: that hard-codes a defect, misleads readers and will silently change meaning when the registration is fixed.

**Implementation trace**

1. The script constant is compiled as its script ordinal.
2. `TvxScripter.LogFileEvent` passes it to `CreateLogFileEventFromPath` as native `TvxFileEventType` without translation.
3. Velox creates a `TvxLogFile`, copies the current Test flag and lexically splits `aFilePath` with `ExtractFileName`, `ExtractFilePath` and `ExtractFileExt`.
4. It stores the received native event ordinal.
5. When the enclosing log is saved, `VX_LOG_FILE` and `VX_LOG_FILE_LINK` persist that incorrect or correct native ordinal.

The item contains no file hash/data and no File Connection, File Definition or Transport identity.

**Safe current alternatives**

- Use [`LogFileRead`](LogFileRead.md) for Read.
- Use [`LogFileWrite`](LogFileWrite.md) for Write, with its Test-log deletion warning.
- Use [`LogFileDownload`](LogFileDownload.md) for native Downloaded.
- There is no defect-free dedicated scripting helper in this group for native Audit, Error, Issue, Temp, Transport or Delete. Escalate a product fix rather than emitting misleading audit evidence.

**Test-mode deletion hazard**

A correctly stored native Write event is later treated as a test-created output when a persisted Test log is deleted. Velox queries its Write file links and deletes each existing path. `LogFileEvent(path, fetWrite)` therefore carries the same hazard as [`LogFileWrite`](LogFileWrite.md): never record an unrelated/pre-existing file as a Test Write.

Due to the ordinal defect, script `fetAudit` stores native Download rather than Write and does not enter that cleanup query; this accidental behavior is not a valid workaround.

**Errors and persistence**

The immediate helper catches construction/parsing exceptions, records a flow Error and returns `nil`, but this procedure has no return value. It never proves the filesystem event happened. Persistence depends on the enclosing log's configured final-status save policy.

**Related entries**

- [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md) is the script-visible enum page and must be read with this mismatch.
- [`LogFileRead`](LogFileRead.md), [`LogFileWrite`](LogFileWrite.md) and [`LogFileDownload`](LogFileDownload.md) avoid the shifted selector for their native constants.

**External references**

- [Embarcadero `ExtractFileName`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileName)
- [Embarcadero `ExtractFilePath`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFilePath)
- [Embarcadero `ExtractFileExt`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileExt)
- [Free Pascal `ExtractFileName`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilename.html)
- [Free Pascal `ExtractFilePath`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilepath.html)
- [Free Pascal `ExtractFileExt`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfileext.html)

<small>Created 2026-07-15</small>
