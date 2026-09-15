---
title: Database
description: Reads or changes the driver-specific database/catalog name stored on this Velox connection module.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, database, configuration]
---

```Delphi
property Database: String read write;
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

Reads or changes the driver-specific database/catalog name stored on this Velox connection module.

**Important usage notes**

- An empty or malformed value can defer failure until connection/query time.
- Database names are driver/server-specific; do not concatenate untrusted input or treat the string as an SQL identifier automatically safe for a query.
- Changing the live module can affect later operations/executions that reuse it.
- Reading can expose infrastructure naming; avoid returning it to untrusted clients unnecessarily.

### Additional Technical Info
`Database` is the stored database/catalog value applied when Velox configures a new database session.

The exact syntax and whether the field is required depend on the configured driver/database type. A new generic module defaults to empty; default system modules can load the value from global connection configuration.

**Implementation and behaviour**

The getter/setter directly read/write the module field. On connect, Velox processes tags in the value with no action-locals list and passes the result into driver parameter setup.

Assignment performs no validation, connection, disconnection or module save. If SQLDATA is already connected, ConnectDatabase returns success without reapplying parameters, so the current session remains on its existing database until an intentional safe disconnect/reconnect/reacquisition.

**Performance and concurrency**

Field access is constant-time. Reconfiguration is not synchronised as a script-level atomic reconnect operation.

**Related entries**

- [`Hostname`](Hostname.md), [`Username`](Username.md) and [`PasswordEncrypted`](PasswordEncrypted.md) — related connection fields.
- [`DisconnectDatabase`](../Methods/DisconnectDatabase.md) — closes the current session before reviewed reconfiguration.

<small>Created 2026-07-15</small>
