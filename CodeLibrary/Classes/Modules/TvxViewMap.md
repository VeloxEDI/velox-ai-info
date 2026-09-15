---
title: TvxViewMap
description: Represents a host-owned mapped destination view and exposes its mutable cumulative and per-loop insertion counters.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, view-map, record-count, line-number]
---

```Delphi
TvxViewMap = class
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

`TvxViewMap` represents a Velox-provided mapped destination view and exposes its mutable cumulative and per-loop insertion counters.

**Counter lifecycle**

Map Reset sets both counters to zero before normal processing. Each Velox view insertion then:

1. increments this view's RecordCount and LineNo;
2. increments map-level RecordCount and Counter; and
3. asks the destination data view to enter insert state.

The matching engine cancellation path decrements the same four values before cancelling the destination post.

RecordCount accumulates retained insertions for this view across the map execution. LineNo has an additional reset: immediately before each non-reprocess [`OnStartMap`](../../ScriptingGuide/Events/OnStartMap.md) event/loop, Velox sets LineNo to zero. A detail view processed for each master therefore restarts its line sequence per master loop while its RecordCount continues accumulating.

OnStartMap observes zero. The destination record is inserted before BeforeMap/field/AfterMap processing, so those stages normally observe the first current record as line/count one. Reprocess skips OnStartMap and its LineNo reset.

**Accuracy and effects**

The increments/decrements happen before downstream Insert/CancelPost. An exception can leave counters changed. If script work consumes the prepared insert and Velox reopens another insert, counts can increment again. Direct property assignments bypass all data operations and can make view/map/destination state disagree.

At completion Velox logs each view's RecordCount and the map total before destination SaveData. Neither count proves that saving, external delivery or a database commit succeeded. LineNo is loop-relative, not a source row number, durable identifier or primary key.

The fields are unsynchronised mutable execution state. Prefer read-only use, avoid concurrent writes and validate durable outcomes at the destination boundary.

### Additional Technical Info
`TvxViewMap` is the live mapping object for one configured destination data view. Its own script-visible members are [`LineNo`](TvxViewMap/Properties/LineNo.md) and [`RecordCount`](TvxViewMap/Properties/RecordCount.md).

**Acquisition and naming**

Scripts do not construct this class. For every view in the active [`TvxMap`](TvxMap.md), Velox registers and binds:

```text
M_ + uppercase(view description)
```

For example, description `Orders` becomes `M_ORDERS`. The code applies uppercase only: it does not remove spaces/punctuation or resolve duplicate descriptions. Configuration must therefore produce valid, unique script identifiers. A view that is not part of the active map is not available in that map's scripter.

The object is owned by its map. Do not free it or retain it after execution/reload. Inherited mapping/event members remain documented at their declaring entries.

<small>Created 2026-07-15</small>
