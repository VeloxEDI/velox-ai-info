---
title: Clear
description: Destructively reinitialises the current execution log, freeing its messages, file/transport events and diagnostic traces before raising the cleared event.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, clear, destructive]
---

```Delphi
procedure Clear;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  { Destructive: only when deliberately starting a fresh current log. }
  if Action <> nil then
    if Action.Log <> nil then
      Action.Log.Clear;
  Value := True;
end;
```

### Usage

Destructively reinitialises the current execution log, freeing its messages, file/transport events and diagnostic traces before raising the cleared event.

**Errors and concurrency**

Callbacks can run when the cleared event is broadcast. Clearing during active execution or from a competing thread can race with logging and invalidate state another component is using. Only use it at a lifecycle boundary controlled by the owning action.

### Additional Technical Info
`Clear` runs the Log's full `New` lifecycle and then broadcasts its log-cleared event.

**What is reset/freed**

The dynamic Reset/New chain:

- stores the previous overall status as LastStatusType, then sets overall/header/row types to OK;
- sets Boolean Status and Handled true;
- clears action/transport identifiers and names;
- resets start/end time and deadlock state;
- clears SQL, flag/unflag SQL, HTTP and transport-trace lists;
- frees owned message items and file/transport log objects;
- resets normal module identity/default fields through New; and
- emits the cleared callback after reinitialisation.

Running state is deliberately not reset by the Log Reset implementation.

**Important boundaries**

Clear does not merely clear a screen, remove one status or delete an already persisted database log. It destroys the current in-memory evidence/state used by later audit, notification, transport and save paths. References to freed child log/file/transport objects become invalid.

The method has no confirmation, return value, transaction or script-level rollback.

**Related entries**

- [`TvxLog`](../../TvxLog.md) — ownership and lifecycle.
- [`StatusType`](../Properties/StatusType.md) — overall status without clearing content.
- [`IsCancelled`](../Properties/IsCancelled.md) — dedicated compatibility reset behaviour.

<small>Created 2026-07-15</small>
