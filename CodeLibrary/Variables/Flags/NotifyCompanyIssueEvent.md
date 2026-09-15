---
title: "NotifyCompanyIssueEvent"
description: "Action-level reference intended to hold the event-type number used when company notification concerns an issue."
sidebar_position: 6
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
NotifyCompanyIssueEvent: LongInt
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  NotifyCompanyIssueEvent := 1002;
  Value := NotifyCompanyIssueEvent;
end;
```

### Usage

`NotifyCompanyIssueEvent` is an action-level reference intended to hold the event-type number used when company notification concerns an issue.

Validate identifier domain/scope and define how issue severity/status gates notification. A non-negative value is not delivery or audit evidence.

### Additional Technical Info
`NotifyCompanyIssueEvent` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FNotifyCompanyIssueEvent` |
| Reset/default | Action data reset assigns `-1` as the unset sentinel. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

The field has no proven automatic core event/notification side effect. It supplies a value for downstream configured logic.

**Context and lifecycle**

It is independent from `NotifyCompanyEvent`, `SendIssueEvent` and the `NotifyCompany` Boolean; no synchronization is performed.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Validate identifier domain/scope and define how issue severity/status gates notification. A non-negative value is not delivery or audit evidence.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
