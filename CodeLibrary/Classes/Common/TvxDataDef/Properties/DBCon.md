---
title: DBCon
description: Returns the concrete database connection behind the first database link, lazily loading it and failing when no first link exists.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, data-definition, database-connection, first]
---

```Delphi
property DBCon: TvxDBCon read;
```

### Example

```Delphi
procedure RequirePrimaryConnection(const Data: TvxDBDef);
begin
  if Data.DBConCount = 0 then
    raise Exception.Create('No database connection is configured');
  if Data.DBCon = nil then
    raise Exception.Create('The primary database connection did not load');
end;
```

### Usage

`DBCon` returns the database connection behind the first database link, loading on first access it and failing when no first link exists.

- Check `DBConCount > 0` before access, then check the returned object for nil.
- Use [`DBCons`](DBCons.md) when a data definition contains multiple connections and the intended one is not explicitly known to be first.
- Do not retain the reference beyond the owning data definition's lifetime.

### Additional Technical Info
`DBCon` is a convenience alias for the concrete `TvxDBCon` owned by `DBCons[0]`. It does not search for an active or writable connection.

#### Source-backed behaviour

The PascalScript runtime helper evaluates `Self.DBCons[0].DBCon` directly. There is no `DBConCount` guard, so reading this property when the link list is empty raises a list-index exception.

The first object is a `TvxDBLink`, not necessarily an already loaded connection. Its `DBCon` getter lazily creates a `TvxDBCon`, calls `LoadModule` with the link GUID and frees it again if `ModuleLoaded` remains false. Load exceptions are caught and logged by the link; the property can consequently return nil. Reading can therefore allocate objects, query configuration data and add log entries.

The choice of index zero is configuration order. It is unrelated to connection name, active state or transaction state.

#### Related entries

- [`DBConCount`](DBConCount.md) and [`DBCons`](DBCons.md) expose the underlying link list.
- [`TvxDBCon`](../../../Modules/TvxDBCon.md) and [`TvxDBLink`](../../../Modules/TvxDBLink.md) describe the returned connection and its lazy link.

<small>Created 2026-07-15</small>
