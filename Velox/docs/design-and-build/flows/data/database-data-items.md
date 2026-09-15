---
title: "Database Flow data items"
description: "Configure DB Definition references, Connections, criteria, runtime selection and transaction scope for Flow database data."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [Flow data, DB Definition, parameters, transaction, Allow DB Change]
---

A database Flow data item is a Flow-local use of a shared [DB Definition](../../data-definitions/database-definitions.md). The Definition supplies dataviews and fields; the data item supplies the role, reference and runtime values used by this Flow.

## Properties

| Setting | Default | Effect |
| --- | --- | --- |
| **Data Item** / `SourceName` | New DB Definition Item | Flow-local name shown in source/destination selectors and logs. Name the role, not only the Definition. |
| **Definition** / `SourceFIDS` | Empty | Stable module reference to the DB Definition. A missing or archived reference prevents the item from opening. |
| **Source type** | Database | Identifies the item as database-backed and controls which step selectors can use it. |
| **Runtime popup** | Cleared | Enables the data item's runtime selection/popup path where invoked. Its full enforcement is not universal; verify the intended manual workflow rather than relying on it for service input. |
| **Allow DB change** | Cleared | Allows a runtime database-connection change where supported. Keep cleared for unattended production unless environment switching is explicitly designed and tested. |
| **Unique transaction** | Cleared | Marks the item for unique transaction behaviour. Treat this as an advanced isolation choice and prove commit/rollback boundaries with the target DB Connection. |
| **Parameters** | Definition-dependent | Criteria values derived from designed dataview/table/field metadata. Values can contain supported tags and must match the field type. |

The selected Definition can expose one or more DB Connection child links. A newly created DB Definition may initially include `_Data`; inspect the actual child link and do not assume it identifies the intended environment.

## Transaction behaviour

Opening or writing database data can start transactions on Connections associated with the Definition. A Custom SQL step explicitly starts one; saving DB Definition data can start one when master data exists. At the end of a live Flow attempt, Velox calls `CommitData` on its definitions: successful status commits and failure status rolls back. Test mode requests rollback.

This boundary does not roll back files, commands, remote APIs or already registered Transport work. A shared Connection may also disable transactions. Review both the data item and its [DB Connection transaction settings](../../connections/database/index.md#advanced-settings).

## Configure and verify

1. Add **DB Definition** data and choose the tested Definition.
2. Give the item a role name such as `Orders source` or `ERP destination`.
3. Confirm the Definition's Connections and every parameter value.
4. Keep runtime DB switching and unique transactions off unless the design requires them.
5. Assign the item only to compatible Flow steps.
6. Test no rows, one row, multiple rows, nulls, boundary values and an expected database failure.
7. Verify commit/rollback in the database and inspect the Flow log.

Do not put credentials in criteria values. Before changing a shared Definition or Connection, use [Check Usage](../../../administer-velox/modules-and-folders/index.md) and retest all dependent Flows.
