---
title: SourceManager
description: Provides the action-owned manager for configured source and destination definitions.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - flow
  - definitions
---

```Delphi
property SourceManager: TvxDefManager read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action.SourceManager <> nil then
    Value := Action.SourceManager.SourceCount
  else
    Value := 0;
end;
```

### Usage

`SourceManager` provides the action-owned manager for configured source and destination definitions.

**Behaviour**

Treat the reference as read-only. The manager supplies definition count/index access used by flow data setup, reset, transaction commit/rollback and request/response propagation. Its returned definitions and sources are live mutable engine objects.

Replacing or niling it can leak the old object, cause the action to free a foreign object later and break execution paths that dereference the manager without nil checks. Assignment does not persist configuration or safely transfer a definition set.

### Additional Technical Info
`SourceManager` is the live `TvxDefManager` that owns/organises the definitions used by this action. [`Data`](Data.md) is an exact scripting alias for the same reference.

Normal loaded actions are expected to have a manager, but nil/partial state is possible in design, corrupted or manually altered contexts.

**Implementation**

The action creates a manager as an owned component for new configuration. Loading/component transfer can replace that managed child. The action destructor frees whichever manager is currently assigned.

Scripting runtime registration exposes a direct read/write helper for the native property and reuses it for `Data`. The setter performs only field assignment: it does not free the old manager, clone/reparent the new object or validate ownership.

**Edge cases and quirks**

- `SourceManager` is not the same as the current [`Source`](../../../../Variables/Modules/Source.md); the latter is one context definition.
- `Data` and `SourceManager` can never legitimately refer to different objects because both helpers use this same field.
- A non-nil manager can have zero definitions or definitions whose modules are not loaded.
- The manager class is intentionally hidden from top-level public class navigation even though objects and registered members are usable through this return type.

**Side effects**

Reference reads are cheap. Manager/definition operations can perform or prepare database, file and API work. Reference assignment changes core action ownership/execution structure and should not be used by normal scripts.

**Performance and concurrency**

Property access is constant-time; child enumeration and operations depend on count/work performed. The entire graph is action-scoped mutable state, not a shared thread-safe registry.

**Remarks**

Velox owns the manager and its configured graph. Never free it or retain children after the action is released/reloaded.

**Related entries**

- [`Data`](Data.md) — exact alias.
- [`Source`](../../../../Variables/Modules/Source.md) and [`Dest`](../../../../Variables/Modules/Dest.md) — current definition pointers.
- [`Request`](Request.md) and [`Response`](Response.md) — propagated into configured definitions.

<small>Created 2026-07-15</small>
