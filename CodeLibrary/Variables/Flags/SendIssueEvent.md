---
title: "SendIssueEvent"
description: "Action-level reference intended to hold an event-type number selected for an issue send/event path."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - issue-event-reference
---

```Delphi
SendIssueEvent: LongInt
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  SendIssueEvent := 1002;
  Value := SendIssueEvent;
end;
```

### Usage

`SendIssueEvent` is an action-level reference intended to hold an event-type number selected for an issue send/event path.

Define issue/status gates and validate the identifier. Do not treat it as a persisted issue/event or notification outcome.

### Additional Technical Info
`SendIssueEvent` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FSendIssueEvent` |
| Reset/default | Action data reset assigns `-1` as the unset sentinel. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

Assignment only stores the number; downstream configured logic must decide whether and how an issue event is created.

**Context and lifecycle**

It is distinct from `SendEvent` and `NotifyCompanyIssueEvent`.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Define issue/status gates and validate the identifier. Do not treat it as a persisted issue/event or notification outcome.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
