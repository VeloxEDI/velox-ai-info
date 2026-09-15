---
title: CommitTran
description: Commits and ends the current SQL transaction when transactions are enabled and one is active.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, database, transaction, commit]
---

```Delphi
procedure CommitTran;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if DBCon = nil then
    raise Exception.Create('No database connection is available');
  DBCon.CommitTran;
  Value := True;
end;
```

### Usage

`CommitTran` commits and ends the current SQL transaction when transactions are enabled and one is active.

**Behaviour**

There is no return value distinguishing a commit from a no-op. A successful commit makes all changes enlisted on that SQL connection durable according to database/driver rules and ends the stored transaction.

**Errors and quirks**

- With no active transaction, the function quietly does nothing.
- If StartTransaction previously saw an already-active transaction, this call can commit that pre-existing transaction; no per-script ownership token exists.
- If Velox cannot obtain the connection, the call can fail with an object-reference error. Database and driver commit errors are raised to the script.
- Commit affects the SQL connection, not arbitrary database work performed through other connections and not external file/network effects.
- A commit cannot be undone by a later script exception or RollbackTran.

**Side effects**

Can permanently publish database changes and release transaction resources/locks. It does not save the `TvxDBCon` module configuration.

### Additional Technical Info
`CommitTran` commits and ends the transaction currently held by this DB connection wrapper.

**Implementation**

Runtime registration maps to native `vxCommitTran`. When transactions are disabled it does nothing. Otherwise it obtains SQLDATA and calls `VxCommitTran`, which calls Delphi DBX `CommitFreeAndNil` only when `InTransaction` is true. A SQL log comment is written only when a transaction was actually committed.

**Performance and concurrency**

Commit can block on database logging, constraints, locks and network I/O. Do not let another execution share/control the same transaction boundary.

**Related entries**

- [`StartTransaction`](StartTransaction.md) and [`RollbackTran`](RollbackTran.md) — begin/cancel paths.
- [`TvxDBCon`](../../TvxDBCon.md) — shared connection context.

**External references**

- [Embarcadero DocWiki: `TSQLConnection.CommitFreeAndNil`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.SqlExpr.TSQLConnection.CommitFreeAndNil)

<small>Created 2026-07-15</small>
