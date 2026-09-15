---
title: RemoveMap
description: Destroys cached mapping items whose Code matches case-insensitively so a later access reloads definition metadata.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, cache-invalidation, reload]
---

```Delphi
procedure RemoveMap(const aCode: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  // Use only after coordinating users of this shared item.
  Mappings.RemoveMap('CountryCode');
  Value := True;
end;
```

### Usage

`RemoveMap` destroys cached mapping items whose Code matches case-insensitively so a later access reloads definition metadata.

**Parameter**

`aCode` is the process-cache identifier to invalidate. Comparison is case-insensitive and does not query or normalise against the database.

### Additional Technical Info
`RemoveMap` removes and frees every cached item whose Code matches the supplied string using `AnsiCompareText`.

**Implementation and result**

Velox locks the list, scans backwards, frees each matching object, sets its slot to nil, then packs the list to remove nil entries. The method returns no value: callers cannot distinguish one removal from no cached match.

The next `Mappings[aCode]` access creates a new item and performs a fresh `[Mapping]` definition query. That query uses database collation and may choose a different case/duplicate Code row from the one previously cached.

**Side effects and quirks**

- This method changes only the in-process cache. It does not delete a `[Mapping]` definition or any `[Mapping_Data]` row.
- Although normal getter logic creates one cached item per case-insensitive Code, the backward loop deliberately removes all matches if duplicates somehow exist.
- The supplied case need not match the originally cached case. Whitespace is not trimmed.
- Any reference returned before removal becomes dangling. Another script may still be using it after the list lock has been released by its earlier lookup.
- Concurrent use can therefore cause access violations or corrupt behaviour; cache locking does not provide reference lifetime management.
- Removal can discard a cached zero item so later database creation becomes visible, or refresh stale Description/SyncURL/MapNum. It does not affect live mapping-data lookup caching because there is none.

Coordinate targeted invalidation at a configuration boundary. Prefer it over [`FreeAllMaps`](FreeAllMaps.md) when only one definition must be reloaded, but apply the same borrowed-reference safety discipline.

<small>Created 2026-07-15</small>
