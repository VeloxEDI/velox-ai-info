---
title: FreeAllMaps
description: Destroys every cached mapping item process-wide without deleting any persistent mapping definition or value row.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mappings, cache-invalidation, concurrency]
---

```Delphi
procedure FreeAllMaps;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  // Use only at a coordinated configuration/cache boundary.
  Mappings.FreeAllMaps;
  Value := True;
end;
```

### Usage

`FreeAllMaps` destroys every cached mapping item process-wide without deleting any persistent mapping definition or value row.

**Side effects and safety**

- This is memory-cache invalidation only. It does not delete or update `[Mapping]` or `[Mapping_Data]`.
- The cache and its objects are shared across the Velox process. All scripters using `Mappings` observe the cleared list.
- Any previously returned item reference becomes dangling as soon as its object is freed. The list lock does not protect callers that are already using a borrowed item outside the getter.
- Concurrent item method execution and FreeAllMaps can therefore produce use-after-free/access-violation behaviour. Coordinate a quiescent boundary before clearing.
- Other list lookups/removals block while the list lock is held. Destruction itself is small, but work is proportional to the number of cached maps.
- The list destructor calls FreeAllMaps during process/unit finalization; script code must never attempt to own or free the global list.

Use [`RemoveMap`](RemoveMap.md) when only one Code needs definition metadata refreshed. Avoid either invalidation method in record, linked-data or field events where other concurrent flows may be active.

### Additional Technical Info
`FreeAllMaps` synchronously destroys all `TvxMappingItem` objects owned by this process-global list and empties the cache.

**Implementation**

Velox locks the underlying list, iterates from index zero to the previous count, frees each object, replaces its slot with nil, clears the list and then unlocks it. The procedure returns no count or status and has no per-item exception handling.

The next [`Map`](../Properties/Map.md) access is a cache miss and reloads the requested definition from the system database. Mapping-data values were never cached and are unaffected.

<small>Created 2026-07-15</small>
