---
title: "SendEvent"
description: "Action-level reference intended to hold an event-type number selected by script for a send/success event."
sidebar_position: 10
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
SendEvent: LongInt
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  SendEvent := 1001;
  Value := SendEvent;
end;
```

### Usage

`SendEvent` is an action-level reference intended to hold an event-type number selected by script for a send/success event.

Validate identifier domain/scope and confirm the downstream creator. A value is not an event row, message, commit or delivery receipt.

### Additional Technical Info
`SendEvent` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FSendEvent` |
| Reset/default | Action data reset assigns `-1` as the unset sentinel. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

Current core exposes the storage but no assignment-time event creation. A downstream scriptlet/configuration must consume it.

**Context and lifecycle**

It is independent from `SendIssueEvent` and notification event references.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Validate identifier domain/scope and confirm the downstream creator. A value is not an event row, message, commit or delivery receipt.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
