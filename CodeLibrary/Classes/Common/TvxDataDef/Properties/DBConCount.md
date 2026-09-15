---
title: DBConCount
description: Returns the number of database-link objects currently attached to a data definition.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, data-definition, database-connection, count]
---

```Delphi
property DBConCount: Integer read;
```

### Example

```Delphi
function HasDatabaseConnections(const Data: TvxDBDef): Boolean;
begin
  Result := Data.DBConCount > 0;
end;
```

### Usage

`DBConCount` returns the number of database-link objects currently attached to a data definition.

### Additional Technical Info
`DBConCount` is the current item count of the data definition's owned `TvxDBLink` list.

#### Source-backed behaviour

The getter returns `FDBCons.Count` when the list exists and zero otherwise. Normal `TvxDataDef` construction creates the list, so the nil branch mainly protects lifecycle edges.

The count describes link objects, not successfully loaded, connected, enabled or transactional databases. Accessing a link's [`DBCon`](DBCon.md) may still perform a lazy load and return nil. Valid indexes for [`DBCons`](DBCons.md) are zero through `DBConCount - 1` at the moment of access.

The list belongs to the data definition and can be rebuilt when modules are loaded or transferred. Do not cache the count across unrelated lifecycle operations.

#### Related entries

- [`DBCon`](DBCon.md) accesses the first concrete connection.
- [`DBCons`](DBCons.md) accesses an individual link.
- [`TvxDBLink`](../../../Modules/TvxDBLink.md) describes each counted object.

<small>Created 2026-07-15</small>
