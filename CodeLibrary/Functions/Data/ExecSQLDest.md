---
title: "ExecSQLDest"
description: "Executes SQL on the primary destination database and leaves transaction completion to the owning flow."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, sql, destination, transaction]
---

```Delphi
function ExecSQLDest(const aSQL: string): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExecSQLDest(
    'update ExampleTarget set Exported = 1 where DocumentNo = ''DEMO-1001''');
end;
```

### Usage

`ExecSQLDest` executes SQL on the primary destination database and leaves transaction completion to the owning flow.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSQL` | `string`, `const` | Complete SQL text for destination connection index `0`. Parameter recognition is disabled. |

**Returns**

Returns the wrapped function's `True` when direct execution finishes without raising, otherwise `False`. `True` does not mean committed and affected-row count is discarded.

**Errors**

Destination-list lookup and temporary-query creation happen before Velox method enters its protected query block, so missing connection state or creation failures can propagate into the script. Once a query exists, transaction and SQL exceptions are logged and suppressed into `False`. The transaction may remain active; flow-level error handling owns its final outcome.

**Security and safety**

No parameters are created. Do not concatenate untrusted values, and avoid putting secrets in logged SQL. Execution is synchronous and may wait on database locks.

**Usage notes**

Use this helper when the SQL change must participate in normal destination transaction completion. Use [`ExecSQLDestCommit`](ExecSQLDestCommit.md) only when immediate completion is explicitly required and its failure semantics are acceptable.

### Additional Technical Info
`ExecSQLDest` runs non-query SQL on the active map's primary destination database. It is an exact index-`0` wrapper around [`ExecSQLStatementDest`](ExecSQLStatementDest.md), so it starts or joins the destination's Velox transaction and leaves commit or rollback to the surrounding flow.

The table and value are fictional. The example is static, source-reviewed and was not executed.

**Implementation**

The wrapper calls `ExecSQLStatementDest(aSQL, 0)`. That method selects `DestDBCons[0]`, creates a temporary query, sets `ParamCheck := False`, asks the DB Connection module to start/reuse its Velox transaction, logs the SQL and calls `ExecSQL(True)`. It frees a successfully created query. If the module's `DisableTransactions` setting is enabled, its transaction-start wrapper is a no-op.

**Side effects and transaction ownership**

The statement can change destination data and hold locks until the map's owning transaction completes. The full SQL is logged. This helper neither commits nor rolls back, including on its caught error path.

**Related entries**

- [`ExecSQLStatementDest`](ExecSQLStatementDest.md) selects a destination by zero-based index.
- [`ExecSQLDestCommit`](ExecSQLDestCommit.md) commits immediately outside Test mode.
- [`ExecSQLSource`](ExecSQLSource.md) targets the primary source but does not explicitly start a transaction.

**External references**

- [Embarcadero `Data.SqlExpr.TSQLQuery.ExecSQL`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.SqlExpr.TSQLQuery.ExecSQL) - generic non-query execution used inside Velox's product-specific transaction wrapper.

<small>Created 2026-07-15</small>
