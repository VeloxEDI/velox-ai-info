---
title: RecordCount
description: Gets or sets the mapped view's cumulative insertion count retained after engine cancellation bookkeeping.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, view-map, record-count, processing]
---

```Delphi
property RecordCount: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  // Replace M_ORDERS with a configured mapped-view identifier.
  if M_ORDERS <> nil then
    Value := M_ORDERS.RecordCount
  else
    Value := 0;
end;
```

### Usage

`RecordCount` gets or sets the mapped view's cumulative insertion count retained after engine cancellation bookkeeping.

**Direct writes**

The public setter stores any Integer without validation, recount, data operation or synchronisation. A script write can make this view disagree with LineNo, [`TvxMap.RecordCount`](../../TvxMap/Properties/RecordCount.md), destination row count and logs.

Do not use RecordCount as a unique ID, source-row count or reconciliation control. Prefer read-only diagnostics and obtain durable counts from the destination/transaction result.

### Additional Technical Info
`RecordCount` is the mutable cumulative insertion count for one [`TvxViewMap`](../../TvxViewMap.md) during the current map execution.

Map Reset sets it to zero. Every native view Insert increments this field before the destination Insert and every matching engine CancelPost decrements it before destination cancellation. The same operations also adjust [`LineNo`](LineNo.md) and both map-level counters.

Unlike LineNo, RecordCount is not reset before each OnStartMap/detail loop. A detail view processed for multiple master records therefore accumulates its retained insertions across those loops.

**Logging and persistence boundary**

After all map view processing, Velox logs each view's RecordCount as records processed, then logs the map total. Destination SaveData occurs afterwards and only if status/save/test conditions allow it. A nonzero/logged count is therefore not proof of successful save, external acknowledgement or database commit, and a later failure does not roll it back.

The count can include more than one insertion for a source record when script activity consumes an insert and the engine reopens another. It can also remain incremented/decremented when a downstream Insert/CancelPost raises.

<small>Created 2026-07-15</small>
