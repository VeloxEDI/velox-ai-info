---
title: "ExecSQLSource"
description: "Executes SQL on the primary source database connection."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, sql, source, database]
---

```Delphi
function ExecSQLSource(const aSQL: string): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExecSQLSource(
    'update ExampleInbound set ReadFlag = 1 where MessageID = 1001');
end;
```

### Usage

`ExecSQLSource` executes SQL on the primary source database connection.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSQL` | `string`, `const` | Complete non-query SQL text for the primary source connection. Parameter checking is disabled. |

**Returns**

`True` after direct query execution returns normally; `False` after a caught exception. Affected-row count is not returned and no commit is performed here.

**Security and safety**

The method performs no value parameterisation. Treat the source as an external system of record: require explicit authorisation, avoid untrusted concatenation, and do not expose secrets in logged text. Execution is synchronous and may block.

**Usage notes**

Do not assume destination transaction semantics apply merely because the names are parallel. If atomic source changes are required, confirm the configured driver's transaction policy and the surrounding map's connection lifecycle.

### Additional Technical Info
`ExecSQLSource` executes non-query SQL on source connection index `0`. It is an exact wrapper around [`ExecSQLStatementSource`](ExecSQLStatementSource.md).

The objects and values are fictional. The example is source-reviewed, not executed, and must not be copied into production without source-system authorisation.

**Implementation**

The wrapper calls `ExecSQLStatementSource(aSQL, 0)`. That method selects `SourceDBCons[0].SQLDATA`, creates a query, sets `ParamCheck := False`, logs the SQL and calls `ExecSQL(True)`, then frees a successfully created query.

Unlike the corresponding destination method, the current source implementation does **not** call `vxStartTransaction` and does not commit or roll back. Effective transaction/autocommit behaviour therefore depends on the already configured source connection and surrounding flow.

**Side effects and errors**

The statement can modify the source system and the full text is logged. Source-list lookup and query creation occur before the protected query block and can propagate. SQL errors after query creation are caught, logged and suppressed into `False`; no cleanup transaction call is made.

**Related entries**

- [`ExecSQLStatementSource`](ExecSQLStatementSource.md) accepts a zero-based source index.
- [`ExecSQLDest`](ExecSQLDest.md) explicitly starts/reuses a destination Velox transaction.

**External references**

- [Embarcadero `Data.SqlExpr.TSQLQuery.ExecSQL`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.SqlExpr.TSQLQuery.ExecSQL) - underlying direct non-query execution; connection policy and error suppression are Velox-specific.

<small>Created 2026-07-15</small>
