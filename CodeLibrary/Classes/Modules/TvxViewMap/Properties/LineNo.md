---
title: LineNo
description: Gets or sets the view insertion line number that restarts before each non-reprocess view-processing loop.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, view-map, line-number, event-loop]
---

```Delphi
property LineNo: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  // Replace M_ORDERS with a configured mapped-view identifier.
  if M_ORDERS <> nil then
    Value := M_ORDERS.LineNo
  else
    Value := 0;
end;
```

### Usage

`LineNo` gets or sets the view insertion line number that restarts before each non-reprocess view-processing loop.

### Additional Technical Info
`LineNo` is a mutable Integer representing the current insertion position within a [`TvxViewMap`](../../TvxViewMap.md) processing loop.

**Resets and updates**

- Map Reset sets LineNo to `0` for every view.
- Before each non-reprocess view loop, Velox sets it to `0` immediately before [`OnStartMap`](../../../../ScriptingGuide/Events/OnStartMap.md), even when no OnStartMap script is configured.
- Each destination view Insert increments it before calling the destination Insert operation.
- The matching engine CancelPost decrements it before cancelling the destination post.

For a linked-data loop, values normally progress 1, 2, 3 for inserted records after OnStartMap has seen zero. For a detail view, ProcessDataView runs for each master record, so LineNo normally restarts for each master. When Reprocess is true, OnStartMap and its reset are skipped, allowing the sequence to continue.

This differs from [`RecordCount`](RecordCount.md), which accumulates for that view across the full map execution and is not reset at each OnStartMap loop.

**Quirks and guidance**

The increment occurs before the destination Insert; the decrement before destination CancelPost. Exceptions can leave bookkeeping changed. If user script consumes the prepared insert and the engine opens another one, LineNo can advance again.

The direct setter performs no insert, cancel or validation and accepts negative/arbitrary values. Writing it can disrupt later script logic and break its relationship with RecordCount/map totals.

LineNo is not guaranteed to match a source dataset row, file line, view RecordCount, saved record number or durable key. Treat it as current event-loop context only.

<small>Created 2026-07-15</small>
