---
title: "TypeNum"
description: "General action-level reference intended to carry a configured type/event-type identifier."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - type-reference
---

```Delphi
TypeNum: LongInt
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  TypeNum := 1001;
  Value := TypeNum;
end;
```

### Usage

`TypeNum` is a general action-level reference intended to carry a configured type/event-type identifier.

Validate the exact domain and application scope. Do not reuse one value across incompatible type tables simply because each uses an integer key.

### Additional Technical Info
`TypeNum` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FTypeNum` |
| Reset/default | Action data reset assigns `-1` as the unset sentinel. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

Current core stores/resets the value but does not impose a table/domain or automatic action on assignment.

**Context and lifecycle**

The generic name and source comments are not a stable universal type registry. The consumer defines whether it is an event type or another configured type.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Validate the exact domain and application scope. Do not reuse one value across incompatible type tables simply because each uses an integer key.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
