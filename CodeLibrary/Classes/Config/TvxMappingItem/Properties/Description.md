---
title: Description
description: Returns the cached Mapping description loaded with the definition or assigned after successful CreateMap.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, description, metadata]
---

```Delphi
property Description: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var CountryMap: TvxMappingItem;
begin
  CountryMap := Mappings['CountryCode'];
  Value := CountryMap.Description;
end;
```

### Usage

Returns the cached Mapping description loaded with the definition or assigned after successful CreateMap.

**When values are refreshed**

Do not use Description as a stable identifier or translation value. Use Code for the requested name and MapNum for cached database identity.

### Additional Technical Info
`Description` exposes the mapping definition's cached descriptive text.

When [`TvxMappingList`](../../TvxMappingList.md) first loads an existing definition, it reads `[Mapping].[Description]` with the numeric identity and SyncURL. A database NULL is converted using the field's `AsString` behaviour, normally producing an empty string. A missing/failed definition load also leaves the property's default empty value.

When [`CreateMap`](../Methods/CreateMap.md) successfully reads the inserted identity, it copies that call's `aDescription` argument into this property. Calling CreateMap on an already nonzero item is a no-op and does not change Description.

<small>Created 2026-07-15</small>
