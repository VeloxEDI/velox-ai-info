---
title: TvxMap
description: Represents the host-owned active map and exposes its mutable execution-level insertion counters.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, map, record-count, counter]
---

```Delphi
TvxMap = class
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Map <> nil then
    Value := Map.RecordCount
  else
    Value := Null;
end;
```

### Usage

`TvxMap` represents the Velox-provided active map and exposes its mutable execution-level insertion counters.

**Acquisition and ownership**

Scripts do not construct `TvxMap`. Use the global [`Map`](../../Variables/Modules/Map.md) reference in a map-item script and check it for nil. Velox declares that global name in all script compilers so reusable includes and scriptlets can compile, but binds an object only when the current item belongs to a map.

The object is owned by Velox. Do not free it, replace it or retain its reference after the current execution.

### Additional Technical Info
`TvxMap` is the live map module that coordinates configured view and field mappings between the active source and destination definitions. Its own script-visible surface contains only two writable Integer properties: [`Counter`](TvxMap/Properties/Counter.md) and [`RecordCount`](TvxMap/Properties/RecordCount.md).

**Execution and reset lifecycle**

For a normal map execution, Velox:

1. refuses to start when the existing execution log is cancelled or unsuccessful;
2. resets the map, both counters and every configured view's runtime count/line state;
3. synchronises definitions and checks source/destination preconditions;
4. processes each master view and its detail views;
5. logs `RecordCount` as the total records processed; and
6. saves destination data only when status, `SaveData` and map-test rules allow it.

The initial log guard occurs before the reset. If an already-used map object is invoked while its log is cancelled or failed, execution returns immediately and its prior counter values can remain visible.

**How the counters change**

Every native view insertion increments the view's record count and line number, then increments both map-level fields, before asking the destination view to enter insert state. The matching cancellation path decrements the same four fields before cancelling the destination post.

This means both values describe mutable insertion/cancellation bookkeeping. They do not prove how many source rows were read, how many unique business records exist, whether destination saving succeeded or whether a database transaction committed. Counts are not rolled back when the later destination save fails.

The properties are direct read/write fields. Script assignments bypass the native bookkeeping and can make them differ from one another, from view counts and from the final data. There is no bounds check, ownership check, persistence or locking around an assignment.

**Failure and concurrency boundaries**

The increment happens before the destination insert and the decrement before the destination cancel. If either downstream operation raises, the numeric state can already have changed. Incorrect or repeated cancellation can also drive counts below zero. Treat a count as operational context, not an audit or reconciliation total.

A map is mutable execution state and is not safe for unsynchronised concurrent script mutation. Errors from dereferencing a nil/stale reference or from downstream map work propagate through the surrounding script/event handling.

**Related entries**

- [`Map`](../../Variables/Modules/Map.md) explains when the global reference is bound.
- [`TvxViewMap`](TvxViewMap.md) represents each mapped destination view and maintains its own record count and line number.
- [`OnStartMap`](../../ScriptingGuide/Events/OnStartMap.md) and [`OnEndMap`](../../ScriptingGuide/Events/OnEndMap.md) describe view-level event boundaries.

<small>Created 2026-07-15</small>
