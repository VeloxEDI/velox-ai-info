---
title: Status_NotSet
description: Identifies the NotSet general processing state as Status.Num and log ordinal value 0 for Velox scripts.
sidebar_position: 463
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
Status_NotSet = 0
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Status_NotSet; // 0
end;
```

### Usage

`Status_NotSet` identifies the NotSet general processing state as Status.Num and log ordinal value 0 for Velox scripts.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `0` |
| Paired text | [`Status_NotSet_String`](./Status_NotSet_String.md) = `NotSet` |
| Database domain | `Status.Num` / `Status.Code`; `Issue.Status`; general record/event `Status` fields |
| VeloxEngine log ordinal | `0` |

### Additional Technical Info
`Status_NotSet` is the script-visible `LongInt` identifier for the **NotSet** general processing state. Its fixed value is `0`, paired with [`Status_NotSet_String`](./Status_NotSet_String.md).

The identifier represents the reference state in which no processing outcome has been assigned. Reading it does not inspect a transaction, create a log item, assign a database field or change an action outcome.

**Implementation**

Velox declares and registers the fixed `LongInt` value `0`. The numeric name is registered in the Velox tag map, so `<!Status_NotSet!>` expands to `0`. No general-status number/text converter is registered.

Fresh-build VxData seeds `Status` row `0` with Code `NotSet`. `Issue.Status` references this table, and general `Status` columns across transaction, line, issue and event records use the same documented 0-8 scale.

The numeric value equals the ordinal of the corresponding `TvxLogStatusType` member. The matching log display text is `Not Set`, with a space. It is used in the shared transaction/issue status scale and has the same ordinal as the corresponding VeloxEngine log enum value.

**Behaviour**

General `Status` describes processing, issue or presentation outcome. It is distinct from transaction lifecycle fields named `StatusNum`, such as order, invoice and shipment lifecycle status.

`GetIssueLevel` queries an Issue row and returns its numeric `Issue.Status`; it defaults to `Status_Error` value `6` when no row is returned. It does not return a String code.

**Edge cases and quirks**

- There is no registered general-status text/number converter. The numeric and String constants are paired by definition, but scripts must choose the representation expected by the receiving field or API.
- The Scriptlet `HasIssue` threshold starts at ordinal 3, so this value alone is below that threshold.
- Log aggregation uses ordinal ordering (`Value > current StatusType`), not a separately defined severity table. Do not assume the higher Test and Highlight ordinals mean more severe business failures than Error.
- Directly assigning a database `Status` field does not call `TvxLog.SetStatusType`; directly logging a status does not automatically update every transaction row.
- `Status` is not a lifecycle `StatusNum`. For example, general Cancelled is 5, while shipment lifecycle Cancelled is 7 and POD/tracking Cancelled is 3.
- The tag expansion produces the number `0`, not the code `NotSet`.
- PascalScript retains no status-domain type information after evaluation, so a same-valued constant from another family can be accepted numerically while expressing the wrong meaning.

**Side effects**

Reading `Status_NotSet`, comparing it, or expanding its tag has no I/O or state-changing effect. Log aggregation, issue lookup, event creation and database persistence occur only when the caller invokes those separate paths.

**Errors**

Reading the constant does not raise an error. A wrong representation can cause a conversion or database error in the receiving code. `GetIssueLevel` performs database I/O and can propagate query failures, but constant access does not call it.

**Performance and concurrency**

This is an immutable compiled value. Constant access is constant-time and carries no shared mutable status. Log and database operations have their own state and concurrency behaviour.

**Remarks**

The example is source-reviewed and non-destructive. It returns the fixed value only; it does not test a live action or modify a status field.

**Related entries**

- [`Status_NotSet_String`](./Status_NotSet_String.md) is the paired database code.
- [`GetIssueLevel`](../../Functions/Logging/GetIssueLevel.md) returns the numeric status configured for an Issue row.

<small>Created 2026-07-15</small>
