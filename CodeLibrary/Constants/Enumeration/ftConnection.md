---
title: ftConnection
description: Identifies a connection object in Delphi parameter marshalling rather than an ordinary stored dataset column.
sidebar_position: 93
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, parameter, connection, object]
---

```Delphi
ftConnection = 46
```

### Example

```Delphi
function IsConnectionParameter(DataType: TFieldType): Boolean;
begin
  Result := DataType = ftConnection;
end;
```

### Usage

`ftConnection` identifies a connection object in Velox parameter marshalling rather than an ordinary stored dataset column.

### Additional Technical Info
`ftConnection` is ordinal 46 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). The installed RTL has no default field class for it; it is an object/parameter-marshalling marker rather than a normal scalar column.

The value does not open a database, select a driver or prove that a connection is active. A supplied connection can carry credentials, transactions and mutable shared state. Respect the owning API's exact expected class/interface, lifetime and thread-affinity contract. Do not retain, close, free or reuse it across threads unless ownership explicitly permits that.

Treat unknown values as unsupported rather than casting by ordinal. Never serialize the live object or expose credentials from its properties/logging.

The example only compares metadata and was source-reviewed; no connection, database, object, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; object-marshalling parity is not implied.

<small>Created 2026-07-15</small>
