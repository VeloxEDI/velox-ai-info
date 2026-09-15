---
title: Status_Error
description: Identifies the Error general processing state as Status.Num and log ordinal value 6 for Velox scripts.
sidebar_position: 457
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - processing-status
  - issue-status
  - constant
---

```Delphi
Status_Error = 6
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Status_Error; // 6
end;
```

### Usage

`Status_Error` identifies the Error general processing state as Status.Num and log ordinal value 6 for Velox scripts.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `6` |
| Paired text | [`Status_Error_String`](./Status_Error_String.md) = `Error` |
| Database domain | `Status.Num` / `Status.Code`; `Issue.Status`; general record/event `Status` fields |
| VeloxEngine log ordinal | `6` |

### Additional Technical Info
`Status_Error` is the script-visible `LongInt` identifier for the **Error** general processing state. Its fixed value is `6`, paired with [`Status_Error_String`](./Status_Error_String.md).

The identifier represents a system-error outcome and is the only log status that sets the action Boolean status false. Reading it does not inspect a transaction, create a log item, assign a database field or change an action outcome.

**Implementation**

Velox declares and registers the fixed `LongInt` value `6`. The numeric name is registered in the Velox tag map, so `<!Status_Error!>` expands to `6`. No general-status number/text converter is registered.

Fresh-build VxData seeds `Status` row `6` with Code `Error`. `Issue.Status` references this table, and general `Status` columns across transaction, line, issue and event records use the same documented 0-8 scale.

The numeric value equals the ordinal of the corresponding `TvxLogStatusType` member. The matching log display text is also `Error`. Native source comments identify this value as currently used by VeloxEngine logging rather than the VeloxEDI transaction-status path.

**Behaviour**

General `Status` describes processing, issue or presentation outcome. It is distinct from transaction lifecycle fields named `StatusNum`, such as order, invoice and shipment lifecycle status.

`GetIssueLevel` queries an Issue row and returns its numeric `Issue.Status`; it defaults to `Status_Error` value `6` when no row is returned. It does not return a String code.

**Edge cases and quirks**

- There is no registered general-status text/number converter. The numeric and String constants are paired by definition, but scripts must choose the representation expected by the receiving field or API.
- In `TvxLog.SetStatusType`, Error is the only enum value that sets the action's separate Boolean status to false. Larger Test/Highlight ordinals do not do so themselves.
- Log aggregation uses ordinal ordering (`Value > current StatusType`), not a separately defined severity table. Do not assume the higher Test and Highlight ordinals mean more severe business failures than Error.
- Directly assigning a database `Status` field does not call `TvxLog.SetStatusType`; directly logging a status does not automatically update every transaction row.
- `Status` is not a lifecycle `StatusNum`. For example, general Cancelled is 5, while shipment lifecycle Cancelled is 7 and POD/tracking Cancelled is 3.
- The tag expansion produces the number `6`, not the code `Error`.
- PascalScript retains no status-domain type information after evaluation, so a same-valued constant from another family can be accepted numerically while expressing the wrong meaning.

**Side effects**

Reading `Status_Error`, comparing it, or expanding its tag has no I/O or state-changing effect. Log aggregation, issue lookup, event creation and database persistence occur only when the caller invokes those separate paths.

**Errors**

Reading the constant does not raise an error. A wrong representation can cause a conversion or database error in the receiving code. `GetIssueLevel` performs database I/O and can propagate query failures, but constant access does not call it.

**Performance and concurrency**

This is an immutable compiled value. Constant access is constant-time and carries no shared mutable status. Log and database operations have their own state and concurrency behaviour.

**Remarks**

The example is source-reviewed and non-destructive. It returns the fixed value only; it does not test a live action or modify a status field.

**Related entries**

- [`Status_Error_String`](./Status_Error_String.md) is the paired database code.
- [`GetIssueLevel`](../../Functions/Logging/GetIssueLevel.md) returns the numeric status configured for an Issue row.

<small>Created 2026-07-15</small>
