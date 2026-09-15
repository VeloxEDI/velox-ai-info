---
title: "ExecSQLStatementDest"
description: "Executes SQL on a selected destination connection within its current Velox transaction."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, sql, destination, transaction]
---

```Delphi
function ExecSQLStatementDest(const aSQL: string;
  aDBIndex: integer): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExecSQLStatementDest(
    'update ExampleTarget set Exported = 1 where DocumentNo = ''DEMO-1001''', 1);
end;
```

### Usage

`ExecSQLStatementDest` executes SQL on a selected destination connection within its current Velox transaction.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSQL` | `string`, `const` | Non-query SQL text. No parameter binding is performed. |
| `aDBIndex` | `integer` | Zero-based destination-list index. Negative or out-of-range values fail inside the logged exception boundary. |

**Returns**

`True` after `ExecSQL(True)` succeeds; `False` after an exception caught inside the protected query body. Destination lookup and query creation happen earlier and can propagate. Success is not a commit acknowledgement and affected-row count is discarded.

**Security and safety**

Use only trusted SQL or correctly validated/quoted values because parameter recognition is disabled. Execution is synchronous and can hold locks until later flow completion. Destination connections are mutable map-context objects and cannot safely be shared or retained.

### Additional Technical Info
`ExecSQLStatementDest` executes non-query SQL using a destination connection selected by zero-based index. It starts or joins that connection's Velox transaction but deliberately does not complete it.

The example is fictional, source-reviewed and not executed.

**Implementation**

The method gets `DestDBCons[aDBIndex]`, creates a query, sets `ParamCheck := False`, asks the DB Connection module to start/reuse its transaction, appends and logs `aSQL`, calls direct `ExecSQL`, and frees a successfully created query. It contains no commit or rollback. When `DisableTransactions` is enabled on the module, its start wrapper is a no-op.

**Side effects and errors**

With transactions enabled, database changes and locks remain governed by the surrounding transaction. Index selection and `NewQuery` evaluation occur outside the handler and can propagate; errors after query creation are logged and returned as `False`. The handler does not roll back. The SQL text itself is included in logging.

**Remarks**

This is the indexed form of [`ExecSQLDest`](ExecSQLDest.md). It is normally preferable to the immediate-commit variant when several destination changes must succeed or fail together.

**Related entries**

- [`ExecSQLDest`](ExecSQLDest.md) selects index `0`.
- [`ExecSQLStatementAndCommit`](ExecSQLStatementAndCommit.md) requests immediate completion when module transactions are enabled.

**External references**

- [Embarcadero `Data.SqlExpr.TSQLQuery.ExecSQL`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.SqlExpr.TSQLQuery.ExecSQL) - generic non-query call wrapped by Velox.

<small>Created 2026-07-15</small>
