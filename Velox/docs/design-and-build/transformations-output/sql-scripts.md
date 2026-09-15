---
title: "Configure SQL Scripts"
description: "Create, test and govern saved SQL workspaces in Velox Designer"
sidebar_position: 30
slug: /transform-output/sql-scripts
classification: public
status: approved
owner: Cam Hart
keywords:
  - "sql-script"
  - "database"
  - "query"
---

A SQL Script is a named Designer module containing SQL text and a DB Connection. Use it as a governed query workspace for inspection or controlled database changes.

## Scope

This page covers creating, saving and interactively executing a SQL Script in Designer. Saving a SQL Script does not run or schedule it. Current Flow configuration does not directly select a saved SQL Script module as a Flow step; the **SQL Script** Flow step maintains its own SQL. Do not assume that changing this module changes a Flow.

:::danger SQL execution can immediately expose or change data
Selected `SELECT`, `WITH`, `EXEC` or `EXECUTE` statements run against the chosen database. Selected `INSERT`, `UPDATE` and `DELETE` statements start a transaction that Designer can commit or roll back. Stored procedures can still make changes outside that transaction boundary. Use a least-privilege test database and review the selected text before execution.
:::

## Settings and controls

| Setting or control | Accepted value | Effect and constraints |
| --- | --- | --- |
| **SQL Script Name** | Distinctive module name | Identifies the saved workspace in Designer and configuration export/import. |
| **DB Connection** | Existing DB Connection | Supplies the database, driver and credentials used for interactive execution. |
| SQL editor | SQL text | Stores the script. Execution requires an explicit selected single statement. |
| **Execute** | Selected SQL | Recognises statements beginning with `SELECT`, `WITH`, `INSERT`, `UPDATE`, `DELETE`, `EXEC` or `EXECUTE` after leading comments. Other statement types are rejected as unknown by this screen. |
| **Commit** | Available after recognised data modification | Commits the current interactive transaction. Confirm the affected rows first. |
| **Rollback** | Available after recognised data modification | Rolls back the current interactive transaction. It cannot reverse independent effects performed by a stored procedure or external system. |
| **Explore Database** | Selected DB Connection | Opens database exploration for the configured connection. |
| **Save** / **Quick Save** | Current name, connection and editor text | Persists the module; it does not execute the text. |

## Controlled procedure

1. Create a **SQL Script**, enter its name and choose a tested **DB Connection**.
2. Write or paste reviewed SQL without credentials, production identifiers or customer data in comments.
3. Select exactly one statement. Read the selection again and confirm the active DB Connection.
4. For a query, select **Execute** and inspect the result grid and row count.
5. For an `INSERT`, `UPDATE` or `DELETE`, select **Execute**, verify **Rows Affected**, then choose **Rollback** unless the change is explicitly approved. Choose **Commit** only after independent verification.
6. Save the SQL Script if it is a governed reusable workspace. Record its intended database, parameters and safe-use boundary in **Notes**.

## Example

This illustrative read-only query uses a parameter placeholder that must be adapted to the selected database and tested before use:

```sql
SELECT TransactionId, Status
FROM IntegrationTransaction
WHERE TransactionId = :transaction_id;
```

Do not paste an example into production without verifying table names, parameter syntax, access controls and expected row count.

## Constraints and failure behaviour

- Interactive execution requires a non-empty selection; the entire editor is not executed implicitly.
- A new execution rolls back any outstanding transaction from the preceding interactive data-change statement.
- Query recognition is based on the first SQL word after leading comments. Multi-statement batches and other command types are not supported by this execution control.
- `SELECT` and `WITH` display results. Stored-procedure execution can return results but may also have database or external side effects.
- The SQL Script module may be included in configuration templates, but that does not establish a runtime consumer.
- Database permissions, dialect, parameter syntax and transaction semantics come from the selected DB Connection and database platform.

## Related references

- [Configure a DB Connection](../connections/database/index.md)
- [Configure Flow steps](../flows/steps/index.md)
- [Security boundaries](../../technical-reference/security-boundaries.md)
