---
title: "GetDBDefFID"
description: "Resolves a database definition module name to its live Velox system-configuration FID."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - fid
  - configuration
  - database
  - module
---

```Delphi
Function GetDBDefFID( const aName : string) : TGuid
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  ModuleFID: TGuid;
begin
  ModuleFID := GetDBDefFID('Order Header Query');
  Value := GUIDToStringNoBraces(ModuleFID);
end;
```

### Usage

`GetDBDefFID` resolves a database definition module name to its live Velox system-configuration FID.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aName` | `string`, `const` | Database definition `MODULENAME` to find. The value is passed as a quoted SQL string literal after Velox escaping. |
| Result | `TGuid` | Matching `FID`. If the query returns no row, the function returns the all-zero `EmptyGuid` sentinel. |

### Additional Technical Info
`GetDBDefFID` looks up the database definition whose `MODULENAME` equals `aName` and returns its binary `TGuid` FID. It reads the current Velox system/configuration database; it is not a compile-time constant or an in-memory name map.

The module name in the example is fictional and source-reviewed only. The lookup was not executed by the documentation workflow.

**Implementation**

The scripting import registers the public function and binds it to the Velox FID helper. This wrapper calls [`GetFID`](GetFID.md) with fixed table `VX_DBDEF`. The shared helper:

1. allocates a query from the live system/configuration connection;
2. executes `select FID from VX_DBDEF where MODULENAME = <escaped aName>`;
3. returns the first row's GUID, or `EmptyGuid` at end-of-file; and
4. closes and frees the query in a `finally` block.

The fixed table name avoids the generic function's caller-controlled SQL identifier boundary.

**Behaviour and edge cases**

- Name matching, case sensitivity, trailing-space treatment and character collation are determined by the configuration database, not by Delphi string comparison.
- The shared `SQLString` conversion removes embedded `#0` characters before quoting. A supplied name containing NULs is therefore normalized before lookup.
- The query has no `order by`. If inconsistent data contains duplicate matching names, the returned row is database-dependent; do not use duplicate module names as an addressing scheme.
- A missing module and a stored all-zero FID produce the same return value. Use [`IsEmptyGuid`](../Guid/IsEmptyGuid.md) to test the sentinel before using it as a foreign key or module reference.
- The lookup observes the database state visible to the shared connection when the query executes. Renaming, deleting or replacing a module can change later results.
- The function does not validate that the resolved module is enabled, accessible for a later operation or suitable for the caller's business purpose.

**Side effects and errors**

This is a read-only query, but it consumes a database query/connection resource and can participate in database logging, locking or transaction visibility. Connection failure, SQL execution failure, permission/schema drift and an invalid stored GUID propagate as exceptions; only the no-row case becomes `EmptyGuid`.

**Performance and concurrency**

Each call creates and executes a query; there is no per-name cache. Avoid repeating it in a record-level loop when the name is stable—resolve once and reuse the `TGuid`. Query-object cleanup is deterministic. Concurrency, pooling and transaction isolation follow the shared Velox system connection.

**Related entries**

- [`GetFID`](GetFID.md) is the generic table/name terminal and carries the dynamic-table security boundary.
- [`EmptyGuid`](../Guid/EmptyGuid.md) returns the same no-match sentinel.
- [`GUIDToStringNoBraces`](../Guid/GUIDToStringNoBraces.md) renders the binary result for display or logging.
- [`SQLString`](../String/SQLString.md) documents the lossy escaping applied to the name.

<small>Created 2026-07-15</small>
