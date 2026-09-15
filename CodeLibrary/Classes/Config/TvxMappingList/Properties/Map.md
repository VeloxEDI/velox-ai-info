---
title: Map
description: Returns the case-insensitive cached mapping item for a Code, creating and database-loading one while holding the global list lock on a miss.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, default-property, lazy-load]
---

```Delphi
property Map[aCode: string]: TvxMappingItem read; default;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var StatusMap: TvxMappingItem;
begin
  StatusMap := Mappings.Map['OrderStatus'];
  if StatusMap.MapNum > 0 then
    Value := StatusMap.GetOutValue('N')
  else
    Value := '';
end;
```

### Usage

Returns the case-insensitive cached mapping item for a Code, creating and database-loading one on a miss.

**Parameter and return**

`aCode` is the named mapping Code. The getter returns a borrowed list-owned `TvxMappingItem`; normal completion returns an object even when no persistent mapping exists. In that missing/error state its Code is populated but MapNum remains zero.

**Lookup sequence**

1. Locks the shared across the Velox process list.
2. Scans cached items linearly and compares Code with `AnsiCompareText`.
3. Returns the first case-insensitive hit without database I/O.
4. On a miss, creates an item, copies the exact argument into Code and sets MapNum to zero.
5. While still holding the lock, selects `Num`, `Description` and `SyncURL` from `[Mapping]` by quoted Code.
6. Populates the first unordered row when found, caches the item in every outcome and unlocks the list.

The metadata query catches database exceptions, writes a general event warning and still returns/caches the zero item. Allocation or other exceptions outside that inner database catch can propagate.

### Additional Technical Info
`Map` is the read-only default property of `TvxMappingList`.

Because it is the default property, these forms are equivalent:

```Delphi
Item := Mappings.Map['OrderStatus'];
Item := Mappings['OrderStatus'];
```

**Edge cases, performance and concurrency**

- Cache comparison is case-insensitive; SQL matching follows database collation. The exact first-request case remains in the cached Code.
- Blank/whitespace Codes are accepted. `SafeSQL` removes NUL characters only for the query, so the cached Code can differ from queried text.
- Mapping.Code is not unique and the query has no `ORDER BY`; duplicate definitions produce an arbitrary first row.
- Missing and failed lookups are negatively cached. Database fixes/creation remain invisible until [`RemoveMap`](../Methods/RemoveMap.md) or [`FreeAllMaps`](../Methods/FreeAllMaps.md).
- A cache hit is O(number of cached maps). A miss adds synchronous database latency while blocking every other list operation.
- The lock ends before the caller uses the returned object. Invalidation can free that borrowed object concurrently, so do not retain it across cache-management operations.

Check `MapNum > 0` before translating. Otherwise the item's lookup methods return an `Invalid Map` diagnostic string as ordinary data.

<small>Created 2026-07-15</small>
