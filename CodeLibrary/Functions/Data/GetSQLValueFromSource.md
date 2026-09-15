---
title: "GetSQLValueFromSource"
description: "Runs a query on a selected source connection and returns the first field value or Null."
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, source, sql, variant, "null"]
---

```Delphi
function GetSQLValueFromSource(const aSQL: string;
  aDBIndex: integer): variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetSQLValueFromSource(
    'select count(*) from ExampleInbound where ReadFlag = 0', 0);
end;
```

### Usage

`GetSQLValueFromSource` runs a query on a selected source connection and returns the first field value or Null.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSQL` | `string`, `const` | Cursor query whose first column contains the wanted value. Parameter recognition is disabled. |
| `aDBIndex` | `integer` | Zero-based source connection index. |

**Returns**

The first cell on success; otherwise the initialised `Null` for errors caught after query creation. SQL `NULL` and an empty cursor's first-field value normally also produce `Null`, so absence, a caught error and a legitimate null cannot be distinguished from the value alone. Index/query-creation failures occur before the handler and can propagate.

**Security and safety**

Do not concatenate untrusted data or log secrets. Shape and bound the query so the database can return a scalar efficiently. The synchronous external call and mutable active-map connection are not suitable for concurrent reuse.

### Additional Technical Info
`GetSQLValueFromSource` opens query SQL on a selected source connection and returns the first field's Variant value from the current first row.

The table is fictional. The example is source-reviewed and was not executed.

**Implementation**

The method creates a temporary query from `FSource.DBCons[aDBIndex].DBCon.SQLDATA`, disables parameter checking, adds/logs SQL, opens it, reads `Fields[0].Value`, closes it and frees it. It performs no explicit transaction operation. A local `TField` variable is declared but never used; this does not change behaviour.

It does not verify record or field counts, call `First`, or reject multiple rows/columns. On an empty cursor, a Delphi field getter normally returns `Null`; if the result has no field at index `0`, access raises and is logged inside the inner handler. As in the destination variant, failures while evaluating the indexed `NewQuery` expression occur before both `try` blocks and propagate rather than reduce to `Null`.

**Side effects and errors**

The exact SQL is logged. Query-body errors are logged with script and SQL context and suppressed. The temporary cursor is freed. Source connection/autocommit state is inherited rather than managed here.

**Related entries**

- [`GetSQLValueFromDest`](GetSQLValueFromDest.md) targets a destination.
- [`GetDataSetFromSource`](GetDataSetFromSource.md) returns a full live dataset.

**External references**

- [Embarcadero `Data.DB.TDataSet.Active`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Active) - the query is opened as a dataset cursor.

<small>Created 2026-07-15</small>
