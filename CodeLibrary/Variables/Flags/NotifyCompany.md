---
title: "NotifyCompany"
description: "Action-level reference flag indicating that configured company notification handling is requested."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - notification
---

```Delphi
NotifyCompany: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  NotifyCompany := True;
  Value := NotifyCompany;
end;
```

### Usage

`NotifyCompany` is an action-level reference flag indicating that configured company notification handling is requested.

Setting it is not proof of delivery, consent, correct recipient or durable queueing. Pair it with explicit event/type data and observable notification processing.

### Additional Technical Info
`NotifyCompany` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FNotifyCompany` |
| Reset/default | Action data reset assigns `False`. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

Current core configuration/binding/reset is proven, but no direct core consumer guarantees a notification. A scriptlet or configured downstream action must interpret it.

**Context and lifecycle**

Notification recipient, channel, event type, template and timing are not selected by this Boolean.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Setting it is not proof of delivery, consent, correct recipient or durable queueing. Pair it with explicit event/type data and observable notification processing.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
