---
title: RecordPKValue
description: Provides the legacy name for the one-shot latch that controls the next primary-key capture event.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, database, primary-key, legacy, one-shot]
---

```Delphi
property RecordPKValue: Boolean read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Legacy spelling: skip capture for the current row on the next advance.
  Dataview.RecordPKValue := False;
  Value := Dataview.FlagAsProcessed;  // Also False: both names share one field.
end;
```

### Usage

`RecordPKValue` provides the legacy name for the one-shot latch that controls the next primary-key capture event.

**Behaviour**

- Reads always equal `FlagAsProcessed` at the same instant.
- True allows the next capture; False skips one capture and is consumed back to True.
- False remains stored if no capture event occurs.
- Assigning through either alias immediately overwrites the value last assigned through the other.

**Errors**

Property access itself does not raise. Capture and later SQL update failures follow the view, field and database error paths.

**Usage notes**

Prefer `FlagAsProcessed` in new scripts because it matches the current product terminology. See [FlagAsProcessed](./FlagAsProcessed.md) for the complete timing and lifecycle contract.

### Additional Technical Info
`RecordPKValue` is the legacy name for the same one-shot primary-key capture latch exposed as `FlagAsProcessed`. Set False before the relevant cursor advance to omit the current row from exactly the next key-capture event.

The example demonstrates the exact alias relationship. It is source-reviewed and was not executed by the documentation workflow.

The default is True. Both public properties directly read/write `FRecordPKValue`; there is no separate state or conversion.

**Implementation**

The view's direct `Next` method and report-pipeline `OnNext` handler call the same key-recording routine. With True, it appends current values for all tracked primary/foreign-key descriptors. With False, it records nothing, sets the shared field back to True and returns.

Those captured strings may later form WHERE clauses for processed-record updates. This property does not call the update routine and does not enable `FlagIdFields`.

**Edge cases and quirks**

- Despite “Record” in the name, assignment does not record a value. Recording occurs only during the later cursor event.
- Helper or report navigation can consume the latch, so do not assume the next explicit script `Next` is necessarily the next event.
- The legacy and preferred names can make two pieces of code appear independent when they are actually racing to control one Boolean.
- It cannot skip multiple rows in advance; set False separately for each row before its capture event.

**Side effects**

Assignment changes only the shared in-memory latch. The next event can append key values or skip and restore it. Database writes remain part of end-of-flow processing.

**Performance and concurrency**

Property access is constant-time; allowed capture scales with tracked key fields. The shared latch is unsynchronised and belongs to one flow cursor.

<small>Created 2026-07-15</small>
