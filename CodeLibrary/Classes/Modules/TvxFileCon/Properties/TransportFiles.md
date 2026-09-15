---
title: TransportFiles
description: Returns the mutable FileCon-owned list of output paths and borrowed log-file references awaiting transport-event creation.
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, transport, string-list, ownership]
---

```Delphi
property TransportFiles: TStringList read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.TransportFiles.Count
  else
    Value := 0;
end;
```

### Usage

`TransportFiles` returns the mutable FileCon-owned list of output paths and borrowed log-file references awaiting transport-event creation.

**Critical ownership/lifetime rules**

- Do not replace/free the list or free/add arbitrary Objects. It does not own them, and consumers cast them to Velox log-file objects.
- Strings and Objects must remain index-aligned. Sorting/deleting/inserting only one side or manufacturing pointers can corrupt audit/transport association.
- Empty and duplicate paths are accepted; no existence/access/delivery validation occurs.
- FileCon Reset does not clear the list. The owning transport action clears at the end of its try block, but an exception before that line can leave stale entries for reuse.
- Clearing removes entries only; it does not undo transport events already created or filesystem changes.

**Security and safety**

Paths can disclose business data and control later transport under the service identity. Unbounded/duplicate accumulation increases memory and delivery work. The list is unsynchronised; inspect/mutate only within the owning action lifecycle, with read-only inspection preferred.

### Additional Technical Info
`TransportFiles` exposes the FileCon-owned `TStringList` used to stage written file paths for outbound transport-event creation.

The reference is read-only, but the returned list is mutable. It is created with duplicate acceptance, unsorted/case-insensitive comparison and non-owning object semantics; FileCon frees the list itself.

Each native [`RecordFileForTransport`](../Methods/RecordFileForTransport.md) entry pairs a path string with a borrowed `TvxLogFile` pointer in `Objects[Index]`. For write events, the action transport iterates the list, sets CurrentFileName to each path and creates an event with that object. Normal completion clears the list without freeing those objects.

**Related entries**

- [`RecordFileForTransport`](../Methods/RecordFileForTransport.md) — native append contract.
- [`FileEvent`](FileEvent.md) — write-event branch selecting list iteration.
- [`CurrentFileName`](CurrentFileName.md) and [`DoMoveToTransport`](DoMoveToTransport.md) — separate current/staging state.

<small>Created 2026-07-15</small>
