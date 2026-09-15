---
title: flsWarning
description: Classifies a completed outcome requiring attention and is included in default log persistence and notification sets.
sidebar_position: 75
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, log, status, warning, notification, persistence]
---

```Delphi
flsWarning = 2
```

### Example

```Delphi
function HasWarningOutcome(const Status: TvxLogStatusType): Boolean;
begin
  Result := Status = flsWarning;
end;
```

### Usage

`flsWarning` classifies a completed outcome requiring attention and is included in default log persistence and notification sets.

### Additional Technical Info
`flsWarning` is ordinal 2 of [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md), displayed as `Warning`. It represents an outcome that completed far enough to continue/report but needs attention.

Default action settings save and notify Warning logs. File routing groups Warning with OK, Cancelled and Error in the audit directory. `TvxLog.IsWarning` tests exact equality; a later retained Issue/Duplicate/etc. is not also reported as Warning.

The normal setter accepts Warning only over NotSet or OK. Any current ordinal 2-8 remains. Warning does not change the separate Boolean `Log.Status`; it can therefore coexist with Boolean true, and it cannot restore a Boolean previously set false by Error. Inspect both the named outcome and owning operation's continuation semantics.

Record what was degraded, the affected transaction/data, whether output is complete, and what follow-up is required. A warning is not a generic exception sink and does not imply rollback or retry safety. Do not rank by ordinal: Test and Highlight are numerically higher for declaration reasons, not severity.

The example only compares a value and was source-reviewed; no warning, notification, file routing, runtime or image-function test was executed.

<small>Created 2026-07-15</small>
