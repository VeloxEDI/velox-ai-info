---
title: flsIssue
description: Classifies a business or data issue, driving default persistence/notification and issue-folder routing without necessarily representing a system error.
sidebar_position: 71
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, log, status, issue, data-quality, routing]
---

```Delphi
flsIssue = 3
```

### Example

```Delphi
function NeedsBusinessReview(const Status: TvxLogStatusType): Boolean;
begin
  Result := Status = flsIssue;
end;
```

### Usage

`flsIssue` classifies a business or data issue, driving default persistence/notification and issue-folder routing without necessarily representing a system error.

### Additional Technical Info
`flsIssue` is ordinal 3 of [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md), displayed as `Issue`. It normally represents a business/data-quality condition requiring attention rather than a Velox system failure.

Default action configuration saves and notifies Issue logs. File audit routing selects the issue directory. Endpoint behavior varies: one REST path treats Issue and Error as client-error responses, while another treats only Error that way, so StatusType alone does not define a universal HTTP result.

The normal setter accepts Issue only over NotSet, OK or Warning. Duplicate, Cancelled, Error, Test and Highlight remain because their ordinals are higher. Issue does not set Boolean `Log.Status` false; consumers must inspect the named enum/`IsIssue` rather than equating Boolean success with “no attention required.”

The constant creates no issue record or description and does not select a responsible party, remediation, retry or acknowledgement. Capture the affected transaction/field, rule, observed/expected value and safe recovery action in structured/log detail.

The example only compares a value and was source-reviewed; no issue creation, API, routing, notification, runtime or image-function test was executed.

<small>Created 2026-07-15</small>
