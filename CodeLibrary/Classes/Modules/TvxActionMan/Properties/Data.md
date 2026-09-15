---
title: Data
description: Provides an exact alias of SourceManager for the action-owned data-definition manager.
sidebar_position: 5
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
property Data: TvxDefManager read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action.Data <> nil then
    Value := Action.Data.SourceCount
  else
    Value := 0;
end;
```

### Usage

Provides an exact alias of SourceManager for the action-owned data-definition manager.

**Behaviour**

The returned live manager supplies the action's source/destination definition items and is used throughout execution for reset, commit/rollback, request/response propagation and data access.

Mutations performed through script-available manager and definition members affect the running action. Replacing the reference can disconnect the configured manager, leak the previous object, make the action later free an object it does not own, or cause nil dereferences during execution.

**Important usage notes**

- `Data` is not a dataset and does not itself contain the current record. It is a manager of configured definitions.
- The name is an alias added for scripting convenience; no separate data-manager state exists.
- A non-nil value does not prove that any definitions are loaded. Check its count and each returned definition.
- Assigning nil can break later execution paths that dereference `SourceManager` without a nil guard.

### Additional Technical Info
`Data` is a read/write scripting alias for [`SourceManager`](SourceManager.md), the live definition manager owned by this action.

`Action.Data` and `Action.SourceManager` return the exact same object reference.

**Implementation**

Both scripting names use the same runtime getter and setter for the native `SourceManager` property. A new action creates the manager as an owned component; loading can replace it through the manager's child/component lifecycle, and the action destructor frees the current assigned manager.

The generated setter is direct field assignment. It does not free the previous manager, reparent the supplied object, clone definitions or record ownership.

**Side effects**

Reading the reference has no I/O. Operations on the returned manager can reset sources, alter definition state or lead to database/file/API effects. Assigning the reference changes core ownership/execution structure and is unsafe for normal scripts.

**Performance and concurrency**

Reference access is constant-time. The manager and definitions are mutable, action-scoped objects and are not a cross-thread data service.

**Related entries**

- [`SourceManager`](SourceManager.md) — exact alias and native property name.
- [`TvxActionMan`](../../TvxActionMan.md) — owns the manager.
- [`Source`](../../../../Variables/Modules/Source.md) and [`Dest`](../../../../Variables/Modules/Dest.md) — current definition references supplied directly to scripts.

<small>Created 2026-07-15</small>
