---
title: MapNum
description: Returns the cached Mapping.Num identity, with zero acting as the missing or failed-load sentinel.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, identity, sentinel]
---

```Delphi
property MapNum: Integer read;
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

`MapNum` returns the cached Mapping.Num identity, with zero acting as the missing or failed-load sentinel.

### Additional Technical Info
`MapNum` is the cached Integer identity of the corresponding `[Mapping]` row.

The list sets MapNum to zero before loading a definition. If its query finds a row, it assigns `[Mapping].[Num]`; [`CreateMap`](../Methods/CreateMap.md) assigns the SQL Server `OUTPUT INSERTED.Num` result after insertion. The schema uses an `IDENTITY(1,1)` primary key, so normal persisted identities are positive.

**Zero sentinel**

Zero does not distinguish why the item lacks an identity. It can mean:

- the requested Code has no database definition;
- the first metadata query failed and its exception was swallowed/logged; or
- CreateMap failed before returning a positive generated identity.

[`GetInValue`](../Methods/GetInValue.md) and [`GetOutValue`](../Methods/GetOutValue.md) return an `Invalid Map` diagnostic string when MapNum is zero. [`Add`](../Methods/Add.md) attempts automatic creation, while [`Delete`](../Methods/Delete.md) silently returns True without SQL.

**Cache and concurrency quirks**

- MapNum is read-only to script but mutable inside the native object.
- It is not revalidated on each call. External deletion can leave a stale positive number; external creation can leave a cached zero.
- Remove/reload the mapping-list entry to refresh metadata. That destroys the shared object, so old references become unsafe.
- Concurrent CreateMap calls can race while reading/writing this field and can create duplicate Code rows because the database does not constrain Code uniqueness.
- Treat `MapNum > 0` as cached identity state, not a live database existence or health check.

Scripts normally use this property as a guard before lookup so returned invalid-map text cannot be mistaken for translated business data.

<small>Created 2026-07-15</small>
