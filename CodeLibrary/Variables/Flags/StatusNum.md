---
title: "StatusNum"
description: "General action-level reference intended to carry a configured status-type identifier."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - status-reference
---

```Delphi
StatusNum: LongInt
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  StatusNum := 1001;
  Value := StatusNum;
end;
```

### Usage

`StatusNum` is a general action-level reference intended to carry a configured status-type identifier.

Document the exact status domain and mapping. Never use the integer alone as proof of process success/failure or database state.

### Additional Technical Info
`StatusNum` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FStatusNum` |
| Reset/default | Action data reset assigns `-1` as the unset sentinel. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

Assignment does not change `Action.Log.StatusType`, update a transaction status column or persist a status. A downstream contract must consume it.

**Context and lifecycle**

Product comments explicitly distinguish this reference from transaction-table statuses such as `Order_Hdr.StatusNum`.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Document the exact status domain and mapping. Never use the integer alone as proof of process success/failure or database state.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
