---
title: flsOK
description: Represents successful informational completion and is the only StatusType for which TvxLog.IsSuccess returns true.
sidebar_position: 73
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, log, status, success, ok, reset]
---

```Delphi
flsOK = 1
```

### Example

```Delphi
function CompletedSuccessfully(const Status: TvxLogStatusType): Boolean;
begin
  Result := Status = flsOK;
end;
```

### Usage

`flsOK` represents successful informational completion and is the only StatusType for which TvxLog.IsSuccess returns true.

### Additional Technical Info
`flsOK` is ordinal 1 of [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md), displayed as `Successful`. Fresh/reset logs use OK, and `TvxLog.IsSuccess` is true only when the retained StatusType equals this member.

OK is included in the default save set but excluded from the default notification set. File routing groups it into the audit directory. Informational log lines do not necessarily change overall status back to OK.

The normal setter can promote only NotSet to OK; it cannot lower Warning or any later member. However, passing OK always sets the separate Boolean `Log.Status=True` even when the enum update is rejected. A retained Error/Test/Highlight can therefore coexist with Boolean success after an attempted OK assignment. Use the owning Reset/ResetStatusToSuccess operation when a real retry reset is intended.

Successful status does not guarantee external delivery, acknowledgement, transaction commit or absence of warnings outside the current log scope. Check the relevant module/transport result and durable evidence. Do not compare ordinals to decide that a value above OK is “more successful” or “more severe.”

The example only compares a value and was source-reviewed; no Flow, reset, file routing, runtime or image-function test was executed.

<small>Created 2026-07-15</small>
