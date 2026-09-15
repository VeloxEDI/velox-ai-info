---
title: "GetFID"
description: "Resolves a named module row in a caller-specified Velox configuration table to its FID."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - fid
  - configuration
  - database
  - sql
---

```Delphi
Function GetFID( const aTable, aName : string) : TGuid
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  ModuleFID: TGuid;
begin
  // Prefer a typed wrapper when one exists. The table name is trusted code.
  ModuleFID := GetFID('VX_MAP', 'Daily Import');
  Value := GUIDToStringNoBraces(ModuleFID);
end;
```

### Usage

`GetFID` resolves a named module row in a caller-specified Velox configuration table to its FID.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aTable` | `string`, `const` | Table expression interpolated directly into the SQL statement. It must be a trusted, valid Velox configuration table identifier. |
| `aName` | `string`, `const` | `MODULENAME` to find. [`SQLString`](../String/SQLString.md) converts it to an SQL literal by removing embedded NUL characters and doubling apostrophes. |
| Result | `TGuid` | The first matching `FID`, or the all-zero `EmptyGuid` sentinel if the query returns no row. |

**Security boundary**

`aName` is treated as data, but `aTable` is inserted into the SQL statement as executable syntax. Never pass user input, message data or other untrusted text as `aTable`. An attacker-controlled value can alter the query. Prefer the module-specific FID lookup functions where available; call `GetFID` directly only with a fixed table identifier controlled by the script author.

### Additional Technical Info
`GetFID` searches a Velox system/configuration table for a row whose `MODULENAME` equals `aName`, then returns that row's binary `TGuid` FID. It is the shared implementation behind functions such as `GetMapFID`, `GetActionFID` and `GetVariableFID`.

The table and module name in the example are source-reviewed but fictional; the documentation workflow did not execute the query. Prefer a fixed-table wrapper such as [`GetMapFID`](GetMapFID.md) because `aTable` becomes an SQL identifier without validation or quoting.

**Implementation**

The scripting import registers the public function against the Velox FID helper. The implementation:

1. obtains a new query from `gSystemConnection.SQLC`;
2. builds `select FID from <aTable> where MODULENAME = <SQLString(aName)>`;
3. opens the query;
4. reads `Fields[0].AsGuid` when the cursor is not at end-of-file, otherwise returns `EmptyGuid`; and
5. closes and frees the query in a `finally` block.

There is no cache, table allow-list, uniqueness check or `order by` clause.

**Behaviour and edge cases**

- Name matching, case sensitivity, trailing-space treatment and character collation come from the configuration database.
- `SQLString` removes every embedded `#0` from `aName`. Names that differ only by NUL characters therefore collapse to the same lookup text; this conversion is lossy.
- The query has no `order by`. If corrupt or custom data contains duplicate matching names, which row is returned is database-dependent.
- A missing row and a stored all-zero FID are indistinguishable. Test the result with [`IsEmptyGuid`](../Guid/IsEmptyGuid.md).
- An empty name is still queried as an empty SQL string; it is not rejected before database access.
- The function does not confirm that `aTable` has the expected columns or that the resolved object is enabled, usable or of the intended semantic type.
- The result reflects the database and transaction state at execution time. A rename, deletion or replacement can change later calls.

**Side effects and errors**

This is a read-only database operation, but it allocates a query and uses the shared system connection. Invalid table syntax, missing tables or columns, database availability and permission failures, SQL execution errors and invalid GUID field data propagate as exceptions. Only a successfully executed query with no returned row becomes `EmptyGuid`.

**Performance and concurrency**

Every call performs a live query. Resolve a stable name once outside record-level loops and reuse the `TGuid`. The query object is always freed, while connection pooling, transaction visibility, locking and concurrent configuration changes are governed by `gSystemConnection` and the database.

**Related entries**

- [`GetMapFID`](GetMapFID.md), [`GetActionFID`](GetActionFID.md) and the other typed FID functions fix the table name for common module classes.
- [`SQLString`](../String/SQLString.md) performs the literal conversion used for `aName`.
- [`EmptyGuid`](../Guid/EmptyGuid.md) is the no-row sentinel.
- [`GUIDToStringNoBraces`](../Guid/GUIDToStringNoBraces.md) renders the returned record as text.

<small>Created 2026-07-15</small>
