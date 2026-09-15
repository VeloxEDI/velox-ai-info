---
title: fetTransport
description: Names an intended transport-folder lifecycle event but currently crosses the script boundary as native Temp because the script enum is shifted.
sidebar_position: 59
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, event, transport, logging, defect]
---

```Delphi
fetTransport = 7
```

### Example

```Delphi
function IsIntendedTransportEvent(const Event: TvxFileEventType): Boolean;
begin
  Result := Event = fetTransport; // do not pass to native APIs in this build
end;
```

### Usage

`fetTransport` names an intended transport-folder lifecycle event but currently crosses the script boundary as Velox Temp because the script enum is shifted.

### Additional Technical Info
`fetTransport` is script ordinal 7 of [`TvxFileEventType`](../../Types/Enumerations/TvxFileEventType.md). Native product code uses native `fetTransport` after successfully moving a file to its transport location and updates the destination filename in the associated log.

**Current scripting defect:** native ordinal 7 is `fetTemp`; native Transport is ordinal 8 after the importer-omitted `fetDownload`. Passing script `fetTransport` to [`LogFileEvent`](../../Functions/Logging/LogFileEvent.md) or `TvxFileCon.FileEvent` therefore records Temp. Script `fetDelete(8)` happens to reach native Transport but must not be used as a workaround.

This member is lifecycle/audit state, not the transport execution status and not proof that an external delivery occurred. Product code may first stage a file in a transport folder and later create/update a separate log-transport record for protocol sending.

#### Interpretation guidance

- Distinguish “moved to transport/staging location” from “sent,” “acknowledged” and “completed.”
- Preserve the resulting path and associated transport identity when native code supplies them.
- A path-only synthetic event has neither File Connection/Definition nor Transport identity and performs no move.
- Existing native ordinal 7 means Temp; provenance is required to identify faulty script intent.
- Correct the enum adapter before authoring script-generated Transport lifecycle evidence.

The example was source-reviewed and no file move, transport, log persistence, runtime or image-function test was executed.

**Related Code Library entries**

- [`fetTemp`](fetTemp.md) - native event currently produced by this script ordinal.
- [`fetDelete`](fetDelete.md) - script ordinal currently (incorrectly) reaches native Transport.

<small>Created 2026-07-15</small>
