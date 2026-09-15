---
title: "GetDataSetFromSource"
description: "Opens SQL into a client dataset using a selected source database connection."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, source, sql, dataset, index]
---

```Delphi
procedure GetDataSetFromSource(const aDataSet: TvxClientDataSet;
  const aSQL: string; aDBIndex: integer);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  GetDataSetFromSource(Data,
    'select MessageID, ReceivedAt from ExampleInbound where ReadFlag = 0', 1);
  Value := Data.RecordCount;
end;
```

### Usage

`GetDataSetFromSource` opens SQL into a client dataset using a selected source database connection.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet` | Existing mutable dataset to reset and open. |
| `aSQL` | `string`, `const` | Query SQL. Parameter checking is disabled. |
| `aDBIndex` | `integer` | Zero-based source connection index. The script declaration requires it. |

**Returns**

No status. Success leaves an active cursor; an empty result remains successful.

**Security and safety**

No parameter binding is provided and SQL is logged. Validate/quote embedded values, restrict columns/rows and account for synchronous external database latency. Do not concurrently rebind the dataset or source connection.

### Additional Technical Info
`GetDataSetFromSource` closes and rebinds a client dataset, then opens SQL on a source connection selected by zero-based index.

The query and index are fictional. The example is source-reviewed and was not executed.

**Implementation**

The method closes the dataset, disables `ParamCheck`, clears fields, assigns `FSource.DBCons[aDBIndex].DBCon.SQLDATA`, sets/logs the command and opens with `Active := True`. It has no explicit transaction start or completion.

**Side effects and errors**

The caller's existing cursor/schema/edit state is destroyed before connection lookup. Index, connection and SQL errors are caught and logged, not propagated. A failed call can leave the reset dataset inactive or partially rebound.

**Related entries**

- [`GetDataFromSource`](GetDataFromSource.md) uses source index `0`.
- [`GetDataSetFromDest`](GetDataSetFromDest.md) selects from destinations.
- [`ExecSQLStatementSource`](ExecSQLStatementSource.md) runs non-query SQL without an explicit transaction start.

**External references**

- [Embarcadero `Data.DB.TDataSet.Active`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Active) - underlying cursor open/close behaviour.

<small>Created 2026-07-15</small>
