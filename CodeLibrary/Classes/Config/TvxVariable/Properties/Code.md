---
title: Code
description: Gets or sets the variable identifier, with an intentionally unlocked getter and no automatic dataset rename.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, code, concurrency]
---

```Delphi
property Code: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Locals['BatchReference'].Code;
end;
```

### Usage

`Code` gets or sets the variable identifier, with an intentionally unlocked getter and no automatic dataset rename.

### Additional Technical Info
`Code` is the mutable string identifier used by variable lists/groups and as the initial DataSetName for lazy Data.

The setter uses the per-variable monitor. The getter deliberately returns `FCode` without locking, based on a source assumption that callers enumerate under an owning-list lock. Script reads are not guaranteed to satisfy that assumption, so a concurrent Code write is a data race.

Changing Code does not re-key/reorder an owning list and can create duplicate or unfindable entries depending on that owner's lookup logic. It also does not rename an already-created dataset; DataSetName snapshots Code only at first Data access.

Do not casually rename list/group-owned variables. Use owner configuration/lifecycle operations where available, and treat Code plus Value reads as separate non-atomic snapshots.

<small>Created 2026-07-15</small>
