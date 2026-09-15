---
title: "ExecSQLStatementAndCommit"
description: "Executes SQL on a selected destination and requests immediate commit or Test rollback when transactions are enabled."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, sql, destination, commit, rollback]
---

```Delphi
function ExecSQLStatementAndCommit(const aSQL: string;
  aDBIndex: integer): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExecSQLStatementAndCommit(
    'insert into ExampleAudit (EventText) values (''DEMO ONLY'')', 1);
end;
```

### Usage

`ExecSQLStatementAndCommit` executes SQL on a selected destination and requests immediate commit or Test rollback when transactions are enabled.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSQL` | `string`, `const` | Complete destination SQL. Parameter recognition is disabled. |
| `aDBIndex` | `integer` | Zero-based position in the active map's destination connection list. This value is required in scripts. |

**Returns**

`True` is assigned after direct SQL execution but before commit/Test rollback. A completion exception is caught without resetting that value, so `True` can be returned even when completion failed. Earlier caught errors leave `False`; index or query-creation errors occur outside the handler and can propagate. Rows affected are not returned.

**Security and operational risks**

- No SQL parameters are created; validate and quote any embedded value.
- Full SQL text is logged and can expose literal business data.
- With transactions enabled, Test mode executes the statement before rollback and cannot reverse non-transactional external effects; with transactions disabled, the function does not roll it back.
- Immediate completion changes the map's transaction boundary and can weaken atomicity with later map work.

### Additional Technical Info
`ExecSQLStatementAndCommit` runs non-query SQL on a destination chosen by zero-based index and requests immediate transaction completion: rollback in Velox Test mode, commit otherwise. The DB Connection wrapper skips those transaction calls when transactions are disabled.

The table and index are fictional. The example is source-reviewed and was not executed.

**Implementation**

The method indexes `DestDBCons`, creates a query from that `TvxDBCon`, disables `ParamCheck`, asks the DB Connection module to start/reuse its Velox transaction, appends and logs the SQL, and calls `ExecSQL(True)`. It sets `Result := True`, then calls `vxRollbackTran` if `Test` is set or `vxCommitTran` otherwise. A successfully created query is freed in `finally`.

**Critical transaction semantics**

Starting can reuse an existing transaction. The subsequent commit or rollback operates on the connection transaction, not on an independently nested transaction proved to contain only this call. Earlier work on the same connection may be completed with it.

If the selected DB Connection has `DisableTransactions` enabled, all three DB Connection transaction wrappers are no-ops. In that mode Test does not roll this SQL back and persistence follows the underlying driver/connection behaviour.

Index lookup and `NewQuery` evaluation precede the `try` blocks and can propagate. If start, SQL execution, commit or rollback raises after query creation, the catch block logs the exception but does not explicitly roll back. `False` cannot be interpreted as “nothing persisted” or “connection reset,” and a completion failure can retain the already assigned `True`.

**Performance and concurrency**

SQL, commit and rollback are synchronous and can wait on locks or storage. The indexed connection belongs to the current map and must not be retained or used concurrently.

**Related entries**

- [`ExecSQLDestCommit`](ExecSQLDestCommit.md) fixes `aDBIndex` at `0`.
- [`ExecSQLStatementDest`](ExecSQLStatementDest.md) leaves transaction completion to the flow.

**External references**

- [Embarcadero `Data.SqlExpr.TSQLQuery.ExecSQL`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.SqlExpr.TSQLQuery.ExecSQL) - underlying statement execution; indexed connection selection and transaction completion are Velox-owned.

<small>Created 2026-07-15</small>
