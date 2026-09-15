---
title: flsDuplicate
description: Classifies duplicate business input, driving default persistence/notification, duplicate-file routing and selected loop termination.
sidebar_position: 68
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, log, status, duplicate, routing, notification]
---

```Delphi
flsDuplicate = 4
```

### Example

```Delphi
function IsDuplicateOutcome(const Status: TvxLogStatusType): Boolean;
begin
  Result := Status = flsDuplicate;
end;
```

### Usage

`flsDuplicate` classifies duplicate business input, driving default persistence/notification, duplicate-file routing and selected loop termination.

### Additional Technical Info
`flsDuplicate` is ordinal 4 of [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md), displayed as `Duplicate`. It describes a duplicate business/process outcome; it does not itself perform duplicate detection or identify the duplicate key/record.

Default action settings save and notify Duplicate logs. File audit routing selects the configured duplicate directory, and reprocess-until-error logic stops on Duplicate alongside Cancelled and Error. These effects occur in their owning action/file/log stages, not when the constant is merely read.

The status setter accepts this member only when the current ordinal is 0-3. It can replace NotSet, OK, Warning or Issue, but not Cancelled, Error, Test or Highlight. This is numeric retention rather than a validated severity model. The separate Boolean `Log.Status` is not changed by Duplicate, so check the named StatusType rather than treating Boolean success as a complete outcome taxonomy.

Record the identity and matching rule that caused duplication. Two executions carrying this enum can have entirely different deduplication scopes, retention and replay policies. Do not persist ordinal 4 as a cross-version integration value.

The example only classifies a value and was source-reviewed; no duplicate detection, routing, notification, runtime or image-function test was executed.

<small>Created 2026-07-15</small>
