---
title: StartTransaction
description: Sequentially starts transactions on a data definition's configured database connections without providing distributed atomicity or nested ownership.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, data-definition, transaction, begin]
---

```Delphi
function StartTransaction: Boolean;
```

### Example

```Delphi
procedure BeginDatabaseWork(const Data: TvxDBDef);
begin
  if not Data.StartTransaction then
    raise Exception.Create('Not all database transactions could be started');
end;
```

### Usage

`StartTransaction` sequentially starts transactions on a data definition's configured database connections without providing distributed atomicity or nested ownership.

- On a false result, call `RollbackTran` and treat rollback failure as a separate error.
- Put the shortest possible database-only work between start and commit/rollback; do not hold locks across file, email, HTTP or user-interaction work.
- Do not infer transaction ownership from a true result: a connection may have had transactions disabled or may already have been in a transaction.

### Additional Technical Info
`StartTransaction` visits the data definition's database links in order and asks each linked connection to start a DBX transaction.

#### Source-backed behaviour

The data definition sets its internal `FTransactionStarted` flag before touching any connection. It then calls `DBCons[index].DBCon.vxStartTransaction` from index zero while the result remains true.

At connection level, configured `DisableTransactions=True` is a silent no-op. Otherwise the underlying `TvxSQLConnection` calls `BeginTransaction` only when `InTransaction=False`; an already-active transaction is also a no-op. The group wrapper ignores that lower-level Boolean, so no-op connections still count as successful.

If a call raises, Velox logs `Error creating SQL transaction`, returns false and stops. It does not roll back transactions already started on earlier connections, and the internal started flag remains true. A later explicit `RollbackTran` is therefore required for best-effort cleanup. An empty connection list returns true after setting the flag.

This is a sequence of independent transactions. There is no two-phase commit, nesting token or guarantee that all connections enter the same isolation boundary.

#### Operational guidance

- On a false result, call `RollbackTran` and treat rollback failure as a separate error.
- Put the shortest possible database-only work between start and commit/rollback; do not hold locks across file, email, HTTP or user-interaction work.
- Do not infer transaction ownership from a true result: a connection may have had transactions disabled or may already have been in a transaction.

#### Related entries and terminal reference

- [`CommitTran`](CommitTran.md) and [`RollbackTran`](RollbackTran.md) complete the group lifecycle.
- [`TvxDBCon.StartTransaction`](../../../Modules/TvxDBCon/Methods/StartTransaction.md) documents the single-connection terminal.
- [Embarcadero: TSQLConnection.BeginTransaction](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.SqlExpr.TSQLConnection.BeginTransaction)

<small>Created 2026-07-15</small>
