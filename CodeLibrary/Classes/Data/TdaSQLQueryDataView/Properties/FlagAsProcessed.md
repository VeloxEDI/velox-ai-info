---
title: FlagAsProcessed
description: Controls whether the next cursor-advance event captures this row's key values for later processed-flag updates.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, database, processed, primary-key, one-shot]
---

```Delphi
property FlagAsProcessed: Boolean read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Exclude the current row from the next key-capture event.
  if Dataview.Query.FieldByName('SkipProcessing').AsBoolean then
    Dataview.FlagAsProcessed := False;
end;
```

### Usage

`FlagAsProcessed` controls whether the next cursor-advance event captures this row's key values for later processed-flag updates.

**Behaviour**

- True allows the next capture event and remains True.
- False skips exactly one capture event and automatically becomes True during that event.
- Merely assigning False does not reset automatically until a capture event actually occurs.
- The setting has no useful processed-flag effect unless `FlagIdFields` and the database-definition update controls are enabled and the flow completes successfully.

**Errors**

Assignment does not raise by itself. Key capture can fail through invalid/destroyed field references or other view lifecycle errors; later flagging can log database errors independently.

**Usage notes**

Use False only as a deliberate current-row exclusion. Do not use this property to enable the feature globally; that is the role of `FlagIdFields` plus the database-definition settings.

### Additional Technical Info
`FlagAsProcessed` is the preferred name for a one-shot Boolean latch used while Velox records key values for later “flag as processed” database updates. Set it to False before the cursor advances when the current row must be excluded from the next capture event.

The example assumes a configured Boolean field named `SkipProcessing`; adapt the condition to the actual data definition. It is source-reviewed and was not executed by the documentation workflow.

The default is True. `FlagAsProcessed` and `RecordPKValue` read and write the same native field, so changing either changes both immediately.

**Implementation**

Before direct view `Next` movement, and through the report pipeline's `OnNext` handler, Velox calls `RecordPrimaryKeyValuesEvent`. When the latch is True, that handler appends the current values of every tracked primary/foreign-key descriptor to its capture list. When False, it captures nothing, sets the latch back to True and returns.

The captured values are consumed later by the database definition's successful end-of-flow processed-flag update. This property does not itself call that update routine.

**Edge cases and quirks**

- The name can be misread as a persistent flag or immediate database operation. It is neither; it is a one-event capture decision.
- Timing is significant. Set False while the intended row is current and before any view or report-pipeline movement that fires the capture handler.
- Navigation through different cursor surfaces shares the same dataset. Helper calls can move the row and consume the one-shot latch earlier than expected.
- Repeatedly assigning False before the event still skips only that one event because the property stores a Boolean, not a counter.

**Side effects**

Assignment changes only the in-memory latch. The next capture event can append key-value strings or skip them and restore True. Database writes occur later through the surrounding flow lifecycle.

**Performance and concurrency**

Assignment is constant-time. An allowed capture scales with the number of tracked key fields. The latch and capture lists are unsynchronised flow state; concurrent or nested navigation makes its meaning unreliable.

<small>Created 2026-07-15</small>
