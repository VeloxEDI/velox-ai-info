---
title: RollbackTran
description: Rolls back and ends the current SQL transaction when transactions are enabled and one is active.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, database, transaction, rollback]
---

```Delphi
procedure RollbackTran;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if DBCon = nil then
    raise Exception.Create('No database connection is available');
  DBCon.RollbackTran;
  Value := False;
end;
```

### Usage

`RollbackTran` rolls back and ends the current SQL transaction when transactions are enabled and one is active.

**Behaviour**

No return value identifies whether rollback occurred. It affects database changes enlisted on the same transaction/connection; it cannot undo already committed work or filesystem, email, HTTP and other external effects.

**Errors and quirks**

- No active transaction produces a silent no-op.
- A pre-existing transaction can be rolled back even when this script's StartTransaction call was a no-op.
- Transaction-disabled configuration makes this method a no-op, but [`DisconnectDatabase`](DisconnectDatabase.md) still calls the SQL connection's rollback path before disconnecting.
- If Velox cannot obtain the connection, the call can fail with an object-reference error. Database and driver rollback errors are raised to the script.

### Additional Technical Info
`RollbackTran` cancels changes in and ends the transaction currently held by this DB connection wrapper.

**Implementation**

Runtime registration maps to native `vxRollbackTran`. With transactions enabled, it obtains SQLDATA and calls `VxRollbackTran`, which invokes Delphi DBX `RollbackFreeAndNil` only when `InTransaction` is true. It logs a SQL rollback comment only when an actual transaction was rolled back.

**Performance and concurrency**

Rollback can block while the database reverses work and releases locks. Keep one explicit owner for the transaction boundary.

**Related entries**

- [`StartTransaction`](StartTransaction.md) and [`CommitTran`](CommitTran.md) — begin/commit paths.
- [`DisconnectDatabase`](DisconnectDatabase.md) — implicit rollback plus disconnect.

**External references**

- [Embarcadero DocWiki: `TSQLConnection.RollbackFreeAndNil`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.SqlExpr.TSQLConnection.RollbackFreeAndNil)

<small>Created 2026-07-15</small>
