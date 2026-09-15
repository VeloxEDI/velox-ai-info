---
title: TvxMappingItem
description: Represents one cached named mapping and performs synchronous value lookups and persistent mapping mutations in the Velox system database.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, configuration, database]
---

```Delphi
TvxMappingItem = class(TObject)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var CountryMap: TvxMappingItem;
begin
  CountryMap := Mappings['CountryCode'];
  if CountryMap.MapNum > 0 then
    Value := CountryMap.GetOutValue('NZ')
  else
    Value := '';
end;
```

### Usage

`TvxMappingItem` represents one cached named mapping and performs synchronous value lookups and persistent mapping mutations in the Velox system database.

### Additional Technical Info
`TvxMappingItem` represents one named, database-backed value mapping returned by the process-global [`Mappings`](../../Variables/Config/Mappings.md) cache. Scripts cannot construct or free it; retrieve it through [`TvxMappingList.Map`](TvxMappingList/Properties/Map.md) or the list's default indexer.

Each item caches the mapping definition's Code, numeric identity, Description and SyncURL. Value pairs are not cached: [`GetOutValue`](TvxMappingItem/Methods/GetOutValue.md) and [`GetInValue`](TvxMappingItem/Methods/GetInValue.md) query `[Mapping_Data]` synchronously on every call.

**Lifecycle and acquisition**

On the first `Mappings[Code]` access, the list locks its process-global cache, creates an item, sets Code and selects `Num`, `Description` and `SyncURL` from `[Mapping]`. The item is cached even when the row is absent or the query fails; in that state MapNum remains zero. Repeated access returns the same borrowed object until [`RemoveMap`](TvxMappingList/Methods/RemoveMap.md), [`FreeAllMaps`](TvxMappingList/Methods/FreeAllMaps.md) or process shutdown destroys it.

Mapping-code matching in memory is case-insensitive. Database matching follows the system database's SQL Server collation. `[Mapping].[Code]` has no unique constraint, so duplicate codes can exist and an unordered definition query may choose any matching row.

**Database operations**

- [`CreateMap`](TvxMappingItem/Methods/CreateMap.md) inserts a mapping definition only when the cached MapNum is zero.
- [`Add`](TvxMappingItem/Methods/Add.md) auto-creates an absent definition with blank metadata, then inserts an input/output pair only when that input is not already present.
- [`Delete`](TvxMappingItem/Methods/Delete.md) deletes value rows for one input; it never deletes the mapping definition.
- Forward and reverse lookups read a fresh database value and never refresh the cached definition metadata.

All operations use the host's system connection and execute in the calling script thread. SQL values are quoted by Velox's `SafeSQL`, which removes NUL characters and doubles apostrophes, but database field lengths and collation still apply.

**Failure, concurrency and ownership**

Database exceptions are caught, written as general warnings through the event logger and not propagated. Boolean methods therefore expose coarse success/no-op states, while lookup failure can be indistinguishable from an empty stored or missing value. The class adds no locking around its fields or database operations. Concurrent creation can insert duplicate mapping definitions because Code is not unique; concurrent Add calls can race at the `IF NOT EXISTS` check and one may fail on the Mapping_Data primary key.

The four script properties are read-only even though native setters exist. Treat returned items as borrowed shared-cache references, do not retain them across cache invalidation, and keep persistent mutations out of ordinary record-processing events unless the configuration change is explicitly intended.

<small>Created 2026-07-15</small>
