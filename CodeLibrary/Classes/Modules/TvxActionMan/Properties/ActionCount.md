---
title: ActionCount
description: Returns the current number of configured action steps in this flow manager.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - flow
  - action-count
---

```Delphi
property ActionCount: Integer read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.ActionCount;
end;
```

### Usage

`ActionCount` returns the current number of configured action steps in this flow manager.

**Behaviour**

The value is live, not a snapshot. Scripts cannot add or remove action items using this class, and Velox can reload the flow configuration. Read the count immediately before indexed access and use it only within the current execution.

An action with zero steps is allowed as configuration, but normal execution marks its log cancelled with a no-actions message. The count does not say whether individual steps are active, assigned, loadable or successful.

**Errors**

Reading the count on a valid manager performs no range access. Errors arise from an invalid/stale manager reference, not from an ordinary zero value.

### Additional Technical Info
`ActionCount` is the read-only number of action items currently held in the manager's ordered child collection.

Valid indexes for [`Actions`](Actions.md) are `0` through `ActionCount - 1`. When the count is zero, there is no valid index.

**Implementation**

The runtime getter returns the manager's current child count directly. Definition-manager and transport objects are handled separately by the native manager and are not normally included in this action-step collection.

**Performance and concurrency**

Access is constant-time. There is no script-visible collection lock spanning a count-then-index sequence, so do not share a manager across threads or treat that sequence as atomic.

**Related entries**

- [`Actions`](Actions.md) — retrieves a step by zero-based index.
- [`TvxActionMan`](../../TvxActionMan.md) — owns the collection.
- [`TvxActionItem`](../../TvxActionItem.md) — returned item type.

<small>Created 2026-07-15</small>
