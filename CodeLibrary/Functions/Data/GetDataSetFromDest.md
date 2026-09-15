---
title: "GetDataSetFromDest"
description: "Opens SQL into a client dataset using a selected destination database connection."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, destination, sql, dataset, index]
---

```Delphi
procedure GetDataSetFromDest(const aDataSet: TvxClientDataSet;
  const aSQL: string; aDBIndex: integer);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  GetDataSetFromDest(Data,
    'select DocumentNo, Status from ExampleTarget where Status = ''Pending''', 1);
  Value := Data.RecordCount;
end;
```

### Usage

`GetDataSetFromDest` opens SQL into a client dataset using a selected destination database connection.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet` | Existing mutable dataset to reset and open. |
| `aSQL` | `string`, `const` | Query SQL. Parameter recognition is disabled. |
| `aDBIndex` | `integer` | Zero-based destination connection index. The script declaration requires it. |

**Returns**

No status. Success leaves the dataset active even when the result has no rows.

**Security and safety**

Direct SQL plus disabled parameter recognition requires trusted or correctly validated/quoted input. The full statement is logged. Open is synchronous and result size matters. Dataset and selected map connection are mutable and must not be shared concurrently.

### Additional Technical Info
`GetDataSetFromDest` closes and rebinds a client dataset, then opens SQL using a destination connection selected by zero-based index.

The query and index are fictional. The example is source-reviewed and was not executed.

**Implementation**

The method closes the dataset, sets `ParamCheck := False`, clears fields, assigns `FDest.DBCons[aDBIndex].DBCon.SQLDATA`, sets/logs `CommandText`, and opens through `Active := True`. It does not explicitly start, commit or roll back a transaction.

**Side effects and errors**

The previous dataset schema, cursor and edit state are discarded before index selection. Negative/out-of-range indices and database errors are caught and logged with SQL/script context. They do not propagate, and the reset dataset can remain inactive or partly rebound.

**Related entries**

- [`GetDataFromDest`](GetDataFromDest.md) fixes the index at `0`.
- [`GetDataSetFromSource`](GetDataSetFromSource.md) uses the source list.
- [`ExecSQLStatementDest`](ExecSQLStatementDest.md) executes a non-query and starts/reuses a transaction.

**External references**

- [Embarcadero `Data.DB.TDataSet.Active`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Active) - opening the rebound cursor.

<small>Created 2026-07-15</small>
