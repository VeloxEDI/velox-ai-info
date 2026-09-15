---
title: fetAudit
description: Names an intended file-audit move but currently crosses the script boundary as native Download because the importer omits fetDownload.
sidebar_position: 52
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, event, audit, logging, defect]
---

```Delphi
fetAudit = 3
```

### Example

```Delphi
function IsIntendedAuditEvent(const Event: TvxFileEventType): Boolean;
begin
  // Classification inside script is safe; do not pass this value to native APIs.
  Result := Event = fetAudit;
end;
```

### Usage

Do not assign `fetAudit` to a Velox file-event property in the current version. Velox interprets its numeric value as `fetDownload`, so the recorded event can be wrong.

### Additional Technical Info
`fetAudit` is script ordinal 3 of [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md). Its intended meaning is that a file has been moved to/audited in its audit location. Native Velox assigns native `fetAudit` after a successful audit move and can update the logged destination filename.

**Current scripting defect:** native `TvxFileEventType` inserts `fetDownload` at ordinal 3, but the script importer omits it. Passing script `fetAudit(3)` through [`LogFileEvent`](../../Functions/Logging/LogFileEvent.md), `TvxFileCon.FileEvent` or another direct native boundary stores/sets native `fetDownload`, not Audit. Native Audit is ordinal 4. Do not compensate by passing `fetError`; that deliberately encodes a defect and will silently change after correction.

The value does not move a file, choose an audit folder or verify a move. Product-native audit code first performs the filesystem operation and then applies native `fetAudit`; a script assignment only labels state. Final log persistence remains governed by the enclosing Flow log policy.

#### Safe use and diagnosis

- Comparing script-local enum values is safe, but any native-backed property/method is unsafe for this and all later script members.
- Use product-managed file auditing rather than manually manufacturing audit evidence.
- [`LogFileDownload`](../../Functions/Logging/LogFileDownload.md) safely records native Download because it selects that member inside native code; it does not make this constant safe.
- If historical logs show Download for a script-requested Audit, preserve script/product version and call path when correcting reports.
- Native Audit can carry a changed destination path; a path-only scripting event does not prove that source/destination or file content existed.

The example only compares a value and was source-reviewed; no log, file move, runtime or image-function test was executed.

**External references**

- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - declaration order controls ordinals.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration model.

<small>Created 2026-07-15</small>
