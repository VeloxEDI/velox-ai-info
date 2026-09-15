---
title: CreateMap
description: Inserts a Mapping definition for a zero-number cached item and captures its generated identity and metadata.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, create, database]
---

```Delphi
function CreateMap(const aSyncURL, aDescription: string): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var TestMap: TvxMappingItem;
begin
  // Run only in a governed non-production configuration task.
  TestMap := Mappings['DOC_EXAMPLE_PRIORITY'];
  Value := TestMap.CreateMap('', 'Documentation example mapping');
end;
```

### Usage

`CreateMap` inserts a Mapping definition for a zero-number cached item and captures its generated identity and metadata.

**Parameters**

- `aSyncURL` is persisted in `[Mapping].[SyncURL]` and copied to the cached [`SyncURL`](../Properties/SyncURL.md) property. This method does not contact or validate the URL.
- `aDescription` is persisted in `[Mapping].[Description]` and copied to the cached [`Description`](../Properties/Description.md) property.

The persisted Code comes from the item's existing [`Code`](../Properties/Code.md), normally set by `Mappings[Code]`.

**Returns**

- True when the item already has a nonzero MapNum; no SQL, refresh or update occurs.
- True after an insert only when SQL Server's generated `Num` value is greater than zero.
- False when the insert/query fails or does not produce a positive identity.

### Additional Technical Info
`CreateMap` inserts a row into the system database `[Mapping]` table when this cached item does not already hold a mapping number.

**Implementation and state changes**

For a zero item, Velox issues an SQL Server `INSERT ... OUTPUT INSERTED.Num`, opens the result, assigns the returned identity to MapNum, then copies both parameters into the cached fields. String values are quoted with `SafeSQL`, which removes NUL characters and escapes apostrophes.

The method catches database exceptions, writes a generic Mapping-table warning to the event logger and does not propagate the exception. SyncURL and Description are assigned only after the identity is read, so an earlier failure normally leaves the cached item at its previous zero/blank state.

**Edge cases and quirks**

- This is create-if-cached-zero, not create-or-update. Once MapNum is nonzero, different arguments are ignored and True is returned.
- The method trusts cached state. If the database row was deleted externally, nonzero MapNum still causes a no-op True.
- A failed or missing lookup has already cached the item. CreateMap can therefore turn that same borrowed object into a valid persistent mapping.
- `[Mapping].[Code]` is nullable and not unique. The method neither rejects a blank code nor checks for an existing database row. Concurrent cached-zero calls can insert duplicate codes and race while writing the shared item's fields.
- Code is NVARCHAR(100); SyncURL and Description are NVARCHAR(255). Database truncation errors are swallowed and represented by False plus a warning.
- SyncURL is only metadata within this class; CreateMap performs no HTTP request or synchronisation.

Call this only from an intentional configuration workflow. Ordinary translation code should use preconfigured mappings and check MapNum before relying on values.

<small>Created 2026-07-15</small>
