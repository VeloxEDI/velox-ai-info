---
title: "UserNum"
description: "Carries the current action's Velox user-number reference when supplied by the authenticated API execution context."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - identity-reference
---

```Delphi
UserNum: LongInt
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Read the context; do not assign identity to authorise an operation. }
  Value := UserNum;
end;
```

### Usage

`UserNum` carries the current action's Velox user-number reference when supplied by the authenticated API execution context.

Do not trust or overwrite it to impersonate a user, authorise data or establish audit identity. Validate the surrounding authenticated context and use the security subsystem's decision; treat 0/-1 as non-user sentinels according to the flow contract.

### Additional Technical Info
`UserNum` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FUserNum` / `UserNum` property |
| Reset/default | Action data reset assigns `-1`. API action setup assigns `StrToIntDef(X-UserNum, 0)` through the action property. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

The normal action property setter also writes `Locals['VeloxUserNum'].AsInteger`. The script variable is pointer-bound to action storage; do not rely on a script assignment reproducing setter side effects.

**Context and lifecycle**

The value is context data, not an authentication operation. Outside API setup it can remain `-1` or be assigned by other action logic.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Do not trust or overwrite it to impersonate a user, authorise data or establish audit identity. Validate the surrounding authenticated context and use the security subsystem's decision; treat 0/-1 as non-user sentinels according to the flow contract.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
