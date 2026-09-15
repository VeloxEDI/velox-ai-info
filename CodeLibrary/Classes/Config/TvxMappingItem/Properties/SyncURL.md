---
title: SyncURL
description: Returns cached mapping synchronisation metadata without performing or scheduling any network operation.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, sync-url, metadata]
---

```Delphi
property SyncURL: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var CountryMap: TvxMappingItem;
begin
  CountryMap := Mappings['CountryCode'];
  Value := CountryMap.SyncURL;
end;
```

### Usage

`SyncURL` returns cached mapping synchronisation metadata without performing or scheduling any network operation.

### Additional Technical Info
`SyncURL` exposes the mapping definition's cached `[Mapping].[SyncURL]` metadata.

On first definition load, [`TvxMappingList`](../../TvxMappingList.md) selects SyncURL from the system database. After a successful [`CreateMap`](../Methods/CreateMap.md), the property receives that call's `aSyncURL` argument. A missing row, database NULL or failed initial query normally leaves an empty string.

**Important behaviour**

- `TvxMappingItem` does not parse, validate, open or otherwise use this URL. Its lookup, Add and Delete methods operate only on the database tables.
- Reading the property has no network or database side effect after the item has been acquired; it returns cached text.
- The script property is read-only even though internal native code has a setter.
- CreateMap on an already nonzero item returns True without updating either the database or this cached property.
- Direct database changes are not observed until the mapping cache entry is removed and reacquired.
- `[Mapping].[SyncURL]` is NVARCHAR(255). No URI syntax, scheme, host or trust-boundary validation is applied by this class.

Treat SyncURL as untrusted descriptive/configuration data unless a separately documented consumer validates it. Do not assume a nonempty value means synchronisation is enabled or has occurred, and do not expose embedded credentials or private endpoint details through logs or business output.

Empty string is ambiguous between absent metadata, database NULL, an absent mapping and a swallowed metadata-load failure. Use [`MapNum`](MapNum.md) when mapping existence matters.

<small>Created 2026-07-15</small>
