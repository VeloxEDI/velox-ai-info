---
title: "LogIssue"
description: "Adds a user business-issue item and raises the current flow's overall status to Issue without directly stopping processing."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - business-issue
  - flow-status
---

```Delphi
procedure LogIssue(const aMesg: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Value = '' then
    LogIssue('The customer reference is missing and requires business review.');
end;
```

### Usage

`LogIssue` adds a user business-issue item and raises the current flow's overall status to Issue without directly stopping processing.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMesg` | `string`, `const` | Business issue explanation stored as Velox level 3 and marked as a user item. Empty text is accepted. |

### Additional Technical Info
`LogIssue` records a user-facing business issue in the current action log and normally raises the overall flow status to `flsIssue`. The Boolean flow status remains true, so processing continues unless script or flow logic explicitly stops it.

This procedure does not create a row in a transaction-specific Issue table. [`InvoiceIssue`](InvoiceIssue.md) is the separate deferred API for an `Invoice_Issue` record. The example is illustrative and source-reviewed only.

**Implementation trace**

`TvxScripter.LogIssue` calls `TvxLog.Issue`, which calls `MessageLog(aMesg, Ord(flsIssue))`. The log considers Issue as an overall status and creates a level-3 item. Setting level 3 gives the item status `flsIssue` and `User=True`; its caption is `User Issue`.

**Status and execution behavior**

Status is monotonic by native enum order. Issue replaces Successful or Warning but does not reduce Duplicate, Cancelled or Error. A later Duplicate, Cancel or Error can raise it further.

Issue does not set Boolean `Log.Status` false and does not exit the current script. Subsequent statements and action steps normally run. At finalization the flow can still commit databases and audit files, subject to the rest of its results and configuration.

Issue status is included in the default persistent-log set and can select business-notification behavior. Neither persistence nor email is guaranteed: both are configuration-driven and later failures can change final status.

**Log data versus transaction issue data**

`LogIssue` creates only a `TvxLogItem`. It does not query the `Issue` definition table, assign an Issue number, update a transaction header status or create an `Invoice_Event`. If downstream processes need structured issue data, use the appropriate supported transaction-issue function rather than parsing this message.

**Text, limits and errors**

Velox does not trim, format, classify or redact the supplied text. The normalized table retains a 448- or 840-character prefix according to database compatibility, although the serialized log can retain more. Avoid secrets and large row-level payloads.

No database query occurs immediately. Allocation failures can propagate; later log persistence can fail separately.

**Related entries**

- [`InvoiceIssue`](InvoiceIssue.md) queues structured invoice-header issue data for deferred transactional persistence.
- [`InvoiceLineIssue`](InvoiceLineIssue.md) is currently unsafe because its runtime method pointer is incorrect.
- [`LogWarning`](LogWarning.md) uses the lower Warning status; [`LogDuplicate`](LogDuplicate.md) uses the higher Duplicate status.
- [`LogError`](LogError.md) stops normal flow processing after the script returns.

<small>Created 2026-07-15</small>
