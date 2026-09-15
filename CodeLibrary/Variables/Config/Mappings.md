---
title: "Mappings"
description: "Provides the shared lazy cache and database-backed access point for named Velox value mappings."
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - mappings
  - database
---

```Delphi
Mappings: TvxMappingList
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Mappings['CountryCode'].GetOutValue('NZ');
end;
```

### Usage

Provides the shared lazy cache and database-backed access point for named Velox value mappings.

**Lookup and cache**

Map-code matching in the process cache uses `AnsiCompareText` and is case-insensitive. On first access, Velox creates an item and queries `[Mapping]` for `Num`, `Description` and `SyncURL` using `SafeSQL(Code)`. A missing/error item keeps `MapNum = 0` and is still cached. Later database creation or edits are not reflected until the item is removed from the cache.

`GetOutValue(in)` and `GetInValue(out)` execute a fresh query against `[Mapping_Data]` on every call. A valid map with no row returns `''`. An item with `MapNum = 0` returns literal `Invalid Map - '<code>' not found.`. Caught SQL errors are logged and normally collapse to an empty/default result rather than propagating.

**Mutations and safety**

- `CreateMap` inserts a `[Mapping]` row if the cached item has no number.
- `Add` creates the map if necessary, then conditionally inserts an input/output row and commits through the product query helper.
- `Delete` removes rows by input value; it does not delete the mapping definition.
- `RemoveMap(code)` invalidates only the process cache entry. `FreeAllMaps` invalidates all shared entries. Neither is a database delete.

These methods have live database side effects and shared cache consequences. Never free `Mappings` or returned items, retain an item across invalidation, or call global clearing from ordinary record processing. Do not use returned error text as mapped business data; validate `MapNum`/expected outputs. Cache the item reference inside a controlled execution when repeatedly translating, but remember each value conversion still runs SQL.

### Additional Technical Info
`Mappings` is the host-owned global `TvxMappingList`. Its default `Map` property makes `Mappings['Code']` return a cached `TvxMappingItem` for a named mapping.

**Related class references**

- [`TvxMappingList`](../../Classes/Config/TvxMappingList.md)
- [`TvxMappingItem`](../../Classes/Config/TvxMappingItem.md)

<small>Created 2026-07-19</small>
