---
title: TvxDBCon
description: Represents a Velox database-connection module and its live pooled SQL connection context.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - modules
  - database
---

```Delphi
TvxDBCon = class(TvxModule)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if DBCon <> nil then
    Value := DBCon.Database
  else
    Value := '';
end;
```

### Usage

`TvxDBCon` represents a Velox database-connection module and its live pooled SQL connection context.

**Behaviour**

Configuration strings are stored on the module. When a connection is established, Velox processes tags, decrypts the stored password and applies driver/authentication parameters to the SQL connection. An already-connected SQL connection is accepted without reapplying changed fields.

The transaction procedures operate on the single current SQL connection/transaction and expose no return state. They can be disabled by non-script-visible module configuration. Disconnect rolls back any active transaction and closes the current connection but retains the SQLDATA object reference for later reuse.

**Usage notes**

Velox owns the module. Do not free it. Treat transaction calls as database control operations with irreversible consequences, and preserve rollback handling around any unit of work the script is authorised to control.

### Additional Technical Info
`TvxDBCon` is the script-visible Velox module that holds database endpoint/authentication configuration and refers lazily to the SQL connection used for that module in the current execution/thread.

**Implementation**

The class is registered beneath a hidden module ancestor with four transaction/connection methods and four configuration properties. No constructor or explicit `ConnectDatabase` method is registered for scripts.

Obtain a manager-owned instance from [`DBCon`](../../Variables/Modules/DBCon.md), a [`TvxDBLink`](TvxDBLink.md) or another documented definition/link. The native `SQLDATA` getter uses the system connection for the two default modules or asks the process SQL connection pool for a connection; `TvxDBCon` does not own/free that pooled connection.

**Edge cases and quirks**

- Property assignment changes live module configuration fields but does not validate, reconnect or save the module.
- Connection acquisition can fail and log, leaving the internal SQL reference nil; transaction wrappers then have no explicit nil guard after the getter.
- StartTransaction silently does nothing when a transaction is already active. A later CommitTran/RollbackTran can still end that pre-existing transaction, so ownership of the transaction boundary must be unambiguous.
- The generated surface exposes encrypted password text but not the clear Password property. Ciphertext is still a secret and is not portable proof of a valid credential.

**Performance and concurrency**

Simple configuration reads are cheap. Lazy acquisition, connect/disconnect and transaction methods can block on pool/database/network state and can affect every operation enlisted on the same SQL connection. Use the module only within its current action/thread and do not mutate a shared connection configuration concurrently.

**Related entries**

- [`StartTransaction`](TvxDBCon/Methods/StartTransaction.md), [`CommitTran`](TvxDBCon/Methods/CommitTran.md) and [`RollbackTran`](TvxDBCon/Methods/RollbackTran.md) — explicit transaction controls.
- [`DisconnectDatabase`](TvxDBCon/Methods/DisconnectDatabase.md) — rollback/disconnect behaviour.
- [`DBCon`](../../Variables/Modules/DBCon.md) — current context accessor.
- [`TvxDBLink`](TvxDBLink.md) — configured link to a DB connection module.

<small>Created 2026-07-15</small>
