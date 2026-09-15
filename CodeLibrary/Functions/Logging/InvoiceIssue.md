---
title: "InvoiceIssue"
description: "Queues a header-level invoice issue for deferred VxData persistence and status/event updates at successful flow finalization."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - invoice
  - issue
  - vxdata
  - transaction
---

```Delphi
procedure InvoiceIssue(
  aInvoiceNum, aIssueNum: integer;
  aDescription: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Fictional keys. The issue is queued now and saved later by the flow.
  InvoiceIssue(12345, 1002, 'Invoice total does not match the calculated lines.');
end;
```

### Usage

`InvoiceIssue` queues a header-level invoice issue for deferred VxData persistence and status/event updates at successful flow finalization.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aInvoiceNum` | `integer` | Existing `Invoice_Hdr.Num` intended to receive the issue and status update. Velox does not validate it during this call. |
| `aIssueNum` | `integer` | `Issue.Num`. Its configured `Status` is queried immediately; an absent issue definition is treated as level 6/Error. |
| `aDescription` | `string` | Issue detail queued for `Invoice_Issue.Description`. It is SQL-escaped during deferred persistence but is not trimmed, classified or length-checked by this function. |

**Security and data handling**

Descriptions become governed transaction data and can also appear in SQL trace text when SQL logging is enabled. Do not include credentials, tokens or unnecessary personal data. `CreateSQLString` escapes the value for the generated statement, but this API is not a general-purpose SQL execution interface.

### Additional Technical Info
`InvoiceIssue` queues a business issue against an `Invoice_Hdr` row. The call does not immediately insert into `Invoice_Issue`; normal flow finalization later saves all queued issues through the VxData system-data transaction.

This is transaction-data functionality, not a synonym for [`LogIssue`](LogIssue.md). `LogIssue` adds a message to the flow log; `InvoiceIssue` prepares an `Invoice_Issue` row, a header status update and a notification event. The example is fictional and source-reviewed and was not executed against a database.

**Immediate behavior**

1. Cast the scripter's current `Action` to `TvxActionMan`.
2. Create the in-memory invoice issue list and per-invoice status dictionary on first use.
3. Create a `TvxIssue` with `Num=aInvoiceNum`, `LineNum=0`, the supplied issue number and description.
4. Add it to the pending invoice list.
5. Call [`GetIssueLevel`](GetIssueLevel.md), which executes a VxData query.
6. Store the greatest numeric level queued for this invoice during the current flow execution.

`LineNum=0` is the implementation's header-level marker. The procedure returns no success value and does not confirm that the header, issue definition or eventual foreign-key relationships exist.

**Deferred persistence lifecycle**

At the end of action execution, Velox calls `Issues.SaveIssues(SystemDB.SQLD)` only while the flow's Boolean log status remains true and the log is not cancelled. Warnings, issues and duplicates normally leave that Boolean true, so they do not by themselves suppress persistence. An Error or Cancel prevents the save.

For the pending invoice family, finalization:

1. starts or joins the VxData `SQLD` transaction;
2. inserts each queued header issue into `Invoice_Issue (InvoiceHdrNum, IssueNum, Description)`;
3. updates each affected `Invoice_Hdr.Status` to the maximum numeric level queued for that invoice in this run; and
4. inserts a notification row in `Invoice_Event` using `Event_NotifyCompany`.

Production execution commits or rolls back that system-data transaction with the rest of flow finalization. Test execution performs the SQL but explicitly rolls the transaction back. Do not query another connection mid-flow and assume the queued issue is already durable.

**Important status behavior**

The deferred update is an unconditional `set Status=<new level> where Num=<invoice>`. It does not compare the existing `Invoice_Hdr.Status`. A newly queued lower numeric status can therefore replace a higher status already stored in the database. Within the current run only, Velox retains the greatest numeric level among newly queued issues for the same invoice.

Missing Issue definitions silently contribute level `6`; database failures in the lookup raise during this call. Because the `TvxIssue` object is added before the lookup, such a failure can leave a partially queued in-memory issue, although normal error flow then skips issue persistence.

**Multi-invoice notification defect**

The current save loop inserts all issue rows and updates every dictionary key, but it constructs only one `Invoice_Event` after those loops using the last `TvxIssue` visited. When one execution queues issues for more than one invoice, only the last visited invoice receives the notification event. Issue rows and header updates for the other invoices are still attempted.

Treat this as a current implementation defect. Do not rely on one notification event per invoice until the product save loop is corrected.

**Queue-retention and replay defect**

`SaveIssues` does not remove saved items or clear the per-invoice status dictionary, and `TvxActionMan.Reset` does not clear or recreate its `TvxIssues` object. If the same native action instance executes again, every previously queued issue remains pending and is attempted again at the next successful, non-cancelled finalization.

This retention applies after a successful production commit, after a Test rollback and after a failed save. Depending on database constraints, a later execution can insert duplicate issue rows/events, repeat status updates or fail while replaying old data. An intervening Error/Cancel merely postpones the replay because that execution skips `SaveIssues`; it does not clear the queue.

Some execution paths may create and destroy an action instance for one run, which bounds the effect to that instance. Long-lived/reused action instances do not have that protection. There is no public script method in this group to clear the pending list. Treat repeated use on a reusable action as unsafe until the product clears successfully handled/Test-rolled-back queues at the correct lifecycle boundary.

**Errors and rollback**

The immediate `GetIssueLevel` query can raise. Deferred insert/update/event failures are caught inside `TvxIssues`, add a flow Error (`Error saving issues to Velox data`), return false and cause the enclosing system-data transaction to roll back during normal finalization. The failed pending items remain queued under the replay defect above.

The API does not report affected-row counts. A nonexistent invoice number may produce a zero-row header update, while issue/event foreign keys determine whether inserts fail.

**Related entries**

- [`InvoiceLineIssue`](InvoiceLineIssue.md) is intended for a line-level issue but is unsafe in current builds because its runtime method is misregistered.
- [`GetIssueLevel`](GetIssueLevel.md) explains the per-call status lookup and missing-row default.
- [`LogIssue`](LogIssue.md) records a business issue in the current flow log without creating `Invoice_Issue` data.
- [`LogSQL`](LogSQL.md) records trace text only and does not execute the SQL passed to it.

<small>Created 2026-07-15</small>
