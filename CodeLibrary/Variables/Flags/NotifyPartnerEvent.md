---
title: "NotifyPartnerEvent"
description: "Action-level reference intended to hold the configured event-type number for partner notification."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - event-reference
---

```Delphi
NotifyPartnerEvent: LongInt
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  NotifyPartnerEvent := 1003;
  Value := NotifyPartnerEvent;
end;
```

### Usage

`NotifyPartnerEvent` is an action-level reference intended to hold the configured event-type number for partner notification.

Validate identifier existence, active state and scope. Do not infer recipient, delivery or persistence from the integer.

### Additional Technical Info
`NotifyPartnerEvent` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FNotifyPartnerEvent` |
| Reset/default | Action data reset assigns `-1` as the unset sentinel. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

No direct automatic core event or notification is proven from assignment. Downstream configured logic must consume it.

**Context and lifecycle**

It is separate from the `NotifyPartner` Boolean and other event references.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Validate identifier existence, active state and scope. Do not infer recipient, delivery or persistence from the integer.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
