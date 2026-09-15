---
title: Status_Warning
description: Identifies the Warning general processing state as Status.Num and log ordinal value 2 for Velox scripts.
sidebar_position: 469
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
Status_Warning = 2
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Status_Warning; // 2
end;
```

### Usage

`Status_Warning` identifies the Warning general processing state as Status.Num and log ordinal value 2 for Velox scripts.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `2` |
| Paired text | [`Status_Warning_String`](./Status_Warning_String.md) = `Warning` |
| Database domain | `Status.Num` / `Status.Code`; `Issue.Status`; general record/event `Status` fields |
| VeloxEngine log ordinal | `2` |

### Additional Technical Info
`Status_Warning` is the script-visible `LongInt` identifier for the **Warning** general processing state. Its fixed value is `2`, paired with [`Status_Warning_String`](./Status_Warning_String.md).

The identifier represents a non-fatal warning outcome. Reading it does not inspect a transaction, create a log item, assign a database field or change an action outcome.

**Implementation**

Velox declares and registers the fixed `LongInt` value `2`. The numeric name is registered in the Velox tag map, so `<!Status_Warning!>` expands to `2`. No general-status number/text converter is registered.

Fresh-build VxData seeds `Status` row `2` with Code `Warning`. `Issue.Status` references this table, and general `Status` columns across transaction, line, issue and event records use the same documented 0-8 scale.

The numeric value equals the ordinal of the corresponding `TvxLogStatusType` member. The matching log display text is also `Warning`. It is used in the shared transaction/issue status scale and has the same ordinal as the corresponding VeloxEngine log enum value.

**Behaviour**

General `Status` describes processing, issue or presentation outcome. It is distinct from transaction lifecycle fields named `StatusNum`, such as order, invoice and shipment lifecycle status.

`GetIssueLevel` queries an Issue row and returns its numeric `Issue.Status`; it defaults to `Status_Error` value `6` when no row is returned. It does not return a String code.

**Edge cases and quirks**

- There is no registered general-status text/number converter. The numeric and String constants are paired by definition, but scripts must choose the representation expected by the receiving field or API.
- The Scriptlet `HasIssue` threshold starts at ordinal 3, so this value alone is below that threshold.
- Log aggregation uses ordinal ordering (`Value > current StatusType`), not a separately defined severity table. Do not assume the higher Test and Highlight ordinals mean more severe business failures than Error.
- Directly assigning a database `Status` field does not call `TvxLog.SetStatusType`; directly logging a status does not automatically update every transaction row.
- `Status` is not a lifecycle `StatusNum`. For example, general Cancelled is 5, while shipment lifecycle Cancelled is 7 and POD/tracking Cancelled is 3.
- The tag expansion produces the number `2`, not the code `Warning`.
- PascalScript retains no status-domain type information after evaluation, so a same-valued constant from another family can be accepted numerically while expressing the wrong meaning.

**Side effects**

Reading `Status_Warning`, comparing it, or expanding its tag has no I/O or state-changing effect. Log aggregation, issue lookup, event creation and database persistence occur only when the caller invokes those separate paths.

**Errors**

Reading the constant does not raise an error. A wrong representation can cause a conversion or database error in the receiving code. `GetIssueLevel` performs database I/O and can propagate query failures, but constant access does not call it.

**Performance and concurrency**

This is an immutable compiled value. Constant access is constant-time and carries no shared mutable status. Log and database operations have their own state and concurrency behaviour.

**Remarks**

The example is source-reviewed and non-destructive. It returns the fixed value only; it does not test a live action or modify a status field.

**Related entries**

- [`Status_Warning_String`](./Status_Warning_String.md) is the paired database code.
- [`GetIssueLevel`](../../Functions/Logging/GetIssueLevel.md) returns the numeric status configured for an Issue row.

<small>Created 2026-07-15</small>
