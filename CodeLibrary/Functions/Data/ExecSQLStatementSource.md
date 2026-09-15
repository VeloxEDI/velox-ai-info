---
title: "ExecSQLStatementSource"
description: "Executes SQL on a selected source database connection."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, sql, source, database]
---

```Delphi
function ExecSQLStatementSource(const aSQL: string;
  aDBIndex: integer): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExecSQLStatementSource(
    'update ExampleInbound set ReadFlag = 1 where MessageID = 1001', 1);
end;
```

### Usage

`ExecSQLStatementSource` executes SQL on a selected source database connection.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSQL` | `string`, `const` | Complete source SQL. Parameter recognition is disabled. |
| `aDBIndex` | `integer` | Zero-based source-list position. The script declaration requires it. |

**Returns**

`True` when direct execution returns normally; `False` for an SQL exception caught after query creation. Indexed connection lookup and query creation happen before the protected query body and can propagate. Rows affected are discarded and transaction completion is not reported.

**Security and safety**

Parameter binding is unavailable through this helper. Do not concatenate untrusted input, expose credentials in SQL, or modify a source system without explicit authorisation. Execution is synchronous and may wait on the remote database.

### Additional Technical Info
`ExecSQLStatementSource` executes non-query SQL on a source connection selected by zero-based index. Unlike the destination form, its current implementation does not explicitly start a Velox transaction.

The example is fictional, source-reviewed and was not executed.

**Implementation**

The function selects `SourceDBCons[aDBIndex].SQLDATA`, creates a query, sets `ParamCheck := False`, appends and logs `aSQL`, calls `ExecSQL(True)`, and frees the query. A declared local `TField` variable is unused; it has no runtime effect.

There is no `vxStartTransaction`, commit or rollback in this source path. Autocommit or transaction participation depends on existing connection state and driver configuration.

**Side effects and errors**

The statement may change the external source system and is logged in full. Lookup/creation exceptions can propagate; later query exceptions are logged and suppressed into `False`. No explicit transaction recovery occurs.

**Related entries**

- [`ExecSQLSource`](ExecSQLSource.md) fixes the source index at `0`.
- [`ExecSQLStatementDest`](ExecSQLStatementDest.md) explicitly starts/reuses a destination transaction.

**External references**

- [Embarcadero `Data.SqlExpr.TSQLQuery.ExecSQL`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.SqlExpr.TSQLQuery.ExecSQL) - direct statement operation used by the current implementation.

<small>Created 2026-07-15</small>
