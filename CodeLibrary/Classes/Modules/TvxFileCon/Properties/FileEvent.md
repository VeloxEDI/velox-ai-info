---
title: FileEvent
description: Gets or sets FileCon's current native file-event marker, subject to a shifted script/native enumeration defect.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, file-event, enumeration, defect]
---

```Delphi
property FileEvent: TvxFileEventType read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := Ord(FileCon.FileEvent)
  else
    Value := -1;
end;
```

### Usage

`FileEvent` gets or sets FileCon's current Velox file-event marker, subject to a shifted script/Velox enumeration defect.

**Critical enum mismatch**

The script enum omits Velox `fetDownload` at ordinal 3, while the property helper passes the ordinal without translation.

| Script value written/read | Ordinal | Velox meaning at that ordinal |
|---|---:|---|
| `fetNone` | 0 | `fetNone` |
| `fetRead` | 1 | `fetRead` |
| `fetWrite` | 2 | `fetWrite` |
| `fetAudit` | 3 | `fetDownload` |
| `fetError` | 4 | `fetAudit` |
| `fetIssue` | 5 | `fetError` |
| `fetTemp` | 6 | `fetIssue` |
| `fetTransport` | 7 | `fetTemp` |
| `fetDelete` | 8 | `fetTransport` |

Velox `fetDelete` is ordinal 9 and has no valid script enum label. The same table applies in reverse when reading Velox values: for example, a Velox audit event appears as script `fetError`.

Until the import is fixed, only `fetNone`, `fetRead` and `fetWrite` are aligned. Do not set or make business decisions from later script labels; use dedicated logging functions for actual audit/error/etc events and treat raw ordinals cautiously.

**Side effects and ownership**

The setter only changes the marker. It does not perform/log/verify a file operation, change CurrentFileName, register transport or persist configuration. Arbitrary script writes can change outbound routing behaviour (especially `fetWrite`) without any corresponding file creation.

### Additional Technical Info
`FileEvent` is the current read/write/routing event marker used by file engines and outbound transport decisions.

Reset sets the native value to `fetNone`. File engines directly assign native `fetRead` or `fetWrite`; outbound transport creation checks native `fetWrite` to decide whether to iterate every recorded output file.

**Performance and concurrency**

Field access is constant-time and unsynchronised. Engines/actions can overwrite it as lifecycle state changes.

**Related entries**

- [`TvxFileEventType`](../../../../Types/Enumerations/TvxFileEventType.md) — generated enum entry (read with this mismatch).
- [`RecordFileForTransport`](../Methods/RecordFileForTransport.md) and [`TransportFiles`](TransportFiles.md) — write-event transport path.
- [`CurrentFileName`](CurrentFileName.md) — independent current path.

<small>Created 2026-07-15</small>
