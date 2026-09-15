---
title: "ExecSQLData"
description: "Rebinds a client dataset to the Velox Data connection and opens the supplied SQL in a transaction."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sql
  - dataset
  - transaction
---

```Delphi
function ExecSQLData(const aDataSet: TvxClientDataSet;
  const aSQL: string): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if ExecSQLData(Data,
      'select ItemID, Status from ExampleQueue where Status = ''Ready''') then
    Value := Data.RecordCount
  else
    Value := Null;
end;
```

### Usage

`ExecSQLData` rebinds a client dataset to the Velox Data connection and opens the supplied SQL in a transaction.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet`, `const` reference | Existing mutable client dataset to close, clear, rebind and open. `const` prevents reassignment of the reference; it does not make the object immutable. |
| `aSQL` | `string`, `const` | SQL expected to return a cursor on the Velox Data connection. Parameter recognition is disabled. |

**Returns**

`True` after `aDataSet.Active := True` succeeds; `False` after a caught exception. Success means the cursor opened, not that any transaction committed or any rows exist.

**Errors**

All exceptions are logged and suppressed into `False`. There is no explicit close or rollback in the handler, so the dataset and transaction can retain the state reached before failure. Inspect `aDataSet.Active` and the Velox log before deciding how to recover.

**Security and data safety**

With `ParamCheck := False`, values embedded in SQL are not parameterised. Avoid concatenating untrusted data and remember that the exact SQL is logged. Use bounded queries where possible because opening a large cursor can consume memory and hold locks.

### Additional Technical Info
Despite its name, `ExecSQLData` does not call the non-query `ExecSQL` operation. It destructively rebinds a supplied client dataset to the Velox Data (`SQLD`) connection, starts or joins a transaction, and opens the SQL as a result dataset.

The dataset and SQL are fictional. The example is source-reviewed and was not executed.

**Implementation**

The method closes `aDataSet`, sets `SQLDataSet.ParamCheck := False`, clears `FieldDefs`, assigns `gSystemConnection.SQLD`, starts or reuses its Velox transaction, sets `SQLDataSet.CommandText`, logs the statement and sets `Active := True`.

Setting `Active` opens a dataset. It is not equivalent to Delphi `TSQLQuery.ExecSQL` for update/insert/delete statements. Use [`ExecSQL`](ExecSQL.md) for a non-query SQL command.

**Side effects**

The caller's prior cursor, field definitions, SQL connection, command and edit state are discarded. The opened cursor remains attached to the shared SQLD connection. The method may also start a transaction and logs the full SQL text.

**Performance and concurrency**

Opening is synchronous. Row fetching behaviour depends on the underlying client dataset and driver; `RecordCount` can require additional work. The live dataset and connection are mutable execution-context objects and are not safe for concurrent rebinding.

**Related entries**

- [`GetData`](GetData.md) opens SQLD without explicitly starting a transaction in this wrapper.
- [`ExecSQL`](ExecSQL.md) runs non-query SQL and leaves completion to the flow.
- [Datasets](../../ScriptingGuide/Datasets.md) covers cursor and object-lifetime rules.

**External references**

- [Embarcadero `Data.DB.TDataSet.Active`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Active) - documents that setting `Active` to `True` opens a dataset.
- [Free Pascal `TDataSet.Active`](https://www.freepascal.org/docs-html/fcl/db/tdataset.active.html) - compatible open/close semantics; Velox uses Delphi client datasets and its own connection wrapper.

<small>Created 2026-07-15</small>
