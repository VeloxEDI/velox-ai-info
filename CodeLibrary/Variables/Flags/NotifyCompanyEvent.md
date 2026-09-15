---
title: "NotifyCompanyEvent"
description: "Action-level reference intended to hold the configured event-type number for a company notification event."
sidebar_position: 5
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
NotifyCompanyEvent: LongInt
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  NotifyCompanyEvent := 1001;
  Value := NotifyCompanyEvent;
end;
```

### Usage

`NotifyCompanyEvent` is an action-level reference intended to hold the configured event-type number for a company notification event.

Treat values below zero as unset unless the local contract says otherwise. Validate existence, active state and scope; never confuse a database identifier with proof that processing occurred.

### Additional Technical Info
`NotifyCompanyEvent` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FNotifyCompanyEvent` |
| Reset/default | Action data reset assigns `-1` as the unset sentinel. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

Storage alone does not create an event or send a notification; a downstream script/configuration must consume and validate the identifier.

**Context and lifecycle**

The identifier's table/domain and tenant/application scope come from the consuming workflow, not the integer type.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Treat values below zero as unset unless the local contract says otherwise. Validate existence, active state and scope; never confuse a database identifier with proof that processing occurred.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
