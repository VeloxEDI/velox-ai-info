---
title: DisconnectDatabase
description: Rolls back any active transaction and disconnects the current SQL connection.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, database, disconnect, rollback]
---

```Delphi
function DisconnectDatabase: Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if DBCon = nil then
    Value := False
  else
    Value := DBCon.DisconnectDatabase;
end;
```

### Usage

`DisconnectDatabase` rolls back any active transaction and disconnects the current SQL connection.

**Behaviour**

The function returns true when it reaches the end, including when no SQLDATA object was assigned. It is therefore confirmation that no exception escaped, not proof that a previously open network session existed or closed.

The retained SQL connection object can be reconfigured/reconnected on later use. Disconnecting affects every query/dataset/transaction sharing that connection.

**Errors and quirks**

- Any active transaction is rolled back, never committed.
- The rollback occurs even when the DB connection module's `DisableTransactions` configuration is true because disconnect calls the lower connection function directly.
- Driver/network/disconnect/rollback exceptions are not caught here and can prevent a true result.
- Open datasets/commands using the connection can fail or become inactive according to their documented behaviour.
- This is not a pool-release method and does not make configuration changes durable.

### Additional Technical Info
`DisconnectDatabase` closes the SQL connection currently referenced by this DB connection module.

**Implementation**

If an SQLDATA object is assigned, the method calls its `Disconnect`. That connection first calls its rollback wrapper, then sets Connected false. `TvxDBCon` sets its cached connected flag false and returns true. It does not nil/release SQLDATA here.

**Performance and concurrency**

Can block on rollback and network/driver disconnect. Do not disconnect a connection while another part of the same execution is using it.

**Related entries**

- [`RollbackTran`](RollbackTran.md) — explicit transaction-only rollback.
- [`StartTransaction`](StartTransaction.md) — transaction begin.
- [`TvxDBCon`](../../TvxDBCon.md) — retained pooled connection model.

<small>Created 2026-07-15</small>
