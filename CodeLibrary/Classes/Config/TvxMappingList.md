---
title: TvxMappingList
description: Owns the process-global cache of named mapping items and lazily loads their definition metadata from the system database.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mappings, cache, configuration]
---

```Delphi
TvxMappingList = class(TvxThreadList)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var CountryMap: TvxMappingItem;
begin
  CountryMap := Mappings['CountryCode'];
  Value := CountryMap.MapNum > 0;
end;
```

### Usage

`TvxMappingList` owns the shared across the Velox process cache of named mapping items and loads on first access their definition metadata from the system database.

**Ownership and invalidation**

Returned mapping items are borrowed references owned by this list. [`RemoveMap`](TvxMappingList/Methods/RemoveMap.md) destroys matching cached objects and [`FreeAllMaps`](TvxMappingList/Methods/FreeAllMaps.md) destroys all of them. Neither method changes database rows.

The lock protects only the list while searching or mutating it. It is released before caller code uses the returned item, so another script can invalidate and free that object concurrently. Do not retain item references across coordinated invalidation, and never clear this shared cache from ordinary per-record processing.

### Additional Technical Info
`TvxMappingList` is the class behind the process-global [`Mappings`](../../Variables/Config/Mappings.md) variable. It owns a lazy cache of [`TvxMappingItem`](TvxMappingItem.md) objects keyed by mapping Code.

Velox constructs one list during mapping-unit initialization, binds the same object into each scripter and frees it at process/unit finalization. Scripts do not construct, free or replace it.

**Lookup and loading**

The read-only default [`Map`](TvxMappingList/Properties/Map.md) property performs a case-insensitive linear search of cached Code values. A cache miss:

1. creates a new item and stores the exact requested Code;
2. queries `[Mapping]` for `Num`, `Description` and `SyncURL`;
3. fills those cached fields when a row exists; and
4. adds the item to the cache even when no row exists or the query raises a caught exception.

The list lock remains held for this entire sequence, including synchronous database I/O and event logging. A slow first lookup blocks all other Map lookups and cache invalidations in the same process. Cache hits do not query the database.

**Cache/database differences**

- In-memory Code comparison uses `AnsiCompareText`; database comparison follows SQL Server/database collation.
- The Mapping schema does not enforce unique Code and the load query has no `ORDER BY`, so duplicate definitions can yield an arbitrary cached row.
- A missing/failed item with MapNum zero is cached. Later database creation is invisible until the entry is removed or all entries cleared.
- Description, SyncURL and MapNum are snapshots. External definition edits/deletion are not automatically refreshed.
- Mapping-data value lookups are not cached; each item lookup method still runs a database query.

The native ancestor supplies thread-list storage, but its hidden members are not duplicated or exposed here. Use only the members registered on this public class.

<small>Created 2026-07-15</small>
