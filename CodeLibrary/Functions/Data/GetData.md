---
title: "GetData"
description: "Opens SQL into a client dataset using the Velox Data database connection."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data-platform, sql, dataset]
---

```Delphi
procedure GetData(const aDataSet: TvxClientDataSet;
  const aSQL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  GetData(Data,
    'select ItemID, Status from ExampleQueue where Status = ''Ready''');
  Value := Data.RecordCount;
end;
```

### Usage

`GetData` opens SQL into a client dataset using the Velox Data database connection.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet`, `const` reference | Mutable dataset to close, clear, bind to SQLD and open. |
| `aSQL` | `string`, `const` | Query text expected to return a cursor. Parameter recognition is disabled. |

**Returns**

No status. A successful call leaves `aDataSet.Active = True`; an empty cursor is not a failure.

**Security and data safety**

The SQL text is direct and fully logged. Do not concatenate untrusted input, and select only columns/rows required by the map. The function does not establish read-only behaviour; database permissions and statement text determine what the connection can do, although opening `Active` is intended for cursor-returning SQL.

### Additional Technical Info
`GetData` closes and rebinds a supplied client dataset, then opens a query on the Velox Data database connection (`gSystemConnection.SQLD`).

The objects are fictional. The example is source-reviewed and was not executed.

**Implementation**

The method closes the dataset, disables `SQLDataSet.ParamCheck`, clears `FieldDefs`, assigns `gSystemConnection.SQLD`, sets and logs `CommandText`, and opens it with `Active := True`. Unlike [`ExecSQLData`](ExecSQLData.md), this wrapper does not explicitly call `vxStartTransaction`.

**Side effects and errors**

Existing fields, cursor position, edits, SQL and connection are discarded. Exceptions are caught, reduced to a key SQL error line for the message, logged with the script/full SQL context and suppressed. There is no Boolean result; after failure the dataset can be inactive and partially rebound.

**Performance and concurrency**

Open/fetch is synchronous. Large results can delay the map and consume client-dataset memory; later cursor operations may perform further fetches. The same dataset must not be rebound while another consumer uses it.

**Related entries**

- [`GetConfig`](GetConfig.md) targets Velox configuration data.
- [`ExecSQLData`](ExecSQLData.md) explicitly starts/reuses an SQLD transaction before opening.
- [`ExecSQL`](ExecSQL.md) executes non-query SQLD statements.

**External references**

- [Embarcadero `Data.DB.TDataSet.Active`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Active) - underlying open operation.
- [Free Pascal `TDataSet.Active`](https://www.freepascal.org/docs-html/fcl/db/tdataset.active.html) - compatible open-state concept, not the Velox connection contract.

<small>Created 2026-07-15</small>
