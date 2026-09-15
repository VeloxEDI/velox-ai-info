---
title: FreeData
description: Frees the variable's lazily owned client dataset under its monitor and invalidates every borrowed dataset reference.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, dataset, lifetime]
---

```Delphi
procedure FreeData;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  // Only after all users of this local dataset have finished.
  Locals['LookupData'].FreeData;
  Value := True;
end;
```

### Usage

`FreeData` frees the variable's optional client dataset and invalidates every borrowed dataset reference.

### Additional Technical Info
`FreeData` locks the variable, frees its internal dataset when assigned, sets the field to nil and unlocks.

It does not change Code or Value. A later [`Data`](../Properties/Data.md) read creates a new empty `TvxClientDataSet` and snapshots the then-current Code into its DataSetName.

The dataset returned earlier is a borrowed raw object reference. Callers use it after the variable monitor has been released, so FreeData can destroy it while another script still reads, edits or opens it. This can cause access violations; coordinate a quiescent boundary.

Repeated calls are harmless when the internal field is nil. Dataset destruction may close data and release resources synchronously. The variable destructor also calls FreeData, so scripts must not own/free list- or group-owned variables.

<small>Created 2026-07-15</small>
