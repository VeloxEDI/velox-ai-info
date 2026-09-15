---
title: RollbackTran
description: Sequentially rolls back active transactions on a data definition's database connections until all finish or the first rollback call raises.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, data-definition, transaction, rollback]
---

```Delphi
function RollbackTran: Boolean;
```

### Example

```Delphi
procedure CancelDatabaseWork(const Data: TvxDBDef);
begin
  if not Data.RollbackTran then
    raise Exception.Create('One or more database rollbacks failed');
end;
```

### Usage

`RollbackTran` sequentially rolls back active transactions on a data definition's database connections until all finish or the first rollback call raises.

- Always inspect the Boolean result and assume cleanup may be incomplete when false.
- A true result means no function call raised; it does not prove that a transaction existed or that every prior external effect was reversible.
- Rollback cannot undo a connection already committed by an earlier step or by a partial `CommitTran`.

### Additional Technical Info
`RollbackTran` asks the configured database connections to roll back their current transactions in list order.

#### Source-backed behaviour

If the data definition's internal transaction-started flag is true, the method logs one rollback message and clears that flag. It still enters the connection loop when the flag was already false.

For each `DBCons[index]`, Velox calls the linked `TvxDBCon.vxRollbackTran`. Transactions disabled in that connection and connections with no active transaction are silent successful no-ops. An actual active DBX transaction is rolled back and freed. The group method does not inspect the lower-level Boolean, so normal completion returns true even if every connection was a no-op or the list was empty.

If a connection call raises, the exception is logged, the result becomes false and the `while Result` condition prevents later connections from being visited. This contradicts the nearby source comment that says rollback will carry on. Earlier connections may have rolled back while later ones remain active.

#### Related entries and terminal reference

- [`StartTransaction`](StartTransaction.md) and [`CommitTran`](CommitTran.md) document the matching begin/commit paths.
- [`TvxDBCon.RollbackTran`](../../../Modules/TvxDBCon/Methods/RollbackTran.md) documents the single-connection terminal.
- [Embarcadero: TSQLConnection.RollbackFreeAndNil](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.SqlExpr.TSQLConnection.RollbackFreeAndNil)

<small>Created 2026-07-15</small>
