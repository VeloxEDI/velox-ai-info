---
title: "Configure a Custom SQL step"
description: "Execute reviewed tag-processed SQL against database Flow data with explicit transaction, permission and retry controls."
sidebar_position: 90
classification: public
status: approved
owner: Cam Hart
keywords: [Custom SQL step, SQL command, transaction, DB Definition]
---

A Custom SQL step opens a database data item, starts its DB Definition transaction, processes supported Velox tags in the SQL text and executes the result. Commit or rollback occurs later when the complete Flow attempt is finalised.

| Field | Default | Contract |
| --- | --- | --- |
| **Source Data** | None | Required DB Definition item and its Connection(s). |
| **SQL command** / `SQLCommand` | Empty | SQL text to execute. Blank SQL is detected and cannot perform useful work. |
| **Active** | Selected | Clear while an unreviewed statement is saved. |

## Controls

- Prefer Definition criteria/parameters and database parameterisation patterns over embedding data in SQL text.
- Treat tag substitution as string construction, not automatic SQL-injection protection.
- Grant only the database permissions required by the statement.
- Test affected-row counts, nulls, duplicate keys, deadlocks/timeouts and a forced later-step failure.
- Confirm rollback with the actual Connection; **Disable transactions** on that Connection changes the safety boundary.
- SQL logging defaults on at Flow level and can expose statements/values. Restrict and sanitise log access.

A later failure normally requests rollback of DB Definition and system database transactions, but cannot undo commands, files, remote calls or independently committed work. Automatic retry can execute SQL again after an uncertain database/network result; design idempotency or reconciliation before enabling it. See [database data items](../data/database-data-items.md) and [transaction semantics](../runtime/ordering-concurrency-and-transactions.md).
