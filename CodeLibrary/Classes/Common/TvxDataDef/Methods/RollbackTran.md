---
title: RollbackTran
description: Sequentially rolls back active transactions on a data definition's database connections until all finish or the first rollback call raises.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords: [velox, scripting, hidden-ancestor, data-definition, transaction, rollback]
---

```Delphi
function RollbackTran: Boolean;
```

### Example

```Delphi
function CancelDatabaseWork(const Data: TvxDBDef): Boolean;
begin
  Result := False;
  if Data = nil then
  begin
    LogError('No data definition is available.');
    Exit;
  end;
  if not Data.RollbackTran then
  begin
    LogError('One or more database rollbacks failed.');
    Exit;
  end;
  Result := True;
end;
```

This helper returns `False` after logging failure. The calling event must check the result and `Exit` before doing further work; an `Exit` inside the helper does not exit its caller. Follow [mandatory script failure handling](../../../../../instructions/scripts/failure-handling.md).

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
