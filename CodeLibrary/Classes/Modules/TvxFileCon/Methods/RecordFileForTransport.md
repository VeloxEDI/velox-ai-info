---
title: RecordFileForTransport
description: Appends the current filename and borrowed log-file reference to this FileCon's outbound transport list.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, transport, queue, ownership]
---

```Delphi
procedure RecordFileForTransport;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    if FileCon.CurrentFileName <> '' then
    begin
      FileCon.RecordFileForTransport;
      Value := FileCon.TransportFiles.Count;
    end
    else
      Value := 0
  else
    Value := 0;
end;
```

### Usage

`RecordFileForTransport` appends the current filename and borrowed log-file reference to this FileCon's outbound transport list.

**Consumer behaviour**

For write events, the transport action iterates [`TransportFiles`](../Properties/TransportFiles.md), assigns each string back to CurrentFileName, resolves per-record tag data and creates a transport event using the corresponding object as `TvxLogFile`. The normal action clears the list at the end of its try block.

If an exception occurs before that clear, entries can remain. FileCon Reset itself does not clear the list. Manually added empty/duplicate/stale entries can therefore create missing, duplicate or unsafe transport/log associations.

### Additional Technical Info
`RecordFileForTransport` appends the current file to the in-memory list consumed when an outbound file transport action creates transport events.

**Implementation**

The native method executes one `AddObject` call:

- string value: current `CurrentFileName` exactly as stored;
- associated object: the current native `LogFile` reference.

The list accepts duplicates, is case-insensitive but unsorted, and does not own/free its associated objects. No validation checks that the path is nonempty, exists, was written successfully, is safe to transport or has a non-nil/live log object.

**Ownership, side effects and errors**

This procedure queues only in memory; it does not move/upload/send or confirm delivery. Do not free, replace or manufacture the borrowed log object. The method itself has no exception handler; allocation/list errors can propagate. Later transport effects are external and non-transactional.

**Performance and concurrency**

Append is normally cheap, but unbounded/stale accumulation increases memory and later transport work. The list and object references are unsynchronised; mutate them only in the owning action thread.

**Related entries**

- [`TransportFiles`](../Properties/TransportFiles.md) — mutable list/ownership contract.
- [`CurrentFileName`](../Properties/CurrentFileName.md) and [`FileEvent`](../Properties/FileEvent.md) — path and write/read routing state.
- [`DoMoveToTransport`](../Properties/DoMoveToTransport.md) — separate staging-move latch, not queue registration.

<small>Created 2026-07-15</small>
