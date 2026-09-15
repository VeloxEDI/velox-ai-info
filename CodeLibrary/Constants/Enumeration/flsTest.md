---
title: flsTest
description: Labels test-only log content but has ordinal 7, so manual overall-status assignment can block later Error and normal outcomes.
sidebar_position: 74
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, log, status, test, ordinal, quirk]
---

```Delphi
flsTest = 7
```

### Example

```Delphi
function IsTestStatus(const Status: TvxLogStatusType): Boolean;
begin
  Result := Status = flsTest;
end;
```

### Usage

`flsTest` labels test-only log content but has ordinal 7, so manual overall-status assignment can block later Error and normal outcomes.

### Additional Technical Info
`flsTest` is ordinal 7 of [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md), displayed as `Test`. Source comments describe it as being for log lines, and the common MessageLog level switch deliberately does not promote Test to the overall log status.

Manual overall assignment is hazardous: the setter retains the numerically greatest ordinal, so Test prevents later Error(6) or any ordinary outcome from replacing StatusType. A later Error still sets Boolean `Log.Status=False`, leaving the enum as Test. Use the intended test-log helper/context rather than assigning the overall status.

Default save and notification sets exclude Test. The static email table maps it to Admin, but common `GetEmailForType` case statements omit Test and may return an empty/default result. Test execution state and this enum are also different concepts: a log can carry a Test line without its completion outcome becoming flsTest.

Test mode does not automatically make external side effects safe. Use dedicated test data/endpoints and understand cleanup, especially paths recorded as Write in persisted Test logs.

The example only compares a value and was source-reviewed; no Test execution, email, cleanup, runtime or image-function test was executed.

<small>Created 2026-07-15</small>
