---
title: "ProcessGrandMasterRecord"
description: "Cancels the current linked view and requests reprocessing of the root-most available master record."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - program-control
  - mapping
  - master-detail
  - reprocessing
---

```Delphi
function ProcessGrandMasterRecord: boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DATA_Self.FieldByName('RestartHierarchy').AsBoolean then
  begin
    ProcessGrandMasterRecord;
    Value := False;
    Exit;
  end;
end;
```

### Usage

`ProcessGrandMasterRecord` cancels the current linked view and requests reprocessing of the root-most available master record.

### Additional Technical Info
`ProcessGrandMasterRecord` cancels the current view-map pass, clears reprocess requests along its master chain and requests another pass of the root-most master view. It is intended for nested master/detail mappings where a deep child must make the complete hierarchy start again from its top parent.

“Grand master” does not mean exactly two levels above the current view. The implementation follows `MasterViewMap` repeatedly until it finds the last available ancestor, whether that is the immediate parent, a grandparent or a more distant root. The example is fictional and source-reviewed only.

**Availability and return value**

The function is dynamically registered only when the current script `MapItem` is a `TvxViewMap`. Generator reference mode makes it appear in the Code Library but does not make it callable from field or unrelated action contexts.

It always returns `True`. This does not confirm that any master existed or was reprocessed; the value is fixed before the hierarchy is inspected.

**Implementation sequence**

1. Set the current view's `Cancelled` flag to `True`.
2. Set the current view's `Reprocess` flag to `False`.
3. Start with the immediate `MasterViewMap`.
4. If a master exists, clear its `Reprocess` flag.
5. Walk upward while another master exists, clearing each ancestor's `Reprocess` flag.
6. Set `Reprocess=True` only on the root-most ancestor reached.

Clearing intermediate flags is deliberate: it prevents several levels independently requesting reprocessing and helps the mapping loops coordinate one restart at the top.

**Hierarchy cases**

| Hierarchy | Reprocessing target |
|---|---|
| Current view has no master | None; the current view is still cancelled. |
| Current view has one master | The immediate master. |
| Current -> parent -> root | The root; the parent's reprocess flag is cleared. |
| Deeper chain | The last reachable master in the chain. |

The helper changes flags and returns to the script; it does not immediately transfer execution to the target. Use `Exit` when no subsequent script statement should run.

**Risks and limitations**

- Calling it in a top-level view silently cancels that view without scheduling another one.
- A condition that remains true after the root is reprocessed can create an endless or very expensive mapping cycle.
- The master links are assumed to form an acyclic hierarchy. A corrupt cyclic `MasterViewMap` graph would make the native `while` loop non-terminating.
- It does not cancel the enclosing action, change log success, add a diagnostic or reverse prior side effects.
- The fixed `True` result cannot be used to detect configuration errors.

Use the narrower [`ProcessMasterRecord`](ProcessMasterRecord.md) when only the immediate parent should be revisited. Document the state transition that makes the reprocessing condition eventually false.

**Related entries**

- [`ProcessMasterRecord`](ProcessMasterRecord.md) targets the immediate master only.
- [`CancelExecution`](CancelExecution.md) cancels the current view without setting an ancestor reprocess flag.

<small>Created 2026-07-15</small>
