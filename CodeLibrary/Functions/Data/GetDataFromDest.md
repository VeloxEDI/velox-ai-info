---
title: "GetDataFromDest"
description: "Opens SQL into a client dataset using the primary destination database connection."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, destination, sql, dataset]
---

```Delphi
procedure GetDataFromDest(const aDataSet: TvxClientDataSet;
  const aSQL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  GetDataFromDest(Data,
    'select DocumentNo, Exported from ExampleTarget where Exported = 0');
  Value := Data.RecordCount;
end;
```

### Usage

`GetDataFromDest` opens SQL into a client dataset using the primary destination database connection.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet` | Existing mutable dataset to rebind and open. |
| `aSQL` | `string`, `const` | Query SQL for destination index `0`; no parameter binding. |

**Returns**

No status. On success the same dataset is active; zero rows is a valid cursor.

**Errors**

Invalid destination state and SQL/open exceptions are caught and logged, not propagated. The dataset has already been reset and may remain inactive or partly rebound. Inspect logs because the procedure has no result.

**Security and safety**

SQL is direct and fully logged; never concatenate untrusted values. Opening is synchronous, potentially large, and can observe transaction-dependent destination state. Do not concurrently mutate the context-owned dataset or connection.

### Additional Technical Info
`GetDataFromDest` opens SQL on the active map's primary destination connection into an existing client dataset. It is an exact wrapper for `GetDataSetFromDest(aDataSet, aSQL, 0)`.

The example is fictional, source-reviewed and was not executed.

**Implementation and side effects**

The terminal method closes the dataset, disables `ParamCheck`, clears `FieldDefs`, assigns `FDest.DBCons[0].DBCon.SQLDATA`, sets/logs the command and opens it. Previous fields, cursor and edits are lost. It does not explicitly start or complete a transaction.

**Related entries**

- [`GetDataSetFromDest`](GetDataSetFromDest.md) selects a destination index.
- [`GetDataFromSource`](GetDataFromSource.md) targets source index `0`.

**External references**

- [Embarcadero `Data.DB.TDataSet.Active`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Active) - cursor opening operation used by the terminal method.
- [Free Pascal `TDataSet.Active`](https://www.freepascal.org/docs-html/fcl/db/tdataset.active.html) - compatible high-level state reference.

<small>Created 2026-07-15</small>
