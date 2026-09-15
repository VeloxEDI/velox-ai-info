---
title: Status_Test
description: Identifies the Test general processing state as Status.Num and log ordinal value 7 for Velox scripts.
sidebar_position: 467
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
Status_Test = 7
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Status_Test; // 7
end;
```

### Usage

`Status_Test` identifies the Test general processing state as Status.Num and log ordinal value 7 for Velox scripts.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `7` |
| Paired text | [`Status_Test_String`](./Status_Test_String.md) = `Test` |
| Database domain | `Status.Num` / `Status.Code`; `Issue.Status`; general record/event `Status` fields |
| VeloxEngine log ordinal | `7` |

### Additional Technical Info
`Status_Test` is the script-visible `LongInt` identifier for the **Test** general processing state. Its fixed value is `7`, paired with [`Status_Test_String`](./Status_Test_String.md).

The identifier represents a test-marked outcome in the shared status/log scale. Reading it does not inspect a transaction, create a log item, assign a database field or change an action outcome.

**Implementation**

Velox declares and registers the fixed `LongInt` value `7`. The numeric name is registered in the Velox tag map, so `<!Status_Test!>` expands to `7`. No general-status number/text converter is registered.

Fresh-build VxData seeds `Status` row `7` with Code `Test`. `Issue.Status` references this table, and general `Status` columns across transaction, line, issue and event records use the same documented 0-8 scale.

The numeric value equals the ordinal of the corresponding `TvxLogStatusType` member. The matching log display text is also `Test`. Native source comments identify this value as currently used by VeloxEngine logging rather than the VeloxEDI transaction-status path.

**Behaviour**

General `Status` describes processing, issue or presentation outcome. It is distinct from transaction lifecycle fields named `StatusNum`, such as order, invoice and shipment lifecycle status.

`GetIssueLevel` queries an Issue row and returns its numeric `Issue.Status`; it defaults to `Status_Error` value `6` when no row is returned. It does not return a String code.

**Edge cases and quirks**

- There is no registered general-status text/number converter. The numeric and String constants are paired by definition, but scripts must choose the representation expected by the receiving field or API.
- Because log aggregation accepts only a larger ordinal, Test 7 can replace Error 6 as aggregate `StatusType`. It does not itself set the action Boolean false; an already-false value left by Error remains false.
- Log aggregation uses ordinal ordering (`Value > current StatusType`), not a separately defined severity table. Do not assume the higher Test and Highlight ordinals mean more severe business failures than Error.
- Directly assigning a database `Status` field does not call `TvxLog.SetStatusType`; directly logging a status does not automatically update every transaction row.
- `Status` is not a lifecycle `StatusNum`. For example, general Cancelled is 5, while shipment lifecycle Cancelled is 7 and POD/tracking Cancelled is 3.
- The tag expansion produces the number `7`, not the code `Test`.
- PascalScript retains no status-domain type information after evaluation, so a same-valued constant from another family can be accepted numerically while expressing the wrong meaning.

**Side effects**

Reading `Status_Test`, comparing it, or expanding its tag has no I/O or state-changing effect. Log aggregation, issue lookup, event creation and database persistence occur only when the caller invokes those separate paths.

**Errors**

Reading the constant does not raise an error. A wrong representation can cause a conversion or database error in the receiving code. `GetIssueLevel` performs database I/O and can propagate query failures, but constant access does not call it.

**Performance and concurrency**

This is an immutable compiled value. Constant access is constant-time and carries no shared mutable status. Log and database operations have their own state and concurrency behaviour.

**Remarks**

The example is source-reviewed and non-destructive. It returns the fixed value only; it does not test a live action or modify a status field.

**Related entries**

- [`Status_Test_String`](./Status_Test_String.md) is the paired database code.
- [`GetIssueLevel`](../../Functions/Logging/GetIssueLevel.md) returns the numeric status configured for an Issue row.

<small>Created 2026-07-15</small>
