---
title: CommitTran
description: Sequentially commits active transactions on a data definition's database connections and attempts rollback after the first raised commit error.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords: [velox, scripting, hidden-ancestor, data-definition, transaction, commit]
---

```Delphi
function CommitTran: Boolean;
```

### Example

```Delphi
function FinishDatabaseWork(const Data: TvxDBDef): Boolean;
begin
  Result := False;
  if Data = nil then
  begin
    LogError('No data definition is available.');
    Exit;
  end;
  if not Data.CommitTran then
  begin
    LogError('One or more database commits failed.');
    if not Data.RollbackTran then
      LogError('Best-effort transaction rollback was incomplete.');
    Exit;
  end;
  Result := True;
end;
```

This helper returns `False` after logging failure. The calling event must check the result and `Exit` before doing further work; an `Exit` inside the helper does not exit its caller. Follow [mandatory script failure handling](../../../../../instructions/scripts/failure-handling.md). Establish ownership of the transaction boundary before calling this example. Rollback is attempted explicitly on failure; it cannot undo earlier committed connections, and its result is checked separately.

### Usage

`CommitTran` sequentially commits active transactions on a data definition's database connections and attempts rollback after the first raised commit error.

- Treat a false result as a potentially partial commit requiring reconciliation, not as proof that nothing changed.
- Keep all participants on one database connection when true atomicity is required, or design an explicit distributed/recovery process.
- Check and surface the Boolean result. Database and connection errors are logged and cause a `False` result rather than being raised to the script.

### Additional Technical Info
`CommitTran` asks every configured database connection on a data definition to commit, in list order. It coordinates separate connection transactions; it is not an atomic distributed transaction.

#### Source-backed behaviour

If this data definition previously called `StartTransaction`, the method first logs an informational commit message and clears its internal `FTransactionStarted` flag. It then visits `DBCons[0]` upward while the result remains true and calls each link's `TvxDBCon.vxCommitTran`.

At connection level, disabled transactions are a silent no-op. Otherwise Velox commits the current DBX transaction only when that connection reports `InTransaction`; already-finished connections are also no-ops. These no-op cases still count as success here because the lower-level Boolean is not returned through `TvxDBCon`.

If a connection call raises, the method logs the exception, returns false, stops committing later connections and calls `RollbackTran`. That rollback cannot undo connections already committed. It starts again at connection zero and can stop at its own first error, so later connections may remain active.

Zero configured connections returns true. Calling without a preceding data-definition `StartTransaction` still attempts the per-connection commit operations but suppresses the one-time informational message.

#### Operational guidance

- Treat a false result as a potentially partial commit requiring reconciliation, not as proof that nothing changed.
- Keep all participants on one database connection when true atomicity is required, or design an explicit distributed/recovery process.
- Check and surface the Boolean result; database, driver, connection and lazy-load errors are logged internally rather than re-raised by this wrapper.
- This method affects database transactions only. It cannot commit or reverse files, HTTP calls, messages or other external effects.

#### Related entries and terminal reference

- [`StartTransaction`](StartTransaction.md) and [`RollbackTran`](RollbackTran.md) describe the matching group boundaries.
- [`TvxDBCon.CommitTran`](../../../Modules/TvxDBCon/Methods/CommitTran.md) documents the single-connection terminal.
- [Embarcadero: TSQLConnection.CommitFreeAndNil](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.SqlExpr.TSQLConnection.CommitFreeAndNil)

<small>Created 2026-07-15</small>
