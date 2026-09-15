---
title: "LogDuplicate"
description: "Adds a user duplicate item and raises the current flow's overall status to Duplicate without directly stopping processing."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - duplicate
  - flow-status
---

```Delphi
procedure LogDuplicate(const aMesg: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Value = 'DUPLICATE' then
    LogDuplicate('The business document was previously received.');
end;
```

### Usage

`LogDuplicate` adds a user duplicate item and raises the current flow's overall status to Duplicate without directly stopping processing.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMesg` | `string`, `const` | Duplicate explanation stored as a level-4, user-classified log item. Empty text is accepted. |

### Additional Technical Info
`LogDuplicate` adds a user-facing Duplicate item to the current flow log and raises the overall log status to `flsDuplicate` when the existing status is lower. It does not make the flow's Boolean status false and does not directly stop this script or later action steps.

Use it for a duplicate condition that should be visible in logs and notifications while the configured flow is still allowed to finish. It does not itself perform duplicate detection. The example is illustrative and source-reviewed only.

**Implementation trace**

`TvxScripter.LogDuplicate` delegates to `TvxLog.Duplicate`, which calls `MessageLog(aMesg, 4)`. `MessageLog` updates the overall status candidate, creates a `TvxLogItem`, sets `Description`, assigns level `4`, marks that item as a user item, and advances the log end time.

The item's display caption is `User Duplicate`.

**Status and control flow**

The overall status update is monotonic by native enum ordinal:

- Successful, Warning or Issue becomes Duplicate.
- An existing Duplicate remains Duplicate.
- Cancelled or Error is not reduced to Duplicate.

Duplicate does not set the Boolean `Log.Status` false. The action loop therefore continues unless script logic, configuration or a later Error/Cancel stops it. The function also does not `Exit` the current procedure.

At finalization, default configuration includes Duplicate logs in persistence. Duplicate status can also influence notification selection and the explanatory content generated for log emails. Those policies are configuration-driven; calling this procedure does not guarantee that an email is sent.

**Data and side effects**

The immediate side effect is an in-memory log item/status change. Database persistence is deferred until the flow saves its master log. The normalized log-item table stores only a prefix of long descriptions (448 or 840 characters according to the active database-support branch), while the serialized log can retain more.

No text is trimmed, escaped for presentation or redacted. Do not include credentials, tokens or unnecessary transaction content. Empty and multiline messages are allowed.

**Errors, performance and concurrency**

No duplicate lookup or database query occurs during the call. Normal object allocation errors can propagate. The current action log owns the created item; calls from scripts sharing an action context contribute to that same log and its synchronized/status lifecycle.

**Related entries**

- [`LogIssue`](LogIssue.md) records a lower-severity business issue.
- [`LogWarning`](LogWarning.md) records a warning while continuing.
- [`LogCancel`](LogCancel.md) normally stops later action steps through cancelled status.
- [`LogError`](LogError.md) makes the Boolean flow status false and attaches the current script.

<small>Created 2026-07-15</small>
