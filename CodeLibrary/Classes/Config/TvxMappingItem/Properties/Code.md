---
title: Code
description: Returns the cached mapping code requested from Mappings and used to load or create the persistent definition.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, code, cache]
---

```Delphi
property Code: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var CountryMap: TvxMappingItem;
begin
  CountryMap := Mappings['CountryCode'];
  Value := CountryMap.Code;
end;
```

### Usage

Returns the cached mapping code requested from Mappings and used to load or create the persistent definition.

### Additional Technical Info
`Code` is the cached string identifier associated with a `TvxMappingItem`.

The list sets Code to the exact `Mappings[Code]` argument when it creates the cached item, before querying `[Mapping]`. It therefore remains available even when no definition is found and MapNum is zero. [`CreateMap`](../Methods/CreateMap.md) later persists this cached value as `[Mapping].[Code]`.

**Matching and persistence**

- The process cache finds existing items with `AnsiCompareText`, so map-code lookup is case-insensitive and later case variants return the first cached object's original Code text.
- The database definition query compares Code using SQL Server/database collation and has no `ORDER BY`.
- `[Mapping].[Code]` is NVARCHAR(100), nullable and has no unique constraint. Duplicate database codes can exist; one unordered row populates the cached item.
- `SafeSQL` removes embedded NUL characters and escapes apostrophes when Code is queried or inserted. The in-memory property itself retains the originally requested string.

The script registration is read-only even though the native class has a setter. Code does not refresh after database edits and cannot be changed through script. Remove the item from [`TvxMappingList`](../../TvxMappingList.md) to force a later definition reload, taking care not to retain the invalidated object reference.

Treat Code as an identifier, not proof that the mapping exists; use [`MapNum`](MapNum.md) to distinguish a loaded/created definition from a cached missing item.

<small>Created 2026-07-15</small>
