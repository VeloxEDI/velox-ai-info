---
title: flsNotSet
description: Represents the zero status sentinel, but normal StatusType assignment cannot lower any existing value to it because the setter requires a strict ordinal increase.
sidebar_position: 72
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, log, status, sentinel, not-set, reset]
---

```Delphi
flsNotSet = 0
```

### Example

```Delphi
function HasSelectedStatus(const Status: TvxLogStatusType): Boolean;
begin
  Result := Status <> flsNotSet;
end;
```

### Usage

`flsNotSet` represents the zero status sentinel, but normal StatusType assignment cannot lower any existing value to it because the setter requires a strict ordinal increase.

### Additional Technical Info
`flsNotSet` is ordinal 0 of [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md), displayed as `Not Set` and mapped to the Admin email class. It is a sentinel for missing/uninitialized classification, but normal fresh/reset logs use [`flsOK`](flsOK.md), not NotSet.

`TvxLog.SetStatusType` updates the enum only when the incoming ordinal is strictly greater than the current one. Because nothing is less than 0, assigning `StatusType := flsNotSet` through that setter is always a no-op. Native reset code can assign internal fields directly; `IsCancelled := False` also directly forces NotSet before sending OK through the setter as a special reset hack.

NotSet is excluded from default save/send status sets. Static mapping labels it Admin, but whether any notification occurs still depends on the owning save/send path and configured address.

Do not use this constant as a general “clear status” operation. Use the owning reset API/lifecycle, which also resets Boolean Status, header/row snapshots and other log state as designed. Persisting NotSet should prompt provenance review rather than being treated as successful completion.

The example only compares a value and was source-reviewed; no reset, log, notification, runtime or image-function test was executed.

<small>Created 2026-07-15</small>
