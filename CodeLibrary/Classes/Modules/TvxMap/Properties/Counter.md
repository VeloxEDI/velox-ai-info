---
title: Counter
description: Gets or sets the map-level insertion counter that native view insert and cancellation paths adjust with RecordCount.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, map, counter, mutable-state]
---

```Delphi
property Counter: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Map <> nil then
    Value := Map.Counter
  else
    Value := Null;
end;
```

### Usage

Gets or sets the map-level insertion counter that Velox view insert and cancellation paths adjust with RecordCount.

- Prefer reading the value for diagnostics or conditional logic.
- Do not use it as a durable unique identifier or reconciliation total.
- If an event needs a per-view line, use the documented view context rather than assuming this aggregate counter is equivalent.

### Additional Technical Info
`Counter` is a mutable map-level Integer reset to zero at the start of a normal map execution. Native processing increments it for each [`TvxViewMap`](../../TvxViewMap.md) insertion and decrements it when that insertion is cancelled through the matching engine path.

The script helpers read or assign the backing field directly. No validation, recalculation, event, persistence or synchronisation occurs.

**Relationship to RecordCount**

Native map processing changes `Counter` and [`RecordCount`](RecordCount.md) together:

- Reset sets both to `0`.
- A view insertion increments both before the destination view enters insert state.
- The engine cancellation path decrements both before cancelling the destination post.

The current native map implementation does not otherwise read `Counter`; `RecordCount`, not `Counter`, is written to the final “total records processed” log message. A script can use Counter as transient execution state, but writing it immediately breaks the normal equality with RecordCount unless it manages that difference deliberately.

**Timing and accuracy**

The value may already be `1` when a record's `BeforeMap` event runs because the destination record is inserted first. Detail-view inserts contribute to the same map-level number. When user activity consumes the prepared insert and Velox has to open another insert, another increment can occur.

Counter is not a source-row number, guaranteed current line number, durable record count, primary key or transaction sequence. Destination saving happens later and a save failure does not roll it back.

If destination Insert raises after the increment, or CancelPost raises after the decrement, the value can describe attempted bookkeeping rather than completed work. A direct script assignment can be negative or otherwise unrelated to processing.

<small>Created 2026-07-15</small>
