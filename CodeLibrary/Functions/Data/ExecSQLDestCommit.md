---
title: "ExecSQLDestCommit"
description: "Executes SQL on the primary destination and requests immediate commit or Test rollback when transactions are enabled."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, sql, destination, commit, test-mode]
---

```Delphi
function ExecSQLDestCommit(const aSQL: string): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Immediate commit changes transaction boundaries; use deliberately.
  Value := ExecSQLDestCommit(
    'insert into ExampleAudit (EventText) values (''DEMO ONLY'')');
end;
```

### Usage

`ExecSQLDestCommit` executes SQL on the primary destination and requests immediate commit or Test rollback when transactions are enabled.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSQL` | `string`, `const` | Complete non-query SQL for the primary destination. No parameter binding is performed. |

**Returns**

`True` is assigned immediately after SQL execution, **before** the normal commit or Test-mode rollback. If that completion call then raises, the exception is logged but Velox does not reset `Result`; the function can therefore return `True` even though completion failed. Exceptions caught before the assignment leave `False`. Connection lookup/query-creation failures occur outside the handler and can propagate.

**Security and safety**

`ParamCheck := False`; concatenated external input can produce injection or quoting failures, and literal data is logged. SQL and transaction completion are synchronous and may block. The connection is mutable map state, not a reusable concurrent resource.

### Additional Technical Info
`ExecSQLDestCommit` executes non-query SQL on destination connection index `0`, then requests a normal commit or, when the Velox `Test` flag is set, a rollback. This is an exact wrapper around [`ExecSQLStatementAndCommit`](ExecSQLStatementAndCommit.md). The transaction operations are skipped when that DB Connection module disables transactions.

The SQL is fictional and was not executed. The example is source-reviewed and intentionally calls attention to the transaction boundary.

**Implementation**

The wrapper calls `ExecSQLStatementAndCommit(aSQL, 0)`. The selected destination connection creates a query, disables parameter checking, asks the DB Connection module to start/reuse a transaction, logs and directly executes the SQL. After setting the result to `True`, the method calls `vxRollbackTran` when `Test` is true, otherwise `vxCommitTran`.

**Transaction consequences**

Immediate completion can also complete a transaction that was already active when the helper was called, depending on connection transaction state. It can therefore commit or test-roll back more work than the single statement. Do not use it as a local statement-only commit unless the surrounding flow guarantees transaction isolation.

When the DB Connection module has `DisableTransactions` enabled, its start, commit and rollback wrappers all do nothing. In that mode Test does not cause this helper to roll back the SQL; effective persistence follows the driver/connection behaviour.

**Errors and critical quirk**

Destination lookup and query creation are outside the protected query block and can propagate. Later exceptions are caught and logged. The handler does **not** explicitly roll back; if execution fails, `False` remains, while a completion failure after successful execution can leave `True`. An active or partially resolved transaction can remain for later connection/flow handling. A successfully created temporary query is still freed.

**Remarks**

With transactions enabled, Test mode attempts to prevent the successful statement from being committed, but it does not make arbitrary SQL harmless: the database still executes it before rollback, can take locks, can invoke non-transactional effects, and can fail. Test behaviour reaches rollback only after successful execution. With transactions disabled, no rollback is attempted by the DB Connection wrapper.

**Related entries**

- [`ExecSQLStatementAndCommit`](ExecSQLStatementAndCommit.md) selects the destination index explicitly.
- [`ExecSQLDest`](ExecSQLDest.md) leaves completion to normal flow ownership.

**External references**

- [Embarcadero `Data.SqlExpr.TSQLQuery.ExecSQL`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.SqlExpr.TSQLQuery.ExecSQL) - underlying Delphi non-query operation; commit, rollback, Test mode and exception suppression are Velox behaviour.

<small>Created 2026-07-15</small>
