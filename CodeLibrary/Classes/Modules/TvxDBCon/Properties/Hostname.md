---
title: Hostname
description: Reads or changes the driver-specific server/host value stored on this Velox connection module.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, database, host, configuration]
---

```Delphi
property Hostname: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if DBCon <> nil then
    Value := DBCon.Hostname
  else
    Value := '';
end;
```

### Usage

`Hostname` reads or changes the driver-specific server/host value stored on this Velox connection module.

**Important usage notes**

- Blank/invalid/unreachable values fail later during connection.
- Tag resolution can change the effective endpoint from the stored text.
- Do not allow untrusted input to redirect a connection; endpoint selection is a security/egress and data-boundary decision.
- The value can reveal private infrastructure and should be protected in logs/responses.

### Additional Technical Info
`Hostname` is the stored server/host endpoint applied when Velox configures a database session.

Its grammar is connection-type/driver-specific and can represent more than a simple DNS hostname (for example, an instance or service syntax). Velox does not validate it in this setter.

**Implementation and behaviour**

The property directly accesses the module field. ConnectDatabase processes tags with no action locals, then uses the resolved value in both main/sub connection parameter setup.

Assignment does not perform DNS lookup, authenticate, connect, disconnect or save configuration. An already-connected SQLDATA session is not retargeted; deliberate disconnect/reconnect is required before changed parameters can take effect.

**Performance and concurrency**

Access is constant-time; connection effects occur later. Do not mutate a module while another operation uses its current connection.

**Related entries**

- [`Database`](Database.md), [`Username`](Username.md) and [`PasswordEncrypted`](PasswordEncrypted.md) — related fields.
- [`TvxDBCon`](../../TvxDBCon.md) — connection lifecycle.

<small>Created 2026-07-15</small>
