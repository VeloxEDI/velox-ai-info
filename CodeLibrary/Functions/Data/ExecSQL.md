---
title: "ExecSQL"
description: "Executes non-query SQL on the Velox Data connection within its current Velox transaction."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sql
  - data-platform
  - transaction
---

```Delphi
function ExecSQL(const aSQL: string): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Use only trusted, correctly quoted SQL.
  if not ExecSQL('update ExampleQueue set Reviewed = 1 where ItemID = 1001') then
    LogError('ExampleQueue update failed; inspect the Velox log');
end;
```

### Usage

`ExecSQL` executes non-query SQL on the Velox Data connection within its current Velox transaction.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSQL` | `string`, `const` | Complete non-query SQL text to execute on `gSystemConnection.SQLD`. Parameter recognition is disabled. |

**Returns**

`True` when `ExecSQL(True)` returns without raising. `False` when an exception is caught after the temporary query has been created. The value does not mean the transaction has committed and does not report affected-row count. Failure while evaluating `SQLD.NewQuery` occurs before this method enters its `try` blocks and propagates instead of being converted to `False`.

**Errors**

After query creation, the method catches transaction, SQL-building and execution exceptions, logs the error and returns `False`; it does not re-raise and does not explicitly roll back. Query creation itself is outside that handler and can propagate. The connection may still have an active transaction for the surrounding flow to resolve. Review logs rather than treating `False` as a complete cleanup signal.

**Security and data safety**

`ParamCheck := False` means this API provides no parameter binding. SQL built by concatenating external values is vulnerable to quoting errors and injection. Logging may expose literal values embedded in the statement. Use trusted static SQL or rigorously validated/escaped values and avoid secrets in text.

### Additional Technical Info
`ExecSQL` executes a non-query SQL statement on the Velox Data (`SQLD`) connection. It starts or joins the connection's Velox transaction and leaves completion to the surrounding execution flow.

The identifiers and values are fictional. The example is source-reviewed and was not executed; adapt it only after confirming database ownership, quoting and transaction policy.

**Implementation**

The method allocates a query from `gSystemConnection.SQLD`, sets `ParamCheck := False`, calls `vxStartTransaction`, logs when a new transaction is started, appends `aSQL` to `SQL`, logs the statement, then calls `ExecSQL(True)`. The `True` argument requests the Delphi SQL-query direct-execution path. The temporary query is always freed.

`vxStartTransaction` can reuse an already active Velox transaction. This helper has no commit or rollback call, so its change participates in later flow-level completion.

**Side effects**

The statement can modify any database state allowed by the SQLD credentials. It can also open or join a connection transaction and writes the supplied SQL text to the Velox log.

**Performance and concurrency**

Execution is synchronous and can block the map while the database waits on I/O or locks. Transaction scope can prolong locks beyond the function call. The connection is execution-context state and must not be shared across independent scripts.

**Related entries**

- [`ExecSQLData`](ExecSQLData.md) opens a dataset instead of executing a non-query.
- [`ExecSQLDest`](ExecSQLDest.md) targets the primary destination.
- [`ExecSQLDestCommit`](ExecSQLDestCommit.md) requests immediate destination completion when module transactions are enabled.

**External references**

- [Embarcadero `Data.SqlExpr.TSQLQuery.ExecSQL`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.SqlExpr.TSQLQuery.ExecSQL) - documents executing statements that do not return a cursor. Velox discards the affected-row result and adds its own transaction/logging wrapper.

<small>Created 2026-07-15</small>
