---
title: "GetSQLValueFromDest"
description: "Runs a query on a selected destination connection and returns the first field value or Null."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, destination, sql, variant, "null"]
---

```Delphi
function GetSQLValueFromDest(const aSQL: string;
  aDBIndex: integer): variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetSQLValueFromDest(
    'select count(*) from ExampleTarget where Status = ''Pending''', 0);
end;
```

### Usage

`GetSQLValueFromDest` runs a query on a selected destination connection and returns the first field value or Null.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSQL` | `string`, `const` | Cursor-returning query. Place the required value in the first selected column. Parameter checking is disabled. |
| `aDBIndex` | `integer` | Zero-based destination connection index. |

**Returns**

The first field's Variant value on success. Returns `Null` initially and after errors caught in the query body. A real SQL `NULL` and an empty cursor's first-field value are also normally `Null`, so callers cannot distinguish database null, no record or a caught query failure using the return alone. Invalid index/query-creation errors occur earlier and can propagate rather than return `Null`.

**Security and safety**

No parameter binding is provided. Use trusted input and a bounded scalar query; without `TOP`, aggregation or equivalent, the database can still produce a large result even though Velox reads one cell. Execution is synchronous and the destination connection is context-owned.

**Usage notes**

Use `VarIsNull` and logs when handling the result, but remember that `Null` remains deliberately ambiguous. If absence and failure must differ, retrieve a dataset and validate its state explicitly.

### Additional Technical Info
`GetSQLValueFromDest` opens query SQL on a selected destination connection and returns `Fields[0].Value` from its current first record. It is a first-cell convenience function, not a scalar-value validator.

The table is fictional. The example is source-reviewed and was not executed.

**Implementation**

The function initializes `Result := Null`, creates a temporary query from `FDest.DBCons[aDBIndex].DBCon.SQLDATA`, disables parameters, appends/logs SQL, sets `Active := True`, reads `Fields[0].Value`, then closes the query. The query is freed in `finally`. It does not explicitly start or complete a transaction.

The implementation does not call `First`, check `IsEmpty`, validate field count, enforce one row or detect additional rows. Normal dataset opening positions a non-empty cursor at its first record. For an empty cursor, Delphi field getters normally return `Null` because no field data is available; a result with no first field raises. Query shape remains the caller's responsibility.

**Errors and side effects**

Exceptions after the query object exists are logged and suppressed to the initialised `Null`. The connection-index expression and `NewQuery` are evaluated as the `with` target before either `try` is entered, so an invalid index, missing object or creation failure propagates into the script and no temporary query exists to free. SQL text is logged only after successful creation and assignment.

**Related entries**

- [`GetSQLValueFromSource`](GetSQLValueFromSource.md) performs the same operation on a source connection.
- [`GetDataSetFromDest`](GetDataSetFromDest.md) exposes the full result cursor.

**External references**

- [Embarcadero `Data.DB.TDataSet.Active`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Active) - query opening uses dataset activation rather than non-query `ExecSQL`.

<small>Created 2026-07-15</small>
