---
title: "NotifyPartner"
description: "Action-level reference flag indicating that configured partner notification handling is requested."
sidebar_position: 7
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
NotifyPartner: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  NotifyPartner := True;
  Value := NotifyPartner;
end;
```

### Usage

`NotifyPartner` is an action-level reference flag indicating that configured partner notification handling is requested.

Do not treat `True` as consent, routing, queueing or delivery proof. Validate the partner relationship and use auditable notification processing.

### Additional Technical Info
`NotifyPartner` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FNotifyPartner` |
| Reset/default | Action data reset assigns `False`. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

Current core source stores/resets the flag but does not guarantee a notification. A downstream scriptlet/configuration must read it.

**Context and lifecycle**

The flag does not resolve a partner, address, channel, template or event by itself.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Do not treat `True` as consent, routing, queueing or delivery proof. Validate the partner relationship and use auditable notification processing.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
