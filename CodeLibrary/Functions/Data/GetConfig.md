---
title: "GetConfig"
description: "Opens SQL into a client dataset using the Velox configuration database connection."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, configuration, sql, dataset]
---

```Delphi
procedure GetConfig(const aDataSet: TvxClientDataSet;
  const aSQL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  GetConfig(Data,
    'select SettingName, SettingValue from ExampleConfiguration where Enabled = 1');
  Value := Data.RecordCount;
end;
```

### Usage

`GetConfig` opens SQL into a client dataset using the Velox configuration database connection.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet`, `const` reference | Existing mutable dataset to close, clear, bind to SQLC and open. |
| `aSQL` | `string`, `const` | Query text. SQL parameter recognition is disabled. |

**Returns**

No status value. On success, `aDataSet.Active` is `True` and exposes the query cursor. Zero rows is still a successful open.

**Security and safety**

With `ParamCheck := False`, concatenated input is not parameterised. Avoid untrusted values and secrets in SQL. Opening is synchronous and unbounded queries can consume time and memory. Do not rebind the same context-owned dataset concurrently.

### Additional Technical Info
`GetConfig` closes and rebinds a supplied client dataset, then opens SQL on Velox's configuration database connection (`gSystemConnection.SQLC`). It is intended for configuration-side reads, not for Velox Data or map source/destination connections.

The dataset/table names are fictional. The example is source-reviewed and was not executed. Configuration data can be sensitive; query only data the script is authorised to use.

**Implementation**

The method sets `Active := False`, `SQLDataSet.ParamCheck := False`, clears `FieldDefs`, assigns `SQLConnection := gSystemConnection.SQLC`, assigns `CommandText`, logs the SQL and sets `Active := True`.

**Side effects**

The caller's previous cursor, fields, pending edits, command and connection are discarded. The full SQL is logged. The resulting dataset remains a live cursor on the shared configuration connection; no independent data copy is returned.

**Errors and ambiguity**

Every exception is caught and logged as an error reading data with `GetConfig`, including script and SQL context. Nothing is re-raised and no Boolean is returned. After failure the dataset has already been closed and cleared and may be partly rebound; check `Active` and logs rather than assuming the old content remains.

**Related entries**

- [`GetData`](GetData.md) targets the Velox Data database.
- [`GetDataFromDB`](GetDataFromDB.md) selects a DB Connection module by FID.
- [Datasets](../../ScriptingGuide/Datasets.md) covers cursor and mutation rules.

**External references**

- [Embarcadero `Data.DB.TDataSet.Active`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Active) - setting `Active` opens or closes the dataset.
- [Free Pascal `TDataSet.Active`](https://www.freepascal.org/docs-html/fcl/db/tdataset.active.html) - compatible high-level cursor state; Velox uses Delphi and product-specific connections.

<small>Created 2026-07-15</small>
