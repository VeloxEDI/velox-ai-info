---
title: "GetDataFromSource"
description: "Opens SQL into a client dataset using the primary source database connection."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, source, sql, dataset]
---

```Delphi
procedure GetDataFromSource(const aDataSet: TvxClientDataSet;
  const aSQL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  GetDataFromSource(Data,
    'select MessageID, ReceivedAt from ExampleInbound where ReadFlag = 0');
  Value := Data.RecordCount;
end;
```

### Usage

`GetDataFromSource` opens SQL into a client dataset using the primary source database connection.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet` | Mutable client dataset to close, clear, rebind and open. |
| `aSQL` | `string`, `const` | Query SQL for source index `0`; parameter recognition is disabled. |

**Returns**

No status. Success leaves an active cursor; no rows is not an error.

**Errors**

Index, connection and SQL exceptions are logged with script and SQL context and then suppressed. An unsuccessful procedure can leave the reset dataset inactive; consult logs.

**Security and safety**

SQL is direct and logged. Validate values instead of concatenating external text and limit result size. The synchronous call can wait on the external source and the live objects must not be reused concurrently.

### Additional Technical Info
`GetDataFromSource` opens query SQL from the active map's primary source connection into an existing client dataset. It is an exact wrapper for `GetDataSetFromSource(aDataSet, aSQL, 0)`.

The example is fictional, source-reviewed and not executed.

**Implementation and side effects**

The terminal method closes and clears the caller dataset, disables parameters, assigns `FSource.DBCons[0].DBCon.SQLDATA`, sets/logs the command and opens it. The old cursor/schema/edit state is destroyed. It has no explicit transaction-start or completion call.

**Related entries**

- [`GetDataSetFromSource`](GetDataSetFromSource.md) selects a source by index.
- [`GetDataFromDest`](GetDataFromDest.md) targets destination index `0`.

**External references**

- [Embarcadero `Data.DB.TDataSet.Active`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Active) - underlying dataset-open semantics.
- [Free Pascal `TDataSet.Active`](https://www.freepascal.org/docs-html/fcl/db/tdataset.active.html) - compatible general concept, not a definition of Velox source connection behaviour.

<small>Created 2026-07-15</small>
