---
title: "GetDataFromDB"
description: "Opens SQL into a client dataset through the DB Connection module identified by a FID."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, database-connection, fid, sql, dataset]
---

```Delphi
procedure GetDataFromDB(const aDBConFID: TGuid;
  const aDataSet: TvxClientDataSet; const aSQL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  GetDataFromDB(
    SafeStringToGuid('{11111111-2222-3333-4444-555555555555}'),
    Data,
    'select ItemID, ItemText from ExampleItems where Enabled = 1');
  Value := Data.RecordCount;
end;
```

### Usage

`GetDataFromDB` opens SQL into a client dataset through the DB Connection module identified by a FID.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDBConFID` | `TGuid`, `const` | FID of a module that must resolve as `TvxDBCon`. |
| `aDataSet` | `TvxClientDataSet`, `const` reference | Mutable dataset to close, clear, bind and open. |
| `aSQL` | `string`, `const` | Query text. Parameter recognition is disabled. |

**Returns**

No status. On success, the dataset is active on the module connection. Missing modules and query failures are observable only through dataset state and logs.

**Security and safety**

The FID selects credentials and an external endpoint configured in Velox; validate that the module is appropriate for the data. SQL is not parameterised and is logged. Connection and query work can block. The module connection and caller dataset are shared context objects, not safe cross-execution handles.

### Additional Technical Info
`GetDataFromDB` resolves a Velox DB Connection module by FID, asks that module to connect, and then attempts to open SQL into a caller-supplied dataset using the module's `SQLDATA` connection.

The GUID, table and dataset use are fictional. Replace the GUID with an approved DB Connection module FID. The example is source-reviewed and was not executed.

**Implementation**

Before module lookup, the method closes the dataset, disables parameter checking and clears `FieldDefs`. It calls `gModuleManager.Get(aDBConFID, TvxDBCon)` and hard-casts the result. When present, it assigns `lDBCon.SQLDATA`, calls `lDBCon.ConnectDatabase`, assigns/logs the SQL and opens the dataset.

`ConnectDatabase` catches its own connection exception, logs it and returns `False`, but `GetDataFromDB` ignores that Boolean and still attempts to open the dataset. The later open will normally produce the logged SQL error when no usable connection remains; the procedure still has no status result.

**Missing-module quirk**

If no matching DB Connection loads, the method logs the FID, guidance and SQL, then exits normally. The original dataset has already been closed and cleared; no exception or `False` tells the script that lookup failed.

**Side effects and errors**

The existing cursor/schema/edit state is destroyed. `ConnectDatabase` can open an external connection synchronously. General exceptions are caught and logged with the key SQL error, script and SQL text; they are not propagated.

**Related entries**

- [`GetData`](GetData.md) uses the fixed Velox Data connection.
- [`GetDataSetFromSource`](GetDataSetFromSource.md) selects a configured source by index.
- [`GetDataSetFromDest`](GetDataSetFromDest.md) selects a configured destination by index.

**External references**

- [Embarcadero `Data.DB.TDataSet.Active`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Active) - Delphi dataset open/close behaviour; FID resolution and connection management are Velox-specific.

<small>Created 2026-07-15</small>
