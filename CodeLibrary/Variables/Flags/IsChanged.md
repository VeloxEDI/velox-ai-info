---
title: "IsChanged"
description: "General action-level reference flag intended to indicate that the overall transaction/data changed."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - change-signal
---

```Delphi
IsChanged: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  IsChanged := True;
  Value := IsChanged;
end;
```

### Usage

`IsChanged` is a general action-level reference flag intended to indicate that the overall transaction/data changed.

Treat the name as a configured contract and document the chosen polarity. Setting it does not persist data, calculate a comparison or trigger anything by itself.

### Additional Technical Info
`IsChanged` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FIsChanged` |
| Reset/default | Action data reset assigns `False`. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

Current traced core exposes and resets the field but has no direct consumer that guarantees a save, event or notification. Downstream scriptlets/configuration can inspect it.

**Context and lifecycle**

Source comments conflict: the field/reset comments say the transaction has changed, while the property comment mentions incoming data being the same as existing response data. The executable code only stores the Boolean.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Treat the name as a configured contract and document the chosen polarity. Setting it does not persist data, calculate a comparison or trigger anything by itself.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
