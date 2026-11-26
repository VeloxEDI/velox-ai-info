---
title: StartTransaction
description: Starts one transaction on the current pooled SQL connection when transactions are enabled and none is active.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords: [velox, scripting, database, transaction]
---

```Delphi
procedure StartTransaction;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Con: TvxDBCon;
  Committed: Boolean;
begin
  Con := DBCon;
  if Con = nil then
  begin
    LogError('No database connection is available.');
    Exit;
  end;
  Committed := False;
  try
    try
      Con.StartTransaction;
      { Perform only database work owned by this transaction boundary.
        A known validation failure here must call LogError and Exit;
        the finally block still attempts rollback before returning. }
      Con.CommitTran;
      Committed := True;
    finally
      if not Committed then
      begin
        try
          Con.RollbackTran;
        except
          LogError('Rollback cleanup failed: ' + ExceptionToString(ExceptionType, ExceptionParam));
        end;
      end;
    end;
  except
    LogError('Database work failed: ' + ExceptionToString(ExceptionType, ExceptionParam));
    Exit;
  end;
  if not Committed then
    Exit;
end;
```

Precondition: configuration/caller review has established ownership of this transaction boundary. StartTransaction alone does not prove ownership. The explicit finally cleanup runs on a local Exit as well as an unexpected failure; LogError itself triggers neither rollback nor the except handler.

### Usage

`StartTransaction` starts one transaction on the current pooled SQL connection when transactions are enabled and none is active.

**Behaviour**

The procedure has no Boolean result. It can therefore return normally because it started a transaction, because transactions are disabled, or because a transaction was already active. All database work routed through the same SQL connection after a successful begin is enlisted until commit/rollback/disconnect.

**Errors and quirks**

- If Velox cannot obtain the connection, the call can fail with an object-reference error.
- Database, driver and network errors are raised to the script.
- It is not a nested transaction API. When an existing transaction is active, StartTransaction is a no-op, but a later CommitTran/RollbackTran can end that existing transaction.
- The script cannot read `DisableTransactions`, `Connected` or `InTransaction` through this class surface, so it cannot prove that it owns a new transaction after the call.
- Do not start a transaction around long external/network/file work; that extends locks and failure exposure.

**Side effects**

Can acquire a pooled connection, contact the database, allocate a DBX transaction and begin database locking/isolation scope.

### Additional Technical Info
`StartTransaction` asks the current SQL connection to begin a DBX transaction.

**Implementation**

Runtime registration maps this scripting name to native `vxStartTransaction`. When module configuration has transactions disabled, it returns immediately. Otherwise it evaluates the lazy SQLDATA property and calls the connection wrapper, which begins a Delphi DBX transaction only when `InTransaction` is false and stores the returned transaction object. A SQL log comment is added only when a new transaction actually starts.

**Performance and concurrency**

May block on pool and database/network operations. Use one well-defined owner per connection transaction; never coordinate concurrent scripts through this call.

**Related entries**

- [`CommitTran`](CommitTran.md) and [`RollbackTran`](RollbackTran.md) — end the current transaction.
- [`DisconnectDatabase`](DisconnectDatabase.md) — rolls back before disconnecting.
- [`TvxDBCon`](../../TvxDBCon.md) — connection and ownership model.

**External references**

- [Embarcadero DocWiki: `TSQLConnection.BeginTransaction`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.SqlExpr.TSQLConnection.BeginTransaction)

<small>Created 2026-07-15</small>
