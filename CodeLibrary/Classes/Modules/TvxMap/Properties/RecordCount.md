---
title: RecordCount
description: Gets or sets the map's mutable total of view insertions retained after engine cancellation bookkeeping.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, map, record-count, processing]
---

```Delphi
property RecordCount: Integer read write;
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

`RecordCount` gets or sets the map's mutable total of view insertions retained after engine cancellation bookkeeping.

### Additional Technical Info
`RecordCount` is the map-level total maintained while Velox inserts records into all mapped destination views. It is reset to zero for a normal execution, incremented on each view insert and decremented when the engine cancels that pending record through its matching cancellation path.

Both accessors operate directly on the backing Integer. A write does not insert, cancel, save or recount data, and it is not persisted as map configuration.

**What the total includes**

The map total aggregates insertions across master and detail [`TvxViewMap`](../../TvxViewMap.md) objects. Each view also maintains its own RecordCount. The map's value therefore does not necessarily equal the count of one destination dataset or the number of source rows.

Velox inserts a destination record before running that record's `BeforeMap` work, so the value can already include the current record inside its events. If script work consumes the prepared insert and the engine must open another one, the total can increment again. Engine-driven rejection, cancellation or unsuccessful processing normally calls the matching cancellation path and removes that insertion from the count.

**Final log and save boundary**

After view processing, Velox logs this field as the map's “total records processed”. It then attempts destination SaveData only when the log remains successful and save/test rules allow it. Consequently, the logged/value count is not proof that data was saved, committed, delivered or accepted by an external system. A later SaveData failure does not reduce it.

The value also does not identify unique business records, distinguish inserts from user-created extra records, or provide an audit-quality source/destination reconciliation.

**Quirks and failure cases**

- The increment occurs before the destination Insert call. An exception from that call can leave the count incremented.
- The decrement occurs before the destination CancelPost call. An exception from cancellation can leave the count decremented.
- Direct script writes bypass view counts and [`Counter`](Counter.md), so all three can disagree.
- An execution rejected by a pre-existing failed/cancelled log exits before Reset and can expose values retained from an earlier run.
- Values are unsynchronised mutable state and can be negative after incorrect direct writes or mismatched cancellation.

Use the property as current execution context only. Check [`Map`](../../../../Variables/Modules/Map.md) for nil, avoid concurrent writes and use destination/database acknowledgements when a durable or committed count matters.

<small>Created 2026-07-15</small>
